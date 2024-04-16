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
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      setColumnDialog(false);
    }
  };
  useEffect(() => {
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

  const [dataToBePassed, setDataToBePassed] = useState(tableData);
  const originalHeaders: (keyof UserData)[] =
    tableData.length > 0
      ? (Object.keys(tableData[0]) as (keyof UserData)[])
      : [];
  const [headersToBePassed, setHeadersToBePassed] = useState({
    headers: originalHeaders,
    columnNumber: originalHeaders.map((_, index) => index + 1),
  });
  useMemo(() => {
    const sorted = multiColumnSort(tableData, sortingState);
    const filteredData = sorted.filter((item) =>
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
    setTotalPages(Math.ceil(filteredData.length / pageSize));
    setDataToBePassed(filteredSliceData);
  }, [tableData, sortingState, currentPage, pageSize, filterInput]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    headersToBePassed.headers
  );
  const handleColumnToggle = (column: string) => {
    const isSelected = selectedColumns.includes(column);
    if (isSelected) {
      setSelectedColumns(
        selectedColumns.filter((selectedColumn) => selectedColumn !== column)
      );
      const headerAfterRemoval = headersToBePassed.headers.filter(
        (header) => header !== column
      );
      const dataAfterRemoval = dataToBePassed.map((item) => {
        const newItem = { ...item };
        delete newItem[column as keyof typeof item];
        return newItem;
      });
      setDataToBePassed(dataAfterRemoval);
      setHeadersToBePassed({
        headers: headerAfterRemoval,
        columnNumber: headerAfterRemoval.map((header) => {
          return headersToBePassed.columnNumber[
            headersToBePassed.headers.indexOf(header)
          ];
        }),
      });
    } else {
      const updatedHeader = [...headersToBePassed.headers];
      const updatedColumnNumber = [...headersToBePassed.columnNumber];
      const columnIndex = originalHeaders.indexOf(column as keyof UserData);
      updatedHeader.splice(columnIndex, 0, column as keyof UserData);
      updatedColumnNumber.splice(columnIndex, 0, columnIndex + 1);

      const columnData = tableData.map(
        (item) => item[column as keyof typeof item]
      );
      const updatedData = dataToBePassed.map((item, index) => ({
        ...item,
        [column]: columnData[index],
      }));
      setDataToBePassed(updatedData);
      setHeadersToBePassed({
        headers: updatedHeader,
        columnNumber: updatedColumnNumber,
      });
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterInput]);

  return (
    <div className="flex flex-col p-4 mx-8 my-4 border border-gray-400 rounded-md shadow-lg">
      <div className="flex flex-col items-center justify-between align-middle md:flex-row">
        <div className="pl-2">
          <p className="font-bold">User Data</p>
          <p className="text-[11px] text-neutral-500">
            {dataToBePassed.length} results
          </p>
        </div>
        <div className="flex flex-row">
          <div
            className={`flex flex-row items-center rounded-md w-fit p-2 m-4 border-2 cursor-pointer h-9 ${
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
              width="18"
              className="md:mr-2"
            />
            <span className="hidden text-xs font-bold md:block">Columns</span>
          </div>
          {columnDialog && (
            <div className="relative z-20 mt-2 top-11 right-28">
              <div
                ref={dialogRef}
                className={`absolute bg-white font-medium w-48 p-4 border capitalize  `}
              >
                {originalHeaders.map((column) => (
                  <div key={column} className="flex items-center ">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={() => handleColumnToggle(column)}
                      className="w-4 h-4 mr-2"
                    />
                    <p>{column}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-row items-center p-2 my-4 mr-2 border-2 rounded-md h-9">
            <Icon icon="fe:search" width="24" className="mr-2" />
            <input
              type="text"
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              className="w-full text-xs font-medium outline-none"
              placeholder="Search"
            ></input>
          </div>
        </div>
      </div>
      <div>
        <div className="overflow-x-scroll h-[500px] border border-gray-500  rounded-md bg-white">
          <table className={`w-full table-space overflow-y-scroll `}>
            <thead className="sticky z-10 bg-gray-200 -top-1 ">
              <tr className="text-xs font-bold">
                {headersToBePassed.headers.map((header) => (
                  <th
                    key={header}
                    className="relative h-2 py-2 min-w-[100px] max-w-fit hover:cursor-pointer "
                    onClick={() => handleColumnHeaderClick(header)}
                  >
                    <div className="flex items-center justify-center capitalize">
                      <div className="w-4"></div>
                      <span>{header}</span>
                      {sortingState[header] &&
                        Object.keys(sortingState).length > 1 && (
                          <span className="mx-1">
                            {sortingState[header].rank}
                          </span>
                        )}
                      {sortingState[header] ? (
                        sortingState[header].direction === "ASC" ? (
                          <Icon icon="typcn:arrow-sorted-up" width={16} />
                        ) : (
                          <Icon icon="typcn:arrow-sorted-down" width={16} />
                        )
                      ) : (
                        <div className="w-4"></div>
                      )}
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
                    className={`text-xs hover:bg-gray-200 font-medium`}
                  >
                    {headersToBePassed.headers.map((header) => (
                      <>
                        <td
                          key={header}
                          className={`py-2 text-center min-w-fit whitespace-nowrap`}
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
        </div>
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
            totalPageCount={totalPages}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
