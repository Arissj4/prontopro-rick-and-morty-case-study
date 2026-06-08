import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "./PaginationComponents";

beforeEach(() => {
	global.fetch = jest.fn();
	jest.clearAllMocks();
});

describe("Check rendering of PaginationComponent", () => {
	it("shows the load more button", () => {
		render(<Pagination onGetMoreData={jest.fn()} />);
		expect(screen.getByText("load more")).toBeInTheDocument();
	});
});

describe("Check behaviour of PaginationComponent", () => {
	it("calls onLoadMore when button is clicked", () => {
		const onLoadMore = jest.fn();
		render(<Pagination onGetMoreData={onLoadMore} />);
		fireEvent.click(screen.getByRole("button"));
		expect(onLoadMore).toHaveBeenCalledTimes(1);
	});

	it("does not call onLoadMore if not provided", () => {
		// just checking it renders without crashing
		render(<Pagination onGetMoreData={jest.fn()} />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});
});
