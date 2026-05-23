import CharacterComponent from "./CharacterComponent";
import { render, screen } from "@testing-library/react";
import type { RMCharacter } from "@/lib/costumeTypes";

const mockCharacter: RMCharacter = {
	id: 1,
	name: "Rick Sanchez",
	status: "Alive",
	species: "Human",
	type: "",
	gender: "Male",
	origin: {
		name: "Earth",
		url: "https://rickandmortyapi.com/api/location/1",
	},
	location: {
		name: "Earth",
		url: "https://rickandmortyapi.com/api/location/20",
	},
	image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
	episode: [
		"https://rickandmortyapi.com/api/episode/1",
		"https://rickandmortyapi.com/api/episode/2",
		// ...
	],
	url: "https://rickandmortyapi.com/api/character/1",
	created: "2017-11-04T18:48:46.250Z",
};

describe("Check CharacterComponent rendering", () => {
	// Check the component to render the Name of the character
	it("Check name rendering", () => {
		render(<CharacterComponent character={mockCharacter} />);
		expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
	});

	// Check the component to render the Image of the character
	it("Check the image rendering", () => {
		render(<CharacterComponent character={mockCharacter} />);
		expect(screen.getByRole("img")).toBeInTheDocument();
	});

	// Check redirecting the user to the correct details page
	it("Check the routing of the user", () => {
		render(<CharacterComponent character={mockCharacter} />);
		const characterCard = screen.getByRole("link");
		expect(characterCard).toHaveAttribute("href", "/profile/1");
	});
});
