import Navbar from "./NavbarComponent";
import { render, screen } from "@testing-library/react";

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
});
