"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";

type TCustomPaginationProps = {
  totalPage?: number;
  totalItems?: number;
  currentPage: number;
  show: string;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setShow: Dispatch<SetStateAction<string>>;
  handleChange: (name: string, value: string) => void;
  isLimit?: boolean;
  visible?: number;
};

const CustomPagination = ({
  totalPage = 10,
  totalItems = 0,
  currentPage,
  setCurrentPage,
  show,
  setShow,
  handleChange,
  isLimit = true,
  visible = 5,
}: TCustomPaginationProps) => {
  const router = useRouter();
  const pathName = usePathname();

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      handleChange("page", (currentPage - 1).toString());
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
      handleChange("page", (currentPage + 1).toString());
    }
  };

  const renderPages = () => {
    const pages = [];
    const half = Math.floor(visible / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPage, start + visible - 1);

    if (end - start + 1 < visible) {
      start = Math.max(1, end - visible + 1);
    }

    if (start > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
              handleChange("page", "1");
            }}
            href="#"
            className={`${
              currentPage === 1 && "bg-[rgba(248,248,248,0.10)] rounded-xl"
            }`}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (start > 2) {
        pages.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
              handleChange("page", i.toString());
            }}
            href="#"
            className={`${
              currentPage === i && "bg-[rgba(248,248,248,0.10)] rounded-xl"
            }`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (end < totalPage) {
      if (end < totalPage - 1) {
        pages.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      pages.push(
        <PaginationItem key={totalPage}>
          <PaginationLink
            isActive={currentPage === totalPage}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPage);
              handleChange("page", totalPage.toString());
            }}
            href="#"
            className={`${
              currentPage === totalPage &&
              "bg-[rgba(248,248,248,0.10)] rounded-xl"
            }`}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <Pagination>
        <PaginationContent>
          <div className=" flex items-center justify-center gap-6">
            {/* pagination previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePrev();
                }}
                href="#"
                className={` border border-[#8A8A8A] rounded-xl ${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>
            <div className="flex items-center justify-center gap-1">
              {renderPages()}
            </div>

            {/* pagination next */}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPage) handleNext();
                }}
                href="#"
                className={` border border-[#8A8A8A] rounded-xl ${
                  currentPage === totalPage
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              />
            </PaginationItem>
          </div>
        </PaginationContent>
      </Pagination>

      {isLimit && (
        <div className="flex items-center gap-6">
          <p className="text-sm text-[#7E7E7E]">
            Showing {(currentPage - 1) * Number(show) + 1} to{" "}
            {Math.min(currentPage * Number(show), totalItems)} of {totalItems}{" "}
            entries
          </p>
          {/* status drodpown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div role="button" tabIndex={0} className="w-fit">
                <Button
                  variant="default"
                  className="flex items-center text-[14px] font-normal border border-white/10 px-3.5 py-2 rounded-[12px] cursor-pointer bg-transparent"
                >
                  <p className="flex items-center gap-2">
                    <span className="text-[14px]">Show {show}</span>
                    <ChevronDown size={18} />
                  </p>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/5 backdrop-blur-2xl"
            >
              {["10", "20", "30", "40", "50", "100", "200", "500", "1000"].map(
                (item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => {
                      setShow(item);
                      handleChange("limit", item);
                    }}
                    className={`cursor-pointer ${
                      item === show ? "font-medium" : ""
                    }`}
                  >
                    {item}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default CustomPagination;
