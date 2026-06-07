type PaginationProps = {
	onGetMoreData: () => void;
};

export default function Pagination({ onGetMoreData }: PaginationProps) {
	return (
		<div className="flex justify-center w-full">
			<button className="pagination-button" onClick={onGetMoreData}>
				load more
			</button>
		</div>
	);
}
