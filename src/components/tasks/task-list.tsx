"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/lib/db/tasks-schema";
import { Button } from "../ui/button";
import { createTimeEntry } from "@/actions/time-entries-actions";
import { toast } from "sonner";

export default function TaskList({
  taskItems,
  activeTaskId,
}: {
  taskItems: Task[];
  activeTaskId: number | null;
}) {
  const onClickHandler = async (task: Task) => {
    const result = await createTimeEntry(task);
    if (!result.success) {
      toast.error(result.error);
    }
  };

  return (
    <Table>
      <TableCaption>Your tasks</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {taskItems.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              {activeTaskId === task.id ? (
                <p>In progress...</p>
              ) : (
                <Button onClick={() => onClickHandler(task)}>Play</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
