"use client";

import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import TriggeredButton from "./TriggeredButton";
import { Trash2 } from "lucide-react";

export type TOnChangeProps = {
  id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

type TDeleteProps = {
  onChange?: ({ id, setOpen, setLoading }: TOnChangeProps) => Promise<void>;
  id: string;
  buttonName?: string;
  acceptButtonName?: string;
  title?: string;
  description?: string;
  type?: string;
  children?: ReactNode;
};

const ConfirmComponent = ({
  onChange,
  id,
  buttonName = "Confirm Approve",
  acceptButtonName = "Approve",
  title = "Are you sure?",
  description = "If you confirm this, the payment will be confirmed from the pending status to paid status",
  type,
  children,
}: TDeleteProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger
        asChild
        onClick={(e) => e.stopPropagation()}
        className="z-20 "
      >
        {type ? (
          <TriggeredButton name={buttonName} varient="red" icon={Trash2} />
        ) : children ? (
          children
        ) : (
          <TriggeredButton name={buttonName} varient="red" icon={Trash2} />
        )}
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()} className="w-[450px] silver-metallic rounded-[24px]! p-6 border border-white/10!">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-500 text-sm">{description}</DialogDescription>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => {
              onChange?.({ id, setOpen, setLoading });
            }}
            className="cursor-pointer text-xs silver-btn border-[#4b5563]! rounded-[12px]! py-2! px-4!"
          >
            {acceptButtonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmComponent;
