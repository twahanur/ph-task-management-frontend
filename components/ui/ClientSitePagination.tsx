import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type TClientPaginationProps = {
  show: string;
  setShow: Dispatch<SetStateAction<string>>;
  length: number;
  limit: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

const ClientSitePagination = ({
  show,
  setShow,
  length,
  limit,
  currentPage,
  setCurrentPage,
}: TClientPaginationProps) => {
  const totalPages = Math.ceil(length / limit);

  const renderPages = () => {
    const pages = [];
    const maxVisible = 3;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    if (start > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className={
              currentPage === 1 ? "bg-[rgba(248,248,248,0.10)] rounded-xl" : ""
            }
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (start > 2) pages.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
            className={
              currentPage === i ? "bg-[rgba(248,248,248,0.10)] rounded-xl" : ""
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1)
        pages.push(<PaginationEllipsis key="ellipsis-end" />);
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
            className={
              currentPage === totalPages
                ? "bg-[rgba(248,248,248,0.10)] rounded-xl"
                : ""
            }
          >
            {totalPages}
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
          <div className="flex items-center justify-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={`border border-[#8A8A8A] rounded-xl ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
            <div className="flex items-center justify-center gap-1">
              {renderPages()}
            </div>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={`border border-[#8A8A8A] rounded-xl ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
          </div>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="flex items-center text-[14px] font-normal border border-white/10 px-3.5 py-2 rounded-[12px] cursor-pointer bg-transparent"
            >
              <span className="flex items-center gap-2">
                Show {show} <ChevronDown size={18} />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white/5 backdrop-blur-2xl"
          >
            {["10", "20", "30", "50","100","500","1000"].map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => {
                  setShow(item);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer ${item === show ? "font-medium" : ""}`}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClientSitePagination;
