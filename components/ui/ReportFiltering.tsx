"use client";

import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

const ReportFiltering = ({
  setHourly,
}: {
  setHourly?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const handleStartDate = (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    setEndDate(undefined);
    setStartOpen(false);
  };

  const handleEndDate = (date: Date | undefined) => {
    if (!date) return;
    setEndDate(date);
    const formatedEndDate = format(date, "yyyy-MM-dd");
    const formatedStartDate = format(startDate!, "yyyy-MM-dd");
    const params = new URLSearchParams(searchParams.toString());
    if (startDate) {
      params.set("startDate", formatedStartDate.toString());
      params.set("endDate", formatedEndDate.toString());
      router.push(`${pathName}?${params.toString()}`, {
        scroll: false,
      });
    } else {
      params.delete("startDate");
      params.delete("endDate");
    }
  };

  const handleReset = () => {
    router.push(`${pathName}`);
    setStartDate(undefined);
    setEndDate(undefined);
    if (setHourly) setHourly(false);
  };

  return (
    <div className="flex items-end justify-between">
      <div className="flex flex-col lg:flex-row items-end gap-4">
        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Start Date
          </label>
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start cursor-pointer"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? format(startDate, "yyyy-MM-dd")
                  : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDate}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            End Date
          </label>
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button
                disabled={!startDate}
                variant="outline"
                className="justify-start cursor-pointer"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "yyyy-MM-dd") : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDate}
                disabled={(date) =>
                  !startDate || date > new Date() || date < startDate
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={() => handleReset()}
          variant="outline"
          className="text-sm effect cursor-pointer"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ReportFiltering;
