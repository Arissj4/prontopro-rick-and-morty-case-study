import { RMEpisode, RMLocation } from "@/lib/costumeTypes";
import Link from "next/link";

type SimpleCardProps =
	| {
			type: "location";
			data: RMLocation;
	  }
	| {
			type: "episode";
			data: RMEpisode;
	  };

export default function SimpleCardComponent({ type, data }: SimpleCardProps) {
	return (
		<>
			{type === "location" ? (
				<Link
					className="simple-card-card"
					href={`/locations/${data.id}`}
				>
					<div className="simple-card-card__info">
						<h2>{data.name}</h2>
						<h4>{data.type}</h4>
					</div>
				</Link>
			) : type === "episode" ? (
				<Link
					className="simple-card-card"
					href={`/episodes/${data.id}`}
				>
					<div className="simple-card-card__info">
						<h2>{data.name}</h2>
						<h4>{data.air_date}</h4>
						<h3>{data.episode}</h3>
					</div>
				</Link>
			) : null}
		</>
	);
}
