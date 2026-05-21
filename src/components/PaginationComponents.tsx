import { Character } from "@/lib/costumeTypes"
import { useState } from "react";

type PaginationProps = {
  data: Character[],
  nextPage: string | null,
  setData: React.Dispatch<React.SetStateAction<Character[]>>,
  setNextPage: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Pagination ({data, nextPage, setData, setNextPage, setIsLoading}: PaginationProps){

  const getMoreData = async () => {

    if (!nextPage) return;

    try{
      setIsLoading(true);
      document.body.style.overflow = "hidden";

      const res = await fetch(nextPage);
      const data = await res.json();
      setData(prevCharacters => [...prevCharacters, ...data.results]);
      setNextPage(data.info.next);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      document.body.style.overflow = "";
    }
  }

  return(
    <div className="flex justify-center w-full">
      <button
        className="pagination-button"
        onClick={() => getMoreData()}
      >
        laod more
      </button>
    </div>
  )
}