"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ButtonComponent from "@/components/ui/ButtonComponent";
import { Plus } from "lucide-react";
import { toast } from 'sonner';
import { createBoard } from '@/service/boardService/board.service';
import { TCreateBoardPayload } from '@/types/baordType/board.type';
import { useRole } from '@/hooks/useRole';

export default function CreateBoard({ workspaceId }: { workspaceId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#3B82F6");
  const [visibility, setVisibility] = useState("public");
  const { can } = useRole();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data: TCreateBoardPayload = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        background_color: backgroundColor,
        visibility: visibility,
      };
      
      const res = await createBoard(workspaceId, data);
      if (res?.success) {
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Failed to create board");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          disabled={!can("CREATE_PROJECT")}
          title={!can("CREATE_PROJECT") ? "Only Admin or Project Manager can create boards" : undefined}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition text-sm silver-btn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Create Board
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]! silver-metallic">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-gray-800">Create New Board</DialogTitle>
          <DialogDescription className="text-gray-500">
            Add a new board to this workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Board Name <span className="text-gray-700">*</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Marketing Campaign"
              required
              className="h-[56px]! rounded-[16px]!"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your board..."
              className="rounded-[16px]! min-h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Visibility
            </label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="silver-input border-[#9ca3af] text-gray-800 h-[56px]! rounded-[16px]! focus:ring-2 focus:ring-gray-400">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="silver-metallic text-gray-800 border-gray-300">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="flex gap-2 mt-1">
              {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${backgroundColor === color ? 'ring-2 ring-gray-400 ring-offset-2 ring-offset-gray-100 scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBackgroundColor(color)}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <ButtonComponent
              type="submit"
              buttonName="Create Board"
              clasName="w-full h-[56px]! silver-btn rounded-[16px]!"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
