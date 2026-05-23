import { RMLocation, RMEpisode } from "@/lib/costumeTypes";
import SimpleCardComponent from "./SimpleCardComponent";
import { render, screen } from "@testing-library/react";

const mockLocation: RMLocation = {
	id: 1,
	name: "Earth",
	type: "Planet",
	dimension: "Dimension C-137",
	residents: [
		"https://rickandmortyapi.com/api/character/1",
		"https://rickandmortyapi.com/api/character/2",
		// ...
	],
	url: "https://rickandmortyapi.com/api/location/1",
	created: "2017-11-10T12:42:04.162Z",
};

const mockEpisode: RMEpisode = {
	id: 1,
	name: "Pilot",
	air_date: "December 2, 2013",
	episode: "S01E01",
	characters: [
		"https://rickandmortyapi.com/api/character/1",
		"https://rickandmortyapi.com/api/character/2",
		//...
	],
	url: "https://rickandmortyapi.com/api/episode/1",
	created: "2017-11-10T12:56:33.798Z",
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe("Check SimpleCardComponent rendering", () => {
	it("Check Location name and type", () => {
		render(<SimpleCardComponent data={mockLocation} type={"location"} />);
		expect(screen.getByText("Earth")).toBeInTheDocument();
		expect(screen.getByText("Planet")).toBeInTheDocument();
	});

	it("Check Episode name, air_date, and episode code", () => {
		render(<SimpleCardComponent data={mockEpisode} type={"episode"} />);
		expect(screen.getByText("Pilot")).toBeInTheDocument();
		expect(screen.getByText("December 2, 2013")).toBeInTheDocument();
		expect(screen.getByText("S01E01")).toBeInTheDocument();
	});

	it("Check the routing of the user", () => {
		render(<SimpleCardComponent data={mockLocation} type={"location"} />);
		const characterCard = screen.getByRole("link");
		expect(characterCard).toHaveAttribute("href", "/locations/1");
	});

	it("Check the routing of the user", () => {
		render(<SimpleCardComponent data={mockEpisode} type={"episode"} />);
		const characterCard = screen.getByRole("link");
		expect(characterCard).toHaveAttribute("href", "/episodes/1");
	});
});
