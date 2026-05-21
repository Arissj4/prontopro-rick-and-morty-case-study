import type { Character } from "@/lib/costumeTypes";


export default function CharacterComponent({character}: {character: Character}) {
  return(
    <>
      <div className="character-card">
        <img className="character-card__image" src={character.image} alt={character.name} loading="lazy"/>
        <div className="character-card__info">
          <h2>{character.name}</h2>
          <h4>{character.species}</h4>
        </div>
      </div>
    </>
  )
}