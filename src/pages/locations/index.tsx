import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import type { RMLocation } from "@/lib/costumeTypes";
import { GetServerSideProps } from "next";
import Filter from "@/components/FilterComponent";
import Pagination from "@/components/PaginationComponents";
import SimpleCardComponent from "@/components/SimpleCardComponent";
import getAdvancedFilters from "@/lib/getAdvancedFilters";
import { usePageData } from "@/lib/usePageData";

type LocationsProps = {
	initCharacters: RMLocation[];
	initNextPage: string;
};

export default function Locations({
	initCharacters,
	initNextPage,
}: LocationsProps) {
	const {
		data,
		nextPage,
		isLoading,
		isError,
		fetchData,
		getMoreData,
		clearError,
	} = usePageData<RMLocation>(initCharacters, initNextPage);

	const router = useRouter();

	useEffect(() => {
		const { name, ...filterParams } = router.query as Record<string, string>;
		if (!name && Object.keys(filterParams).length === 0) return;

		let url = `https://rickandmortyapi.com/api/location/?`;
		if (name) url += `name=${name}`;
		Object.entries(filterParams).forEach(([key, value]) => {
			if (value) url += `&${key}=${value}`;
		});

		fetchData(url);
	}, [fetchData, router.query]);

	const [filters, setFilters] = useState<Record<string, Set<string>>>({
		type: new Set(),
		dimension: new Set(),
	});

	// Loads available advanced filter options when the user clicks on the advanced filters button
	const handleFilters = async () => {
		const alreadyLoaded = Object.values(filters).some((set) => set.size > 0);
		if (alreadyLoaded) return;
		const res = await getAdvancedFilters<RMLocation>(
			filters,
			"https://rickandmortyapi.com/api/location"
		);
		setFilters(res);
	};

	const handleParamsChange = (params: Record<string, string>) => {
		router.push({ pathname: "/locations", query: params }, undefined, {
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
					src="/RandM.svg"
					width={500}
					height={200}
					alt="Rick and Morty Logo"
				/>

				<Filter
					initURL={"https://rickandmortyapi.com/api/location"}
					onFetch={fetchData}
					onParamsChange={handleParamsChange}
					advancedButton={true}
					filters={filters}
					handleFilters={handleFilters}
				/>

				<section className="w-full flex flex-col items-center">
					{data.length > 0 ? (
						data?.map((location: RMLocation) => (
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

				{data.length > 0 && nextPage && (
					<Pagination onGetMoreData={getMoreData} />
				)}
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	LocationsProps
> = async () => {
	try {
		const res = await fetch(`https://rickandmortyapi.com/api/location`);

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
