import Navbar from "./NavbarComponent";
import { fireEvent, render, screen } from "@testing-library/react";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

describe("Check Navbar rendering and routing", () => {
	beforeEach(() => {
		mockPush.mockClear();
	});

	it("Check Navbar toggle button rendering", () => {
		render(<Navbar />);

		const toggleButton = screen.getByRole("button", { name: "Toggle menu" });

		expect(toggleButton).toBeInTheDocument();
	});

	it("Opens the menu when toggle button is clicked", () => {
		render(<Navbar />);

		fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));

		expect(screen.getByText("Characters")).toBeInTheDocument();
		expect(screen.getByText("Locations")).toBeInTheDocument();
		expect(screen.getByText("Episodes")).toBeInTheDocument();
	});

	it("Goes to Locations page, then Locations is clicked", () => {
		render(<Navbar />);

		fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
		fireEvent.click(screen.getByText("Locations"));

		expect(mockPush).toHaveBeenCalledWith("/locations");
	});
});
