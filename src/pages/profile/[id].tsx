import { Character } from "@/lib/costumeTypes";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";

type ProfileProps = {
  data: Character
}

export default function Profile({ data }: ProfileProps){
  const [profile, setProfile] = useState<Character>(data);


  return(
    <>
      <h1>Profile Page</h1>
      <p>Character ID: {profile?.name}</p>
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