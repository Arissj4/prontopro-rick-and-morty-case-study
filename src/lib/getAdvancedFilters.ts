import { RMCharacter, RMLocation } from "./costumeTypes";

export default async function getAdvancedFilters <T extends RMCharacter | RMLocation>(filters: Record<string, Set<string>>, mainURL: string): Promise<Record<string, Set<string>>> {
  let url: string | null = mainURL;

  const selectedFilters = Object.keys(filters);

  while (url) {
    const res: Response = await fetch(url);
    const data = await res.json();

    data.results.forEach((element: T) => {
      selectedFilters.forEach((filter) => {
        filters[filter].add(element[filter as keyof T] as string);
      });
    });

    url = data.info.next;
  }
  return filters;
};