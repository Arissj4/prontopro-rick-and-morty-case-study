import { useState } from "react";
import Image from "next/image";
import RM from "@/public/R&M.svg";
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

	return (
		<>
			{isLoading && (
				<div className="fixed z-60 w-md flex h-full justify-center items-center bg-white opacity-60 text-black text-[24px] ">
					Loading...
				</div>
			)}

			<div className={`page flex flex-col items-center`}>
				<Image src={RM} alt="Rick and Morty Logo" />

				<Filter
					searchPlaceholder="Name or episode (ex.S01E01)..."
					initURL={"https://rickandmortyapi.com/api/episode"}
					nextPage={nextPage}
					setData={setLocations}
					setNextPage={setNextPage}
					setIsLoading={setIsLoading}
					advancedButton={false}
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
						<div className="text-[18px] font-medium">No Locations found.</div>
					)}
				</section>

				{episodes.length > 0 && nextPage && (
					<Pagination<RMEpisode>
						nextPage={nextPage}
						setData={setLocations}
						setNextPage={setNextPage}
						setIsLoading={setIsLoading}
					/>
				)}
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	EpisodesProps
> = async () => {
	const res = await fetch(`https://rickandmortyapi.com/api/episode`);

	const data = await res.json();

	return {
		props: {
			initCharacters: data.results,
			initNextPage: data.info.next,
		},
	};
};
