import { useState } from "react";
import Image from "next/image";
import RandM from "@/public/RandM.svg";
import type { RMLocation } from "@/lib/costumeTypes";
import { GetServerSideProps } from "next";
import Filter from "@/components/FilterComponent";
import Pagination from "@/components/PaginationComponents";
import SimpleCardComponent from "@/components/SimpleCardComponent";

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

	const [filters, setFilters] = useState<Record<string, Set<string>>>({
		type: new Set(),
		dimension: new Set(),
	});

	const getFilters = async () => {
		let url: string | null = "https://rickandmortyapi.com/api/location";

		while (url) {
			const res: Response = await fetch(url);
			const data = await res.json();

			data.results.forEach((element: RMLocation) => {
				["type", "dimension"].forEach((filter) => {
					filters[filter].add(element[filter as keyof RMLocation] as string);
				});
			});

			url = data.info.next;
		}
		setFilters(filters);
	};

	return (
		<>
			{isLoading && (
				<div className="fixed z-60 w-md flex h-full justify-center items-center bg-white opacity-60 text-black text-[24px] ">
					Loading...
				</div>
			)}

			<div className={`page flex flex-col items-center`}>
				<Image src={RandM} alt="Rick and Morty Logo" />

				<Filter
					initURL={"https://rickandmortyapi.com/api/location"}
					nextPage={nextPage}
					setData={setLocations}
					setNextPage={setNextPage}
					setIsLoading={setIsLoading}
					advancedButton={true}
					filters={filters}
					getFilter={getFilters}
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
