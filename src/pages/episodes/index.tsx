import Image from "next/image";
import type { RMEpisode } from "@/lib/costumeTypes";
import { GetServerSideProps } from "next";
import Filter from "@/components/FilterComponent";
import Pagination from "@/components/PaginationComponents";
import SimpleCardComponent from "@/components/SimpleCardComponent";
import { usePageData } from "@/lib/usePageData";
import { useEffect } from "react";
import { useRouter } from "next/router";

type EpisodesProps = {
	initCharacters: RMEpisode[];
	initNextPage: string;
};

export default function Episodes({
	initCharacters,
	initNextPage,
}: EpisodesProps) {
	const {
		data,
		nextPage,
		isLoading,
		isError,
		fetchData,
		getMoreData,
		clearError,
	} = usePageData<RMEpisode>(initCharacters, initNextPage);

	const router = useRouter();

	useEffect(() => {
		const { name, episode } = router.query as Record<string, string>;
		if (!name && !episode) return;

		let url = `https://rickandmortyapi.com/api/episode/?`;
		if (episode) url += `episode=${episode}`;
		else if (name) url += `name=${name}`;

		fetchData(url);
	}, [fetchData, router.query]);

	const handleParamsChange = (params: Record<string, string>) => {
		router.push({ pathname: "/episodes", query: params }, undefined, {
			shallow: true,
		});
	};

	return (
		<>
			{isLoading && (
				<div className="fixed z-60 w-md flex h-full justify-center items-center bg-white opacity-60 text-black text-[24px] ">
					Loading...
				</div>
			)}

			{isError && (
				<div className="fixed z-60 w-md flex h-full justify-center items-center bg-white opacity-60 text-black text-[24px] ">
					An error occurred while fetching data.
					<button className="pagination-button mt-4" onClick={clearError}>
						Close
					</button>
				</div>
			)}

			<div className={`page flex flex-col items-center`}>
				<Image
					src="/R&M.svg"
					width={500}
					height={200}
					alt="Rick and Morty Logo"
				/>

				<Filter
					searchPlaceholder="Name or episode (ex.S01E01)..."
					initURL={"https://rickandmortyapi.com/api/episode"}
					onFetch={fetchData}
					onParamsChange={handleParamsChange}
					advancedButton={false}
				/>

				<section className="w-full flex flex-col items-center">
					{data.length > 0 ? (
						data?.map((episode: RMEpisode) => (
							<SimpleCardComponent
								type={"episode"}
								data={episode}
								key={episode.id}
							/>
						))
					) : (
						<div className="text-[18px] font-medium">No Episodes found.</div>
					)}
				</section>

				{data.length > 0 && nextPage && (
					<Pagination onGetMoreData={getMoreData} />
				)}
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	EpisodesProps
> = async () => {
	try {
		const res = await fetch(`https://rickandmortyapi.com/api/episode`);

		if (!res.ok) {
			throw new Error(`Failed to fetch characters: ${res.status}`);
		}

		const data = await res.json();

		return {
			props: {
				initCharacters: data.results,
				initNextPage: data.info.next,
			},
		};
	} catch (error) {
		console.log(`Failed to fetch characters: ${error}`);

		return {
			props: { initCharacters: [], initNextPage: null },
		};
	}
};
