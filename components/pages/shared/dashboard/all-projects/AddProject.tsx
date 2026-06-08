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
import ButtonComponent from "@/components/ui/ButtonComponent";
import { Plus } from "lucide-react";
import { toast } from 'sonner';
import { createWorkspace } from '@/service/workspaceService/workspace.service';

export default function AddProject() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const toastId = toast.loading("Project creating please wait...")
    try {
      const data = {
        name: formData.get("title") as string,
        description: formData.get("description") as string
      }
      const res = await createWorkspace(data)
      if (res?.success) {
        toast.success("Project created successfully", { id: toastId });
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Failed to create project", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to create project", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-sm shadow-sm silver-btn">
          <Plus size={18} />
          Create Project
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]! silver-metallic">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-gray-800">Create New Project</DialogTitle>
          <DialogDescription className="text-gray-500">
            Add a new project to your workspace. Set the title and description below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Project Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Website Redesign"
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
              placeholder="Describe your project..."
              className="rounded-[16px]! min-h-[120px]"
            />
          </div>
          <DialogFooter className="mt-4">
            <ButtonComponent
              type="submit"
              buttonName="Save Project"
              clasName="w-full h-[56px]! silver-btn rounded-[16px]!"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
