import type { RMCharacter } from "@/lib/costumeTypes";
import Image from "next/image";
import Link from "next/link";

export default function CharacterComponent({
	character,
}: {
	character: RMCharacter;
}) {
	return (
		<>
			<Link
				href={`/profile/${character.id}`}
				className="character-card"
			>
				<Image
					className="character-card__image"
					src={character.image}
					alt={character.name}
					loading="lazy"
					width={500}
					height={200}
				/>
				<div className="character-card__info">
					<h2>{character.name}</h2>
					<h4>{character.species}</h4>
				</div>
			</Link>
		</>
	);
}
