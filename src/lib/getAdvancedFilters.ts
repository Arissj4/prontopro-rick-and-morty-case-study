import { RMCharacter, RMLocation } from "./costumeTypes";

// Fetches all pages from the API and collects unique values for the selected filter keys.
export default async function getAdvancedFilters<
	T extends RMCharacter | RMLocation,
>(
	filters: Record<string, Set<string>>,
	mainURL: string
): Promise<Record<string, Set<string>>> {
	let url: string | null = mainURL;

	const selectedFilters = Object.keys(filters);

	// Continue fetching until the API has no next page.
	while (url) {
		const res: Response = await fetch(url);
		const data = await res.json();

		// Add each selected filter value to its Set to avoid duplicates.
		data.results.forEach((element: T) => {
			selectedFilters.forEach((filter) => {
				filters[filter].add(element[filter as keyof T] as string);
			});
		});

		url = data.info.next;
	}
	return filters;
}
