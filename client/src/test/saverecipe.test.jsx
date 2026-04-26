import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllRecipesPage from "../pages/allrecipes.jsx";

vi.mock("../api/saveRecipe.js", () => ({
    fetchMySavedRecipes: vi.fn(() => Promise.resolve([])),
    saveRecipe: vi.fn(() => Promise.resolve({ message: "Recipe saved" })),
}));

describe("AllRecipesPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "dream-pie",
                            name: "Dream Pie",
                            timeMinutes: 30,
                            ingredients: ["cream", "sugar"],
                            image_url: "",
                        },
                    ]),
            })
        );
    });

    it("shows a Save Recipe button for an unsaved recipe", async () => {
        render(
            <MemoryRouter>
                <AllRecipesPage />
            </MemoryRouter>
        );

        const saveButton = await screen.findByRole("button", {
            name: /save recipe/i,
        });

        expect(saveButton).toBeTruthy();
    });
});