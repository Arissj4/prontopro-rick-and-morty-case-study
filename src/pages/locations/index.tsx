import { useState } from "react";
import Image from "next/image";
import type { RMLocation } from "@/lib/costumeTypes";
import { GetServerSideProps } from "next";
import Filter from "@/components/FilterComponent";
import Pagination from "@/components/PaginationComponents";
import SimpleCardComponent from "@/components/SimpleCardComponent";
import getAdvancedFilters from "@/lib/getAdvancedFilters";

type LocationsProps = {
	initCharacters: RMLocation[];
	initNextPage: string;
};

export default function Locations({
	initCharacters,
	initNextPage,
}: LocationsProps) {
	const [locations, setLocations] = useState<RMLocation[]>(initCharacters);
	const [nextPage, setNextPage] = useState<string | null>(initNextPage);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const [filters, setFilters] = useState<Record<string, Set<string>>>({
		type: new Set(),
		dimension: new Set(),
	});

	// Loads available advanced filter options when the user clicks on the advanced filters button
	const handleFilters = async () => {
		const res = await getAdvancedFilters<RMLocation>(
			filters,
			"https://rickandmortyapi.com/api/location"
		);
		setFilters(res);
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
					src="/RandM.svg"
					width={500}
					height={200}
					alt="Rick and Morty Logo"
				/>

				<Filter<RMLocation>
					initURL={"https://rickandmortyapi.com/api/location"}
					setData={setLocations}
					setNextPage={setNextPage}
					setIsLoading={setIsLoading}
					advancedButton={true}
					filters={filters}
					handleFilters={handleFilters}
					setIsError={setIsError}
				/>

				<section className="w-full flex flex-col items-center">
					{locations.length > 0 ? (
						locations?.map((location) => (
							<SimpleCardComponent
								type={"location"}
								data={location}
								key={location.id}
							/>
						))
					) : (
						<div className="text-[18px] font-medium">No Locations found.</div>
					)}
				</section>

				{locations.length > 0 && nextPage && (
					<Pagination<RMLocation>
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
	LocationsProps
> = async () => {
	const res = await fetch(`https://rickandmortyapi.com/api/location`);

	const data = await res.json();

	return {
		props: {
			initCharacters: data.results,
			initNextPage: data.info.next,
		},
	};
};
