import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AllRecipesPage from "../pages/allrecipes";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../components/recipecard.jsx", () => ({
    default: ({ title, onView }) => (
        <div>
            <span>{title}</span>
            <button onClick={onView}>View Recipe</button>
        </div>
    ),
}));

beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
});

const fakeRecipes = [
    {
        id: "1",
        name: "Chicken Alfredo",
        ingredients: ["chicken", "pasta"],
        ingredients_with_measurements: ["1 lb chicken", "8 oz pasta"],
    },
    {
        id: "2",
        name: "Veggie Omelet",
        ingredients: ["eggs", "spinach"],
        ingredients_with_measurements: ["2 eggs", "1 cup spinach"],
    },
];

test("renders recipes after fetch", async () => {
    fetch.mockResolvedValue({
        ok: true,
        json: async () => fakeRecipes,
    });

    render(
        <MemoryRouter>
            <AllRecipesPage />
        </MemoryRouter>
    );

    expect(await screen.findByText("Chicken Alfredo")).toBeTruthy();
    expect(screen.getByText("Veggie Omelet")).toBeTruthy();
});

test("filters recipes by search input", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValue({
        ok: true,
        json: async () => fakeRecipes,
    });

    render(
        <MemoryRouter>
            <AllRecipesPage />
        </MemoryRouter>
    );

    await screen.findByText("Chicken Alfredo");

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, "omelet");

    expect(screen.queryByText("Chicken Alfredo")).toBeNull();
    expect(screen.getByText("Veggie Omelet")).toBeTruthy();
});

test("shows no results when nothing matches", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValue({
        ok: true,
        json: async () => fakeRecipes,
    });

    render(
        <MemoryRouter>
            <AllRecipesPage />
        </MemoryRouter>
    );

    await screen.findByText("Chicken Alfredo");

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, "banana");

    expect(screen.getByText(/no recipes matched your search/i)).toBeTruthy();
});

test("navigates when clicking view recipe", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValue({
        ok: true,
        json: async () => fakeRecipes,
    });

    render(
        <MemoryRouter>
            <AllRecipesPage />
        </MemoryRouter>
    );

    await screen.findByText("Chicken Alfredo");

    await user.click(screen.getAllByText("View Recipe")[0]);

    expect(mockNavigate).toHaveBeenCalled();
});