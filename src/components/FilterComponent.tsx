import Image from "next/image";
import { useState } from "react";

type FilterProps<T> = {
	searchPlaceholder?: string;
	initURL: string;
	setData: React.Dispatch<React.SetStateAction<T[]>>;
	setNextPage: React.Dispatch<React.SetStateAction<string | null>>;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	advancedButton: boolean;
	filters?: Record<string, Set<string>>;
	handleFilters?: () => void;
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
	handleFilters,
	setIsError,
}: FilterProps<T>) {
	const [filterDialogVisible, setFilterDialogVisible] =
		useState<boolean>(false);
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string>
	>({});
	const [filterName, setFilterName] = useState<string>();

	// Detects episode searches like S, S01, or S01E01 so they use the episode query parameter.
	const isEpisodeSearch = (value: string) => {
		return /^s\d{0,2}(e\d{0,2})?$/i.test(value.trim());
	};

	// Builds the API URL from the search text and selected filters, then updates the displayed data.
	const filterData = async (searchedName: string | undefined) => {
		try {
			setIsLoading(true);
			setFilterName(searchedName);
			document.body.style.overflow = "hidden";

			let url: string = `${initURL}/`;

			// Episode pages support searching by name or episode code.
			if (initURL.includes("/episode") && searchedName) {
				// Detects episode codes like S01E01 so they can be sent with the episode query parameter.
				if (searchedName && isEpisodeSearch(searchedName)) {
					url = `${initURL}/?episode=${searchedName.toUpperCase()}`;
				} else if (searchedName) {
					url = `${initURL}/?name=${searchedName.toLowerCase()}`;
				}
			} else if (searchedName) {
				url += `?name=${searchedName.toLowerCase()}`;
				// Add selected advanced filters to the request URL.
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
						src="/magnifier.svg"
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
							if (handleFilters) await handleFilters();
							setFilterDialogVisible(true);
						}}
					>
						<Image src="/filter.svg" alt="Filter icon" width={24} height={24} />
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

// Renders the advanced filter modal and keeps the selected filter values.
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
						<Image src="/close.svg" alt="Close icon" width={30} height={30} />
					</button>
				</div>

				<div className="filter-dialog__content">
					{filter &&
						Object.entries(filter).map(([key, value]) => (
							<div className="filter-dialog__select-wrapper" key={key}>
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
