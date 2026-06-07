import { useState } from "react";
import Image from "next/image";
import type { RMEpisode } from "@/lib/costumeTypes";
import { GetServerSideProps } from "next";
import Filter from "@/components/FilterComponent";
import Pagination from "@/components/PaginationComponents";
import SimpleCardComponent from "@/components/SimpleCardComponent";

type EpisodesProps = {
	initCharacters: RMEpisode[];
	initNextPage: string;
};

export default function Episodes({
	initCharacters,
	initNextPage,
}: EpisodesProps) {
	const [episodes, setLocations] = useState<RMEpisode[]>(initCharacters);
	const [nextPage, setNextPage] = useState<string | null>(initNextPage);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

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
					<button
						className="pagination-button mt-4"
						onClick={() => setIsError(false)}
					>
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

				<Filter<RMEpisode>
					searchPlaceholder="Name or episode (ex.S01E01)..."
					initURL={"https://rickandmortyapi.com/api/episode"}
					setData={setLocations}
					setNextPage={setNextPage}
					setIsLoading={setIsLoading}
					advancedButton={false}
					setIsError={setIsError}
				/>

				<section className="w-full flex flex-col items-center">
					{episodes.length > 0 ? (
						episodes?.map((episode) => (
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

				{episodes.length > 0 && nextPage && (
					<Pagination<RMEpisode>
						nextPage={nextPage}
						setData={setLocations}
						setNextPage={setNextPage}
						setIsLoading={setIsLoading}
						setIsError={setIsError}
					/>
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
