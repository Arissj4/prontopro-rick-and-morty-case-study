import RandMPicture from "@/public/rick-and-morty.svg"
import Image from "next/image"



const Home = () => (
	<>
		<div className='page flex flex-col items-center'>
			<Image src={RandMPicture} alt="Rick and Morty Logo" />

			<div id="filters-container" className="">
				<input type="text" placeholder="Filter by name..."/>
			</div>
		</div>
	</>
)

export default Home
