type PaginationProps<T> = {
	nextPage: string | null;
	setData: React.Dispatch<React.SetStateAction<T[]>>;
	setNextPage: React.Dispatch<React.SetStateAction<string | null>>;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setIsError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Pagination<T>({
	nextPage,
	setData,
	setNextPage,
	setIsLoading,
	setIsError,
}: PaginationProps<T>) {
	const getMoreData = async () => {
		if (!nextPage) return;

		try {
			setIsLoading(true);
			document.body.style.overflow = "hidden";

			const res = await fetch(nextPage);
			const data = await res.json();
			setData((prevCharacters) => [...prevCharacters, ...data.results]);
			setNextPage(data.info.next);
		} catch (error) {
			setIsError(true);
			console.log(error)
		} finally {
			setIsLoading(false);
			document.body.style.overflow = "";
		}
	};

	return (
		<div className="flex justify-center w-full">
			<button className="pagination-button" onClick={() => getMoreData()}>
				laod more
			</button>
		</div>
	);
}
