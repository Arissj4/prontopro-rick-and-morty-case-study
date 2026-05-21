import RandMPicture from "@/public/rick-and-morty.svg"
import Image from "next/image"
import Filter from "@/components/FilterComponent"
import type { Character } from "@/lib/costumeTypes"
import CharacterComponent from "@/components/CharacterComponent"
import Pagination from "@/components/PaginationComponents"
import { GetServerSideProps } from "next"
import { useState } from "react"

type HomeProps = {
	initCharacters: Character[],
	initNextPage: string
}

const Home = ({ initCharacters, initNextPage }: HomeProps) => {

	const [characters, setCharacters] = useState<Character[]>(initCharacters);
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
				<Image src={RandMPicture} alt="Rick and Morty Logo" />

				<Filter initURL={'https://rickandmortyapi.com/api/character'} nextPage={nextPage} setData={setCharacters} setNextPage={setNextPage} setIsLoading={setIsLoading} advancedButton={true}/>

				<section className="w-full flex flex-col items-center">
					{characters.length > 0 ?
						(characters?.map(character => (
							<CharacterComponent character={character} key={character.id} />
						)))
					:
						<div className="text-[18px] font-medium">
							No characters found.
						</div>
					}
				</section>

				{characters.length > 0 && nextPage && (
					<Pagination nextPage={nextPage} setData={setCharacters} setNextPage={setNextPage} setIsLoading={setIsLoading}/>
				)}
			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps<HomeProps>= async () => {

	const res = await fetch(`https://rickandmortyapi.com/api/character`);

	const data = await res.json();

	return {
		props: {
			initCharacters: data.results,
			initNextPage: data.info.next,
		}
	}
}

export default Home;
