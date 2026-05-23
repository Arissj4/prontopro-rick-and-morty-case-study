import Image from "next/image";
import MagnifierIcon from "@/public/magnifier.svg";
import FilterIcon from "@/public/filter.svg";
import CloseIcon from "@/public/close.svg";
import { useState } from "react";

type FilterProps<T> = {
	searchPlaceholder?: string;
	initURL: string;
	setData: React.Dispatch<React.SetStateAction<T[]>>;
	setNextPage: React.Dispatch<React.SetStateAction<string | null>>;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	advancedButton: boolean;
	filters?: Record<string, Set<string>>;
	getFilter?: () => void;
	setIsError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Filter<T>({
	searchPlaceholder,
	initURL,
	setData,
	setNextPage,
	setIsLoading,
	advancedButton,
	filters,
	getFilter,
	setIsError,
}: FilterProps<T>) {
	const [filterDialogVisible, setFilterDialogVisible] =
		useState<boolean>(false);
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string>
	>({});
	const [filterName, setFilterName] = useState<string>();

	const filterData = async (searchedName: string | undefined) => {
		try {
			setIsLoading(true);
			setFilterName(searchedName);
			document.body.style.overflow = "hidden";

			let url: string = "";

			if (initURL.includes("/episode")) {
				const isEpisodeCode = searchedName
					? /^s\d{2}e\d{2}$/i.test(searchedName)
					: null;
				const params = new URLSearchParams();
				if (searchedName) {
					if (isEpisodeCode) params.set("episode", searchedName.toUpperCase());
					else params.set("name", searchedName.toLowerCase());
				}
				url = `${initURL}/?${params.toString()}`;
			} else {
				url = `${initURL}/`;
				if (searchedName) url += `?name=${searchedName.toLowerCase()}`;
				Object.entries(selectedFilters).forEach(([key, value]) => {
					if (value) url += `&${key}=${value}`;
				});
			}

			setFilterDialogVisible(false);

			const res = await fetch(url);
			const data = await res.json();
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
			setIsError(true);
			const inputElement = document.querySelector(
				'input[name="name"]'
			) as HTMLInputElement;
			if (inputElement) {
				inputElement.blur();
			}
			console.log(error);
		} finally {
			setSelectedFilters({});
			setIsLoading(false);
			document.body.style.overflow = "";
		}
	};

	return (
		<>
			<FilterDialog
				isVisible={filterDialogVisible}
				setVisible={setFilterDialogVisible}
				filter={filters}
				selectedFilters={selectedFilters}
				setSelectedFilters={setSelectedFilters}
				filterData={filterData}
				filterName={filterName}
			/>
			<div className="filter-container w-full">
				<div className="absolute flex w-[104%] -z-10 -right-2 h-full bg-white rounded-md" />
				<div className="filter-container__input-wrapper">
					<Image
						src={MagnifierIcon}
						alt="Magnifying glass icon"
						width={20}
						height={20}
					/>
					<input
						className="filter-container__input"
						type="text"
						placeholder={
							searchPlaceholder ? searchPlaceholder : "Filter by name..."
						}
						name="name"
						onChange={(e) => {
							filterData(e.target.value);
						}}
						defaultValue={""}
					/>
				</div>

				{advancedButton && (
					<button
						className="filter-button h-14 p-4"
						onClick={async () => {
							if (getFilter) await getFilter();
							setFilterDialogVisible(true);
						}}
					>
						<Image src={FilterIcon} alt="Filter icon" width={24} height={24} />
						<p className="-left-3 text-[16px]">advanced filters</p>
					</button>
				)}
			</div>
		</>
	);
}

type FilterDialogProps = {
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	isVisible: boolean;
	filter?: Record<string, Set<string>>;
	selectedFilters: Record<string, string>;
	setSelectedFilters: React.Dispatch<
		React.SetStateAction<Record<string, string>>
	>;
	filterData: (searchedName: string | undefined) => void;
	filterName: string | undefined;
};

export function FilterDialog({
	isVisible,
	setVisible,
	filter,
	selectedFilters,
	setSelectedFilters,
	filterData,
	filterName,
}: FilterDialogProps) {
	return (
		<div
			className={`filter-dialog ${isVisible ? "" : "hidden"} fixed inset-0 z-100 m-auto w-md`}
		>
			<div className="filter-dialog__content-wrapper">
				<div className="filter-dialog__header">
					<p>Filters</p>
					<button onClick={() => setVisible(false)}>
						<Image src={CloseIcon} alt="Close icon" width={30} height={30} />
					</button>
				</div>

				<div className="filter-dialog__content">
					{filter &&
						Object.entries(filter).map(([key, value]) => (
							<div
								className="filter-dialog__select-wrapper"
								key={key}
							>
								<select
									className="filter-dialog__select"
									id={key}
									value={selectedFilters[key] || ""}
									onChange={(e) =>
										setSelectedFilters({
											...selectedFilters,
											[key]: e.target.value,
										})
									}
								>
									<option value="" disabled hidden>
										{key.charAt(0).toUpperCase() + key.slice(1)}
									</option>
									{Array.from(value).map((it) => (
										<option key={it} id={it} value={it} label={it} />
									))}
								</select>
							</div>
						))}
				</div>

				<div className="filter-dialog__footer">
					<button
						className="filter-dialog__button filter-button py-1 px-4"
						onClick={() => {
							filterData(filterName);
						}}
					>
						<p className="text-[20px]">apply</p>
					</button>
				</div>
			</div>
		</div>
	);
}
