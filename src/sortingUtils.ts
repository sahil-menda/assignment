export type SortingState = {
  [key: string]: {
    direction: Direction | undefined;
    rank: number;
  };
};
export type ColWidth = {
    [key: string]: number
}
export type Direction = "ASC" | "DESC";
export const multiColumnSort = <T>(
  arr: T[],
  sortingState: SortingState
): T[] => {
  return [...arr].sort((a, b) => {
    for (const [column, state] of Object.entries(sortingState)) {
      const { direction } = state;
      if (direction) {
        const valueA = a[column as keyof T];
        const valueB = b[column as keyof T];
        if (direction === "ASC") {
          if (valueA > valueB) return 1;
          if (valueA < valueB) return -1;
        } else {
          if (valueB > valueA) return 1;
          if (valueB < valueA) return -1;
        }
      }
    }
    return 0;
  });
};
