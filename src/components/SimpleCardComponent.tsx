import { RMEpisode, RMLocation } from "@/lib/costumeTypes";
import { useRouter } from "next/navigation";

type SimpleCardProps = {
  type: "location",
  data: RMLocation
} |
{
  type: "episode",
  data: RMEpisode
}

export default function SimpleCardComponent({ type, data }: SimpleCardProps) {
  const router = useRouter();
  return(
    <>
      {type === 'location' ? (
        <div
          className="simple-card-card"
          onClick={() => router.push(`/locations/${data.id}`)}
        >
          <div className="simple-card-card__info">
            <h2>{data.name}</h2>
            <h4>{data.type}</h4>
          </div>
        </div>
      )
      : type === 'episode' ? (
        <div
          className="simple-card-card"
          onClick={() => router.push(`/episodes/${data.id}`)}
        >
          <div className="simple-card-card__info">
            <h2>{data.name}</h2>
            <h4>{data.air_date}</h4>
            <h3>{data.episode}</h3>
          </div>
        </div>
      )
      : null}
      {/* <div
        className="simple-card-card"
        onClick={() => router.push(`/profile/${character.id}`)}
      >
        <img className="character-card__image" src={character.image} alt={character.name} loading="lazy"/>
        <div className="character-card__info">
          <h2>{character.name}</h2>
          <h4>{character.species}</h4>
        </div>
      </div> */}
    </>
  )
}