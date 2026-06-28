import Filter from "./FilterComponent";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const onFetch = jest.fn();

describe("Checks Filter component behavior", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the input with default placeholder", () => {
		render(
			<Filter
				initURL="https://rickandmortyapi.com/api/character"
				onFetch={onFetch}
				advancedButton={false}
				onParamsChange={function (params: Record<string, string>): void {
					throw new Error("Function not implemented.");
				}}
			/>
		);

		expect(
			screen.getByPlaceholderText("Filter by name...")
		).toBeInTheDocument();
	});

	it("renders the input with custom placeholder", () => {
		render(
			<Filter
				searchPlaceholder="Jest test placeholder"
				initURL="https://rickandmortyapi.com/api/character"
				onFetch={onFetch}
				advancedButton={false}
				onParamsChange={function (params: Record<string, string>): void {
					throw new Error("Function not implemented.");
				}}
			/>
		);

		expect(
			screen.getByPlaceholderText("Jest test placeholder")
		).toBeInTheDocument();
	});

	it("calls onFetch with correct URL when user types in input", async () => {
		render(
			<Filter
				initURL="https://rickandmortyapi.com/api/character"
				onFetch={onFetch}
				advancedButton={false}
				onParamsChange={function (params: Record<string, string>): void {
					throw new Error("Function not implemented.");
				}}
			/>
		);

		await userEvent.type(
			screen.getByPlaceholderText("Filter by name..."),
			"Ri"
		);

		await waitFor(() => {
			expect(onFetch).toHaveBeenLastCalledWith(
				"https://rickandmortyapi.com/api/character/?name=ri"
			);
		});
	});

	it("shows advanced filters button when advancedButton is true", () => {
		render(
			<Filter
				initURL="https://rickandmortyapi.com/api/character"
				onFetch={onFetch}
				advancedButton={true}
				onParamsChange={function (params: Record<string, string>): void {
					throw new Error("Function not implemented.");
				}}
			/>
		);

		expect(screen.getByText("advanced filters")).toBeInTheDocument();
	});

	it("does not show advanced filters button when advancedButton is false", () => {
		render(
			<Filter
				initURL="https://rickandmortyapi.com/api/character"
				onFetch={onFetch}
				advancedButton={false}
				onParamsChange={function (params: Record<string, string>): void {
					throw new Error("Function not implemented.");
				}}
			/>
		);

		expect(screen.queryByText("advanced filters")).not.toBeInTheDocument();
	});
});
