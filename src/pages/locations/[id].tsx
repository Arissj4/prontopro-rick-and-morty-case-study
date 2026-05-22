import { RMCharacter, RMLocation } from "@/lib/costumeTypes";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image"
import Link from "next/link";
import Back from "@/public/back.svg"
import CharacterComponent from "@/components/CharacterComponent";

type ProfileProps = {
  data: RMLocation,
  residentsData: RMCharacter[]
}

export default function Profile({ data, residentsData }: ProfileProps){
  const [location, setLocation] = useState<RMLocation>(data)
  const [residents, setResidents] = useState<RMCharacter[]>(residentsData);

  useEffect(() => {console.log(residents)}, [residents])
  return(
    <>
      <div className="p-4">
        <div>
          <Link
            className="flex hover:cursor-pointer"
            href={"/locations/"}
          >
            <Image src={Back} alt="Go back" width={24} height={24}/>
            <span className="ml-2">Go Back</span>
          </Link>
        </div>

        <section className="locationInfo-container">
          <div className="locationInfo-container__title">
            <h1 className="text-center text-[32px] font-normal mt-4">{location.name}</h1>
          </div>

          <div className="locationInfo-container__type">
            <span>
              Type
            </span>
            <span>
              Dimension
            </span>
          </div>

          <div className="locationInfo-container__dimension">
            <span>
              {location.type}
            </span>
            <span>
              {location.dimension === "unknown" ? "Unknown" : location.dimension}
            </span>
          </div>
        </section>

        <section className="residents-container">
          <h2 className="residents-container__title">
            Residents
          </h2>

          {residents.length > 0 ?
            residents.map(resident => (
              <CharacterComponent character={resident} key={resident.id} />
            ))
          :
            <p className="text-[18px] font-medium">No residents found for this location.</p>
          }
        </section>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const res = await fetch(`https://rickandmortyapi.com/api/location/${context.query.id}`)
  const data = await res.json()


  const residentsQueryIds = data.residents.map((episode: string) => episode.split('/').pop());
  const query: string = residentsQueryIds.join();
  const residentsRes = await fetch(`https://rickandmortyapi.com/api/character/${query}`);
  let residentsData: RMCharacter[] = await residentsRes.json(); // This might be an array or a single object
  if (!Array.isArray(residentsData)) {
    residentsData = [residentsData];
  }
  return {
    props: {
      data,
      residentsData
    }
  }
}