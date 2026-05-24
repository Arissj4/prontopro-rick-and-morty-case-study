import Filter from "./FilterComponent";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const setData = jest.fn();
const setNextPage = jest.fn();
const setIsLoading = jest.fn();
const setIsError = jest.fn();

describe("Checks Filter component behavior", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
		jest.clearAllMocks();
	});

	it("Check rendering the input with placeholder", () => {
		render(
			<Filter
				initURL="https://rickandmortyapi.com/api/character"
				setData={setData}
				setNextPage={setNextPage}
				setIsLoading={setIsLoading}
				setIsError={setIsError}
				advancedButton={false}
			/>
		);

		expect(
			screen.getByPlaceholderText("Filter by name...")
		).toBeInTheDocument();
	});

	it("Check rendering the input with costume placeholder", () => {
		render(
			<Filter
				searchPlaceholder="Jest test placeholder"
				initURL="https://rickandmortyapi.com/api/character"
				setData={setData}
				setNextPage={setNextPage}
				setIsLoading={setIsLoading}
				setIsError={setIsError}
				advancedButton={false}
			/>
		);

		expect(
			screen.getByPlaceholderText("Jest test placeholder")
		).toBeInTheDocument();
	});

	it("Calls fetch when user types in input", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			json: async () => ({
				results: [{ id: 1, name: "Rick Sanchez" }],
				info: { next: "next-page-url" },
			}),
		});

		render(
			<Filter
				initURL="https://rickandmortyapi.com/api/character"
				setData={setData}
				setNextPage={setNextPage}
				setIsLoading={setIsLoading}
				setIsError={setIsError}
				advancedButton={false}
			/>
		);

		await userEvent.type(
			screen.getByPlaceholderText("Filter by name..."),
			"Ri"
		);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				"https://rickandmortyapi.com/api/character/?name=ri"
			);
		});

		expect(setIsLoading).toHaveBeenCalledWith(true);
		expect(setData).toHaveBeenCalledWith([{ id: 1, name: "Rick Sanchez" }]);
		expect(setNextPage).toHaveBeenCalledWith("next-page-url");
		expect(setIsLoading).toHaveBeenCalledWith(false);
	});
});
