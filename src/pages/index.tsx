import RandMPicture from "@/public/rick-and-morty.svg"
import Image from "next/image"
import Filter from "@/components/FilterComponent"
import type { Character } from "@/lib/costumeTypes"
import CharacterComponent from "@/components/CharacterComponent"

type HomeProps = {
	characters: Character[];
}

const Home = ({ characters }: HomeProps) => {
	return (
		<>
			<div className='page flex flex-col items-center'>
				<Image src={RandMPicture} alt="Rick and Morty Logo" />

				<Filter advancedButton={true}/>

				<section className="w-full flex flex-col items-center">
					{characters.map(character => (
						<CharacterComponent character={character} key={character.id} />
					))}
				</section>

			</div>
		</>
	)
}

export async function getServerSideProps () {

	const res = await fetch("https://rickandmortyapi.com/api/character");

	const data = await res.json();

	return {
		props: {
			characters: data.results,
		}
	}
}

export default Home;
