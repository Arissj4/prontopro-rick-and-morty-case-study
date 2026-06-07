"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const router = useRouter();

	return (
		<header
			className={`fixed top-0 left-1/2 z-50 w-md -translate-x-1/2 overflow-clip bg-white transition-all duration-300 ${isMenuOpen ? "h-screen" : "h-17.5"}`}
		>
			<nav className="h-full w-full">
				<div className="flex justify-between px-8 py-1.5 shadow-[2px_0_8px_2px_rgba(0,0,0,0.1)]">
					<div className="w-11.5 h-12.25">
						<Image
							src="/nav-randm.svg"
							width={46}
							height={46}
							alt="Navbar-Logo"
						/>
					</div>

					<button
						className="flex justify-center flex-col gap-1.25 p-1 cursor-pointer bg-transparent border-none"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
					>
						<span
							className={`block w-5.5 h-[1.5px] bg-black transition-all duration-300 origin-center
              ${isMenuOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
						/>
						<span
							className={`block w-5.5 h-[1.5px] bg-black transition-all duration-300
              ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`}
						/>
						<span
							className={`block w-5.5 h-[1.5px] bg-black transition-all duration-300 origin-center
              ${isMenuOpen ? "translate-y-[-6.5px] -rotate-45" : ""}`}
						/>
					</button>
				</div>

				<div
					className={`${isMenuOpen ? "" : "hidden"} h-full w-full z-100 relative`}
				>
					<ol className="navbar__list">
						<li className="navbar__item">
							<button
								className="navbar__button"
								onClick={() => {
									setIsMenuOpen(!isMenuOpen);
									router?.push("/");
								}}
							>
								Characters
							</button>
						</li>

						<li className="navbar__item">
							<button
								className="navbar__button"
								onClick={() => {
									setIsMenuOpen(!isMenuOpen);
									router?.push("/locations");
								}}
							>
								Locations
							</button>
						</li>

						<li className="navbar__item">
							<button
								className="navbar__button"
								onClick={() => {
									setIsMenuOpen(!isMenuOpen);
									router?.push("/episodes");
								}}
							>
								Episodes
							</button>
						</li>
					</ol>
				</div>
			</nav>
		</header>
	);
}
