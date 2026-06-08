"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ReactNode } from "react";
import ConfirmComponent, { TOnChangeProps } from "./ConfirmModal";

type TDropdownProps = {
  id?: string;
  path?: string;
  type?: string;
  handleChange?: ({ id, setOpen, setLoading }: TOnChangeProps) => Promise<void>;
  children?: ReactNode;
  buttonName?: string;
  detailsButtonName?: string;
  acceptButtonName?: string;
  confirmedButton?: string;
  showDelete?: boolean;
  title?: string;
  description?: string;
};

const ActionDropdown = ({
  id,
  path,
  handleChange,
  children,
  buttonName,
  detailsButtonName,
  showDelete = true,
  title,
  description,
  acceptButtonName,
}: TDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only ">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-white/5 backdrop-blur-3xl "
      >
        {path && (
          <DropdownMenuItem asChild>
            <Link href={path} className="cursor-pointer">
              {detailsButtonName}
            </Link>
          </DropdownMenuItem>
        )}
        {children && <DropdownMenuItem asChild>{children}</DropdownMenuItem>}

        {showDelete && handleChange && (
          <DropdownMenuItem asChild>
            <ConfirmComponent
              onChange={handleChange}
              id={id as string}
              buttonName={buttonName}
              title={title}
              description={description}
              acceptButtonName={acceptButtonName}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
