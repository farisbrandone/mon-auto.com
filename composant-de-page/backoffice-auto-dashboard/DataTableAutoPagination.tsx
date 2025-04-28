/* import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
  } from "@radix-ui/react-icons"; */
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getAutoDataAsync } from "@/app/actions/actions";
import { useEffect, useState } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  setUserData: React.Dispatch<React.SetStateAction<TData[] | undefined>>;
  setActualPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
  actualPage: number;
  totalPage: number;
}

export function DataTableAutoPagination<TData>({
  table,
  setUserData,
  setActualPage,
  setTotalPage,
  actualPage,
  totalPage,
}: DataTablePaginationProps<TData>) {
  /*  const [actualPage, setActualPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1); */
  const [statePrevious, setStatePrevious] = useState(false);
  const [stateNext, setStateNext] = useState(false);
  const [loading, setLoading] = useState(false);
  /* 
  "page": {
    "size": 9007199254740991,
    "totalElements": 9007199254740991,
    "totalPages": 9007199254740991,
    "number": 9007199254740991
  }
  */

  const getDataAsyncFront = async (page: number) => {
    try {
      /* 
       { success: true, data: newAutos, error: null, token: null };
       */
      setLoading(true);
      const response = await getAutoDataAsync(page);
      const newAutos = response.data;
      const myPage = response.page;
      setUserData([...newAutos.autos]);
      setTotalPage(myPage.totalPages);

      setActualPage(myPage.number);

      if (
        myPage.totalPages > 1 &&
        myPage.totalPages > myPage.number + 1 &&
        myPage.number > 0
      ) {
        setStateNext(true);
        setStatePrevious(true);
      }

      if (
        myPage.totalPages > 1 &&
        myPage.totalPages > myPage.number + 1 &&
        myPage.number === 0
      ) {
        setStateNext(true);
        setStatePrevious(false);
      }

      if (myPage.totalPages > 1 && myPage.totalPages === myPage.number) {
        setStateNext(false);
        setStatePrevious(true);
      }

      if (myPage.number === 0) {
        setStatePrevious(false);
      }

      if (myPage.totalPages === myPage.number) {
        setStateNext(false);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (totalPage > 1 && totalPage > actualPage + 1 && actualPage > 0) {
      setStateNext(true);
      setStatePrevious(true);
    }

    if (totalPage > 1 && totalPage > actualPage + 1 && actualPage === 0) {
      setStateNext(true);
      setStatePrevious(false);
    }

    if (totalPage > 1 && totalPage === actualPage) {
      setStateNext(false);
      setStatePrevious(true);
    }

    if (actualPage === 0) {
      setStatePrevious(false);
    }

    if (totalPage === actualPage) {
      setStateNext(false);
    }
  }, []);

  return (
    <div className="flex items-center justify-between  px-2 mt-10  ">
      {/*  <div className="flex-1 text-sm text-muted-foreground basis-[120px] ">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
      <div className="flex items-center space-x-6 lg:space-x-8 border-solid p-1 rounded-md border-[1px] border-[#3333339f]">
        {/*  <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Lignes par page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {actualPage + 1} sur {totalPage}
        </div>
        <div className="hidden sm:flex items-center space-x-2 ">
          {/*  <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {table.setPageIndex(0), getDataAsyncFront(actualPage+1)}}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Aller à la première page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button> */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 disabled:bg-red-500 "
            onClick={() => getDataAsyncFront(actualPage + 1)}
            disabled={!statePrevious || loading}
          >
            {!loading ? (
              <>
                <span className="sr-only">Retourner à la page précédante</span>{" "}
                <ChevronLeftIcon className="h-4 w-4" />
              </>
            ) : (
              "..."
            )}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 disabled:bg-red-500"
            onClick={() => getDataAsyncFront(actualPage - 1)}
            disabled={!stateNext || loading}
          >
            {loading ? (
              "..."
            ) : (
              <>
                <span className="sr-only">Aller à la page suivante</span>
                <ChevronRightIcon className="h-4 w-4" />
              </>
            )}
          </Button>
          {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Aller à la dernière page</span>

            <ChevronsRight className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
