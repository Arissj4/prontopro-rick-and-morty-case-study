import { useState } from "react";

export function usePageData<T>(initData: T[], initNextPage: string | null) {
	const [data, setData] = useState<T[]>(initData);
	const [nextPage, setNextPage] = useState<string | null>(initNextPage);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const fetchData = async (url: string) => {
		try {
			setIsLoading(true);
			document.body.style.overflow = "hidden";

			const res = await fetch(url);
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);

			const json = await res.json();
			setData(json.results ?? []);
			setNextPage(json.info?.next ?? null);
		} catch (error) {
			setIsError(true);
			console.error(error);
		} finally {
			setIsLoading(false);
			document.body.style.overflow = "";
		}
	};

	const getMoreData = async () => {
		if (!nextPage) return;

		try {
			setIsLoading(true);
			document.body.style.overflow = "hidden";

			// Fetch the next page and append the new results to the current list.
			const res = await fetch(nextPage);
			const data = await res.json();
			setData((prevCharacters) => [...prevCharacters, ...data.results]);
			setNextPage(data.info.next);
		} catch (error) {
			setIsError(true);
			console.log(error);
		} finally {
			setIsLoading(false);
			document.body.style.overflow = "";
		}
	};

	const clearError = () => setIsError(false);

	return {
		data,
		nextPage,
		isLoading,
		isError,
		fetchData,
		getMoreData,
		clearError,
	};
}
