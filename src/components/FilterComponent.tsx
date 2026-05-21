import Image from "next/image"
import Magnifier from "@/public/magnifier.svg"
import FilterIcon from "@/public/filter.svg"

export default function Filter({advancedButton}: {advancedButton: boolean}) {
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
            onChange={() => {}}
          />
        </div>

        <button className="filter-button">
          <Image src={FilterIcon} alt="Filter icon" width={24} height={24}/>
          <p>
            advanced filters
          </p>
        </button>
      </div>
    </>
  )
}