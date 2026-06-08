/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useRef, useState } from "react";

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  className?: string;
  className2?: string;
  className3?: string;
  onRowClick?: (row: T) => void;
  isRowSelected?: (row: T) => boolean;
  renderExpanded?: (row: T) => React.ReactNode;
};

const TableComponent = <T,>({
  data = [],
  columns,
  className,
  className2,
  className3,
  onRowClick,
  isRowSelected,
  renderExpanded,
}: TableProps<T>) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table?.getRowModel()?.rows ?? [];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleRowClick = (rowId: string, original: T) => {
    if (hasMoved) return;
    if (renderExpanded) {
      setExpandedRowId((prev) => (prev === rowId ? null : rowId));
    }
    onRowClick?.(original);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={cn(
        "overflow-x-auto w-full pb-10 custom-scrollbar-horizontal cursor-grab active:cursor-grabbing select-none",
        isDragging && "cursor-grabbing",
      )}
    >
      <table className="w-full caption-bottom text-sm space-y-3">
        <thead>
          {table?.getHeaderGroups()?.map((headerGroup) => (
            <tr
              key={headerGroup?.id}
              className={cn(
                "transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                className2,
              )}
            >
              {headerGroup?.headers?.map((header, ind) => (
                <th
                  key={ind}
                  className="h-12 text-left align-middle font-medium text-muted-foreground "
                >
                  <div
                    className={cn(
                      `border w-full h-full flex justify-center items-center text-[12px] px-3 text-white border-white/30 ${ind === 0
                        ? "rounded-l-2xl"
                        : ind === (headerGroup?.headers?.length ?? 0) - 1
                          ? "rounded-r-2xl"
                          : ""
                      }`,
                      className,
                    )}
                  >
                    {flexRender(
                      header?.column?.columnDef?.header,
                      header?.getContext(),
                    )}
                  </div>
                </th>
              )) ?? []}
            </tr>
          )) ?? []}
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {rows?.length > 0 ? (
            rows.map((row) => {
              const isExpanded = expandedRowId === row.id;
              return (
                <Fragment key={row.id}>
                  <tr
                    onClick={() => handleRowClick(row.id, row.original)}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50 cursor-pointer",
                      isRowSelected?.(row.original) && "bg-white/10",
                      isExpanded && "bg-white/5",
                      className3,
                    )}
                  >
                    {row?.getVisibleCells()?.map((cell, index) => (
                      <td
                        key={index}
                        className="p-2 font-medium text-sm whitespace-nowrap text-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>

                  {renderExpanded && isExpanded && (
                    <tr className="border-b border-white/5">
                      <td
                        colSpan={columns.length}
                        className="px-4 py-3 bg-white/3"
                      >
                        {renderExpanded(row.original)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns?.length ?? 1}
                className="p-8 font-medium text-sm text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span>No data available</span>
                  <span className="text-xs opacity-70">
                    There are no records to display at this time
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
