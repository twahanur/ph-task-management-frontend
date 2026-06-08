import React from "react";
import { getMyTasks } from "@/service/userService/user.service";
import TasksMain from "@/components/pages/shared/dashboard/TasksMain";

export default async function TasksPage() {
  const initialData = await getMyTasks();

  return (
    <div className="w-full">
      <TasksMain initialData={initialData} />
    </div>
  );
}
