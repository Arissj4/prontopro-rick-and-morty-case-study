import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Pagination from "@/components/PaginationComponents";

const mockProps = {
	nextPage: "https://rickandmortyapi.com/api/character?page=2",
	setData: jest.fn(),
	setNextPage: jest.fn(),
	setIsLoading: jest.fn(),
	setIsError: jest.fn(),
};

beforeEach(() => {
	global.fetch = jest.fn();
	jest.clearAllMocks();
});

describe("Check rendering of PaginationComponent", () => {
	it("shows the load more button", () => {
		render(<Pagination {...mockProps} />);
		expect(screen.getByText("load more")).toBeInTheDocument();
	});
});

describe("Check state management", () => {
	it("Check setIsLoading(true) when button is clicked", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			json: async () => ({ results: [], info: { next: null } }),
		});

		render(<Pagination {...mockProps} />);
		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => {
			expect(mockProps.setIsLoading).toHaveBeenCalledWith(true);
		});
	});

	it("Check setIsLoading(false) after fetch finishes", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			json: async () => ({ results: [], info: { next: null } }),
		});

		render(<Pagination {...mockProps} />);
		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => {
			expect(mockProps.setIsLoading).toHaveBeenCalledWith(false);
		});
	});

	it("calls setIsError(true) when fetch fails", async () => {
		(fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

		render(<Pagination {...mockProps} />);
		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => {
			expect(mockProps.setIsError).toHaveBeenCalledWith(true);
		});
	});

	it("does not fetch when nextPage is null", async () => {
		render(<Pagination {...mockProps} nextPage={null} />);
		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => {
			expect(fetch).not.toHaveBeenCalled();
		});
	});
});
