import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type FilterProps = {
	searchPlaceholder?: string;
	initURL: string;
	onFetch: (url: string) => void;
	advancedButton: boolean;
	filters?: Record<string, Set<string>>;
	handleFilters?: () => void;
};

export default function Filter({
	searchPlaceholder,
	initURL,
	onFetch,
	advancedButton,
	filters,
	handleFilters,
}: FilterProps) {
	const [filterDialogVisible, setFilterDialogVisible] =
		useState<boolean>(false);
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string>
	>({});
	const [filterName, setFilterName] = useState<string>();
	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Detects episode searches like S, S01, or S01E01 so they use the episode query parameter.
	const isEpisodeSearch = (value: string) => {
		return /^s\d{0,2}(e\d{0,2})?$/i.test(value.trim());
	};

	// Builds the API URL from the search text and selected filters, then updates the displayed data.
	const buildURL = (
		searchedName: string | undefined,
		selected: Record<string, string>
	) => {
		if (initURL.includes("/episode") && searchedName) {
			if (isEpisodeSearch(searchedName)) {
				return `${initURL}/?episode=${searchedName.toUpperCase()}`;
			}
			return `${initURL}/?name=${searchedName.toLowerCase()}`;
		}

		let url = `${initURL}/?`;

		if (searchedName) {
			url += `name=${searchedName.toLowerCase()}`;
			Object.entries(selected).forEach(([key, value]) => {
				if (value) url += `&${key}=${value}`;
			});
		} else {
			const filterParams = Object.entries(selected)
				.filter(([, value]) => value)
				.map(([key, value]) => `${key}=${value}`)
				.join("&");
			url += filterParams;
		}

		return url;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterName(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
        filterData(value, selectedFilters);
    }, 400);
	};

	useEffect(() => {
    return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
	}, []);

	const filterData = (
		searchedName: string | undefined,
		selected: Record<string, string>
	) => {
		setFilterName(searchedName);
		setFilterDialogVisible(false);
		const url = buildURL(searchedName, selected);
		onFetch(url);
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
						onChange={handleInputChange}
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
	filterData: (
		searchedName: string | undefined,
		selected: Record<string, string>
	) => void;
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
							filterData(filterName, selectedFilters);
						}}
					>
						<p className="text-[20px]">apply</p>
					</button>
				</div>
			</div>
		</div>
	);
}
