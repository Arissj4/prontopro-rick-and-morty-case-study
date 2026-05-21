import { Character } from "@/lib/costumeTypes";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image"
import Link from "next/link";
import Back from "@/public/back.svg"

type ProfileProps = {
  data: Character
}

export default function Profile({ data }: ProfileProps){
  const [profile, setProfile] = useState<Character>(data);

  useEffect(() => {
    console.log(profile)
  },[profile])
  return(
    <>
      <div className="p-4">
        <div>
          <Link
            className="flex hover:cursor-pointer"
            href={"/"}
          >
            <Image src={Back} alt="Go back" width={24} height={24}/>
            <span className="ml-2">Go Back</span>
          </Link>
        </div>

        <div className="flex justify-center mt-2">
          <img
            src={profile.image}
            alt="User image"
            width={146}
            height={146}
            className="rounded-full border-[5px] border-[#F2F2F7]"
          />
        </div>

        <div>
          <h1 className="text-center text-[32px] font-normal mt-4">{profile.name}</h1>
        </div>

        <section className="userinfo-container">
          <h2 className="userinfo-container__title">
            Information
          </h2>

          <div className="userinfo-container__content">
            <div className="userinfo-container__content__item">
              <span className="userinfo-container__content__item__label">Gender</span>
              <span className="userinfo-container__content__item__value">{profile.gender}</span>
            </div>

            <div className="userinfo-container__content__item">
              <span className="userinfo-container__content__item__label">Status</span>
              <span className="userinfo-container__content__item__value">{profile.status}</span>
            </div>

            <div className="userinfo-container__content__item">
              <span className="userinfo-container__content__item__label">Specie</span>
              <span className="userinfo-container__content__item__value">{profile.species}</span>
            </div>

            <div className="userinfo-container__content__item">
              <span className="userinfo-container__content__item__label">Origin</span>
              <span className="userinfo-container__content__item__value">{profile.origin.name}</span>
            </div>

            <div className="userinfo-container__content__item">
              <span className="userinfo-container__content__item__label">Type</span>
              <span className="userinfo-container__content__item__value">{profile.type}</span>
            </div>

            <div className="userinfo-container__content__item">
              <span className="userinfo-container__content__item__label">Location</span>
              <span className="userinfo-container__content__item__value">{profile.location.name}</span>
            </div>
          </div>

        </section>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const res = await fetch(`https://rickandmortyapi.com/api/character/${context.query.id}`)
  const data = await res.json()

  return {
    props: {
      data: data
    }
  }
}