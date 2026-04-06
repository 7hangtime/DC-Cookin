import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeCard from "../components/recipecard.jsx";

test("renders recipe title and cook time", () => {
    render(
        <RecipeCard
            title="Chicken Alfredo"
            cookTime="30 min"
            variant="browse"
        />
    );

    expect(screen.getByText("Chicken Alfredo")).toBeTruthy();
    expect(screen.getByText(/30 min/i)).toBeTruthy();
});

test("calls onView when button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnView = vi.fn();

    render(
        <RecipeCard
            title="Chicken Alfredo"
            cookTime="30 min"
            variant="browse"
            onView={mockOnView}
        />
    );

    await user.click(screen.getByText(/view recipe/i));

    expect(mockOnView).toHaveBeenCalled();
});

test("renders browse variant correctly", () => {
    render(<RecipeCard title="Test Recipe" variant="browse" />);
    expect(screen.getByText(/recipe available/i)).toBeTruthy();
});

test("renders exact variant correctly", () => {
    render(<RecipeCard title="Test Recipe" variant="exact" />);
    expect(screen.getByText(/uses only your ingredients/i)).toBeTruthy();
});

test("renders partial variant correctly", () => {
    render(
        <RecipeCard
            title="Test Recipe"
            variant="partial"
            missingText="Missing: eggs"
        />
    );

    expect(screen.getByText(/missing: eggs/i)).toBeTruthy();
});