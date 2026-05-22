import type { RMCharacter } from "@/lib/costumeTypes";
import { useRouter } from "next/navigation";


export default function CharacterComponent({character}: {character: RMCharacter}) {
  const router = useRouter();
  return(
    <>
      <div
        className="character-card"
        onClick={() => router.push(`/profile/${character.id}`)}
      >
        <img className="character-card__image" src={character.image} alt={character.name} loading="lazy"/>
        <div className="character-card__info">
          <h2>{character.name}</h2>
          <h4>{character.species}</h4>
        </div>
      </div>
    </>
  )
}