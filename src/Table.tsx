import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import BasicMenu from "./BasicMenu";
import { displayDateFormat } from "./dateUtil";
import Pagination from "./Pagination";
import { UserData } from "./sampleData";
import { Direction, SortingState, multiColumnSort } from "./sortingUtils";

function Table({ tableData }: { tableData: UserData[] }) {
  const [sortingState, setSortingState] = useState<SortingState>({});
  const [filterInput, setFilterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState(tableData.length / pageSize);
  const [columnDialog, setColumnDialog] = useState(false);
  const dialogRef: React.RefObject<HTMLDivElement> = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setColumnDialog(false);
      }
    };
    if (columnDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [columnDialog, setColumnDialog]);

  const handleColumnHeaderClick = (columnName: string) => {
    const currentDirection = sortingState[columnName]?.direction;
    const currentRank = sortingState[columnName]?.rank;
    let newDirection: Direction | undefined;
    if (currentDirection === "ASC") {
      newDirection = "DESC";
    } else if (currentDirection === "DESC") {
      newDirection = undefined;
    } else {
      newDirection = "ASC";
    }
    if (newDirection === undefined) {
      const updatedState: SortingState = {};
      let newRank = 1;
      for (const [key, value] of Object.entries(sortingState)) {
        if (key !== columnName) {
          updatedState[key] = {
            ...value,
            rank: newRank++,
          };
        }
      }
      setSortingState(updatedState);
    } else {
      const newRank = Object.keys(sortingState).length + 1;
      setSortingState((prevState) => ({
        ...prevState,
        [columnName]: {
          direction: newDirection,
          rank: currentDirection ? currentRank : newRank,
        },
      }));
    }
  };

  const [dataToBePassed,setDataToBePassed] =  useState(tableData);
  const allHeaders: (keyof UserData)[] =
  tableData.length > 0
    ? (Object.keys(tableData[0]) as (keyof UserData)[])
    : [];
  const [headersToBePassed, setHeadersToBePassed] = useState(allHeaders)
  useMemo(() => {
    const filteredData = tableData.filter((item) =>
      Object.values(item).some((value) => {
        const finalValue =
          typeof value === "object" && value instanceof Date
            ? displayDateFormat(value)
            : value;
        return finalValue
          .toString()
          .toLowerCase()
          .includes(filterInput.toLowerCase());
      })
    );
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    const filteredSliceData = filteredData.slice(firstPageIndex, lastPageIndex);
    const sorted = multiColumnSort(filteredSliceData, sortingState);
    setTotalPages(Math.ceil(filteredData.length / pageSize));
    setDataToBePassed(sorted);
  }, [tableData, currentPage, pageSize, sortingState, filterInput]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    headersToBePassed
  );
  const handleColumnToggle = (column: string) => {
    const isSelected = selectedColumns.includes(column);
    if (isSelected) {
      setSelectedColumns(
        selectedColumns.filter((selectedColumn) => selectedColumn !== column)
      );
      const filteredHeader = headersToBePassed.filter(
        (header) => header !== column
      );
      const filteredData = dataToBePassed.map((item) => {
        const newItem = { ...item };
        delete newItem[column as keyof typeof item];
        return newItem;
      });
      setDataToBePassed(filteredData);
      setHeadersToBePassed(filteredHeader);
    } else {
      const updatedHeader = [
        ...headersToBePassed,
        column as keyof UserData,
      ];
      const columnData = tableData.map(
        (item) => item[column as keyof typeof item]
      );
      const updatedData = dataToBePassed.map((item, index) => ({
        ...item,
        [column]: columnData[index],
      }));
      setDataToBePassed(updatedData);
      setHeadersToBePassed(updatedHeader);
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterInput]);

  return (
    <div className="flex flex-col">
      <div className="px-2">
        <p className="text-lg font-medium">User Data</p>
        <p className="text-xs font-medium">
          {dataToBePassed.length} results
        </p>
      </div>
      <div className="flex flex-row justify-end">
        <div
          className={`flex flex-row items-center w-24 p-2 m-4 border-2 cursor-pointer h-9 ${
            columnDialog ? "bg-blue-950 text-white" : "bg-white"
          }`}
          onClick={() => {
            if (!columnDialog) {
              setColumnDialog(true);
            }
          }}
        >
          <Icon
            icon="fluent:column-triple-edit-20-regular"
            width="24"
            className="mr-2"
          />
          <span className="text-xs font-bold ">Columns</span>
        </div>
        {columnDialog && (
          <div className="relative z-10 mt-2 top-11 right-28">
            <div
              ref={dialogRef}
              className={`absolute bg-white font-medium w-48 p-4 border capitalize  `}
            >
              {(Object.keys(tableData[0]) as (keyof UserData)[]).map(
                (column) => (
                  <div key={column} className="flex items-center ">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={() => handleColumnToggle(column)}
                      className="w-4 h-4 mr-2"
                    />
                    <p>{column}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <div className="flex flex-row items-center p-2 m-4 border-2 rounded-md w-72 h-9">
          <Icon icon="fe:search" width="24" className="mr-2 " />
          <input
            type="text"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            className="w-full text-xs font-medium outline-none"
            placeholder="Search"
          ></input>
        </div>
      </div>
      <div className="px-2">
        <table className={`w-full table-space overflow-auto`}>
          <thead>
            <tr className="text-xs font-bold">
              {headersToBePassed.map((header) => (
                <th
                  key={header}
                  className="relative h-2 py-2 border border-black min-w-[100px] max-w-fit"
                >
                  <div className="flex items-center justify-center capitalize">
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => handleColumnHeaderClick(header)}
                    >
                      {header}
                    </span>
                    {sortingState[header] &&
                      Object.keys(sortingState).length > 1 && (
                        <span className="mx-1">
                          {sortingState[header].rank}
                        </span>
                      )}
                    {sortingState[header] ?
                      (sortingState[header].direction === "ASC" ? (
                        <Icon icon="typcn:arrow-sorted-up" width={16} />
                      ) : (
                        <Icon icon="typcn:arrow-sorted-down" width={16} />
                      )) : <div className="w-4"></div>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataToBePassed.length > 0 &&
              dataToBePassed.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`text-xs font-medium ${
                    rowIndex === dataToBePassed.length - 1 &&
                    "border-b border-black"
                  }`}
                >
                  {headersToBePassed.map((header) => (
                    <>
                      <td
                        key={header}
                        className="py-2 text-center border-black border-x min-w-fit whitespace-nowrap"
                      >
                        {typeof item[header] === "object" &&
                        item[header] instanceof Date
                          ? displayDateFormat(new Date(item[header]))
                          : item[header]?.toString() || "-"}
                      </td>
                    </>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex flex-row justify-between my-4">
          <BasicMenu
            defaultValue={pageSize}
            options={[5, 10, 15, 20, 30, 50, 100]}
            onOptionChange={(value: number) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
          />
          <Pagination
            currentPage={currentPage}
            onPageChange={(page: number) => setCurrentPage(page)}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;