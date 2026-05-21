import Image from "next/image"
import Magnifier from "@/public/magnifier.svg"
import FilterIcon from "@/public/filter.svg"
import { Character } from "@/lib/costumeTypes"


type FilterProps = {
  initURL: string,
  nextPage: string | null,
  setData: React.Dispatch<React.SetStateAction<Character[]>>,
  setNextPage: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  advancedButton: boolean
}

export default function Filter({initURL, nextPage, setData, setNextPage, setIsLoading, advancedButton}: FilterProps) {

  const filterData = async (searchedName: string) => {

    try{
      setIsLoading(true);
      document.body.style.overflow = "hidden";

      const res = await fetch(`${initURL}/?name=${searchedName.toLowerCase()}`);
      const data = await res.json();
      console.log(data)
      if (data.results) {
        setData(data.results);
      } else {
        setData([]);
      }
      if (data.info) {
        setNextPage(data.info.next);
      } else {
        setNextPage(null);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      document.body.style.overflow = "";
    }
  }

  return(
    <>
      <div className="filter-container w-full">
        <div className="filter-container__input-wrapper">
          <Image src={Magnifier} alt="Magnifying glass icon" width={20} height={20}/>
          <input
            className="filter-container__input"
            type="text"
            placeholder="Filter by name..."
            name="name"
            onChange={(e) => {filterData(e.target.value)}}
          />
        </div>

        {advancedButton && (
          <button className="filter-button">
            <Image src={FilterIcon} alt="Filter icon" width={24} height={24}/>
            <p>
              advanced filters
            </p>
          </button>
        )}
      </div>
    </>
  )
}