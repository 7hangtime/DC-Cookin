/**
 * requireauth.test.jsx
 *
 * Tests for User Story #91 – Better session security and server checking.
 *
 * Scenario coverage:
 *  #92  – Expired token → redirect to /login
 *  #93  – Session → null clears protected component state (children unmounted)
 *  #94  – Login page shows "session expired" banner after redirect
 *  #95  – Cleared cookies on refresh → getSession() returns null → redirect
 *  #97  – Rapid navigation to protected routes when unauthenticated → all blocked
 *  #98  – No component data fetched during failed route access
 *  #99  – Logout calls signOut with global scope (server-side invalidation)
 */

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------------------------------------------------------------
// Shared Supabase mock factory
// --------------------------------------------------------------------------
function makeSupabaseMock({
  session = null,
  authChangeEvent = null,
  authChangeSession = null,
} = {}) {
  const listeners = [];

  const mock = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session } }),
      getUser: vi.fn().mockResolvedValue({ data: { user: session?.user ?? null } }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn((cb) => {
        // Store callback so tests can fire auth events
        listeners.push(cb);
        // If an event was pre-configured, fire it immediately
        if (authChangeEvent) {
          cb(authChangeEvent, authChangeSession);
        }
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      // Helper exposed to tests so they can trigger auth state changes
      _fireAuthChange: (event, newSession) => {
        listeners.forEach((cb) => cb(event, newSession));
      },
    },
  };

  return mock;
}

// --------------------------------------------------------------------------
// Module-level mock for supabase (overridden per test via vi.doMock)
// --------------------------------------------------------------------------
vi.mock("../../supabase", () => ({ supabase: makeSupabaseMock() }));

// Lazy-import components so mocks take effect
async function importComponents() {
  const { default: RequireAuth } = await import("./RequireAuth.jsx");
  const { default: Login } = await import("../pages/login.jsx");
  return { RequireAuth, Login };
}

// --------------------------------------------------------------------------
// Helper: render a protected route
// --------------------------------------------------------------------------
function renderProtectedRoute(RequireAuth, initialPath = "/pantry") {
  const fetchSpy = vi.fn();
  const ProtectedPage = () => {
    // #98 – any data fetch would call this spy
    fetchSpy();
    return <div>Protected Content</div>;
  };

  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/pantry"
          element={
            <RequireAuth>
              <ProtectedPage />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );

  return { fetchSpy };
}

// ==========================================================================
// #95 – Cleared cookies detected on page refresh
// ==========================================================================
describe("#95 – Cleared cookies on refresh", () => {
  it("redirects to /login when getSession returns null (cookies cleared)", async () => {
    vi.doMock("../../supabase", () => ({
      supabase: makeSupabaseMock({ session: null }),
    }));

    const { RequireAuth } = await importComponents();
    renderProtectedRoute(RequireAuth);

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeTruthy();
    });

    expect(screen.queryByText("Protected Content")).toBeNull();
  });
});

// ==========================================================================
// #92 – Expired session token → redirect
// ==========================================================================
describe("#92 – Session token expires → redirect to /login", () => {
  it("redirects when onAuthStateChange fires SIGNED_OUT with no session", async () => {
    // Start with a valid session, then fire SIGNED_OUT
    const validSession = { user: { id: "u1", email: "user@test.com" } };

    const supabaseMock = makeSupabaseMock({ session: validSession });
    vi.doMock("../../supabase", () => ({ supabase: supabaseMock }));

    const { RequireAuth } = await importComponents();
    renderProtectedRoute(RequireAuth);

    // Initially renders protected content
    await waitFor(() =>
      expect(screen.getByText("Protected Content")).toBeTruthy()
    );

    // Simulate token expiry
    act(() => {
      supabaseMock.auth._fireAuthChange("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeTruthy();
    });

    expect(screen.queryByText("Protected Content")).toBeNull();
  });
});

// ==========================================================================
// #93 – Protected component state cleared when session → null
// ==========================================================================
describe("#93 – Protected component unmounted when session becomes null", () => {
  it("unmounts children immediately when session is set to null", async () => {
    const validSession = { user: { id: "u2", email: "user2@test.com" } };
    const supabaseMock = makeSupabaseMock({ session: validSession });
    vi.doMock("../../supabase", () => ({ supabase: supabaseMock }));

    const { RequireAuth } = await importComponents();
    renderProtectedRoute(RequireAuth);

    await waitFor(() =>
      expect(screen.getByText("Protected Content")).toBeTruthy()
    );

    // Session goes null (e.g. token expiry or logout from another device)
    act(() => {
      supabaseMock.auth._fireAuthChange("SIGNED_OUT", null);
    });

    // Protected content must be gone – state is cleared by unmounting
    await waitFor(() => {
      expect(screen.queryByText("Protected Content")).toBeNull();
    });
  });
});

// ==========================================================================
// #94 – Login page shows "session expired" banner
// ==========================================================================
describe("#94 – Session expired message on login page", () => {
  it("shows expired banner when navigated to login with sessionExpired state", () => {
    vi.doMock("../../supabase", () => ({
      supabase: makeSupabaseMock({ session: null }),
    }));

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/login", state: { sessionExpired: true } },
        ]}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );

    // #94 – Banner must be visible
    expect(
      screen.getByText(/your session has expired/i)
    ).toBeTruthy();
  });

  it("does NOT show banner on a fresh login visit (no state)", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText(/your session has expired/i)).toBeNull();
  });
});

// ==========================================================================
// #97 – Rapid navigation attempts all blocked
// ==========================================================================
describe("#97 – Rapid navigation to protected routes while unauthenticated", () => {
  it("blocks every protected route when user is not authenticated", async () => {
    vi.doMock("../../supabase", () => ({
      supabase: makeSupabaseMock({ session: null }),
    }));

    const { RequireAuth } = await importComponents();

    const protectedPaths = ["/pantry", "/results", "/pantry-add"];

    for (const path of protectedPaths) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route
              path={path}
              element={
                <RequireAuth>
                  <div>Protected: {path}</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Page")).toBeTruthy();
      });

      expect(screen.queryByText(`Protected: ${path}`)).toBeNull();
      unmount();
    }
  });
});

// ==========================================================================
// #98 – No component data fetched during failed route access
// ==========================================================================
describe("#98 – No data fetched when route access fails", () => {
  it("protected component fetch spy is never called when unauthenticated", async () => {
    vi.doMock("../../supabase", () => ({
      supabase: makeSupabaseMock({ session: null }),
    }));

    const { RequireAuth } = await importComponents();
    const { fetchSpy } = renderProtectedRoute(RequireAuth);

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeTruthy();
    });

    // #98 – The protected component's fetch must never have been called
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

// ==========================================================================
// #99 – Server-side token invalidation on logout
// ==========================================================================
describe("#99 – Server-side session invalidation on logout", () => {
  it("calls signOut with global scope to revoke all sessions", async () => {
    const validSession = { user: { id: "u3", email: "user3@test.com" } };
    const supabaseMock = makeSupabaseMock({ session: validSession });
    vi.doMock("../../supabase", () => ({ supabase: supabaseMock }));

    const { default: Navbar } = await import("../components/navbar.jsx");

    render(
      <MemoryRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Wait for the Logout button to appear (user is logged in)
    const logoutBtn = await screen.findByRole("button", { name: /logout/i });
    await user.click(logoutBtn);

    // #99 – signOut MUST be called with { scope: "global" }
    expect(supabaseMock.auth.signOut).toHaveBeenCalledWith({ scope: "global" });
  });
});
