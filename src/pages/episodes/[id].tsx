import { RMCharacter, RMEpisode } from "@/lib/costumeTypes";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Back from "@/public/back.svg";
import CharacterComponent from "@/components/CharacterComponent";

type ProfileProps = {
	data: RMEpisode;
	charactersData: RMCharacter[];
};

export default function Profile({ data, charactersData }: ProfileProps) {
	const episode: RMEpisode = data;
	const characters: RMCharacter[] = charactersData;

	return (
		<>
			<div className="p-4">
				<div>
					<Link className="flex hover:cursor-pointer" href={"/episodes/"}>
						<Image src={Back} alt="Go back" width={24} height={24} />
						<span className="ml-2">Go Back</span>
					</Link>
				</div>

				<section className="locationInfo-container">
					<div className="locationInfo-container__title">
						<h1 className="text-center text-[32px] font-normal mt-4">
							{episode.name}
						</h1>
					</div>

					<div className="locationInfo-container__type">
						<span>Episode</span>
						<span>Date</span>
					</div>

					<div className="locationInfo-container__dimension">
						<span>{episode.episode}</span>
						<span>{episode.air_date}</span>
					</div>
				</section>

				<section className="residents-container">
					<h2 className="residents-container__title">Cast</h2>

					{characters.length > 0 ? (
						characters.map((character) => (
							<CharacterComponent character={character} key={character.id} />
						))
					) : (
						<p className="text-[18px] font-medium">
							No characters found for this episode.
						</p>
					)}
				</section>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const res = await fetch(
		`https://rickandmortyapi.com/api/episode/${context.query.id}`
	);
	const data = await res.json();

	const charactersQueryIds = data.characters.map((episode: string) =>
		episode.split("/").pop()
	);
	const query: string = charactersQueryIds.join();
	const charactersRes = await fetch(
		`https://rickandmortyapi.com/api/character/${query}`
	);
	let charactersData: RMCharacter[] = await charactersRes.json();
	if (!Array.isArray(charactersData)) {
		charactersData = [charactersData];
	}
	return {
		props: {
			data,
			charactersData,
		},
	};
};
