import RandMPicture from "@/public/rick-and-morty.svg";
import Image from "next/image";
import Filter from "@/components/FilterComponent";
import type { RMCharacter } from "@/lib/costumeTypes";
import CharacterComponent from "@/components/CharacterComponent";
import Pagination from "@/components/PaginationComponents";
import { GetServerSideProps } from "next";
import { useState } from "react";
import getAdvancedFilters from "@/lib/getAdvancedFilters";

type HomeProps = {
	initCharacters: RMCharacter[];
	initNextPage: string;
};

const Home = ({ initCharacters, initNextPage }: HomeProps) => {
	const [characters, setCharacters] = useState<RMCharacter[]>(initCharacters);
	const [nextPage, setNextPage] = useState<string | null>(initNextPage);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const [filters, setFilters] = useState<Record<string, Set<string>>>({
		species: new Set(),
		gender: new Set(),
		status: new Set(),
	});

	// Loads available advanced filter options when the user clicks on the advanced filters button
	const handleFilters = async () => {
		const res = await getAdvancedFilters<RMCharacter>(
			filters,
			"https://rickandmortyapi.com/api/character"
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
				<div className="fixed z-60 w-md flex flex-col h-full justify-center items-center bg-[#ffffff99] text-black text-[24px] ">
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
					src={RandMPicture}
					alt="Rick and Morty Logo"
					width={500}
					height={200}
				/>

				<Filter<RMCharacter>
					initURL={"https://rickandmortyapi.com/api/character"}
					setData={setCharacters}
					setNextPage={setNextPage}
					setIsLoading={setIsLoading}
					advancedButton={true}
					filters={filters}
					handleFilters={handleFilters}
					setIsError={setIsError}
				/>

				<section className="w-full flex flex-col items-center">
					{characters.length > 0 ? (
						characters?.map((character) => (
							<CharacterComponent character={character} key={character.id} />
						))
					) : (
						<div className="text-[18px] font-medium">No characters found.</div>
					)}
				</section>

				{characters.length > 0 && nextPage && (
					<Pagination<RMCharacter>
						nextPage={nextPage}
						setData={setCharacters}
						setNextPage={setNextPage}
						setIsLoading={setIsLoading}
						setIsError={setIsError}
					/>
				)}
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
	const res = await fetch(`https://rickandmortyapi.com/api/character`);

	const data = await res.json();

	return {
		props: {
			initCharacters: data.results,
			initNextPage: data.info.next,
		},
	};
};

export default Home;
