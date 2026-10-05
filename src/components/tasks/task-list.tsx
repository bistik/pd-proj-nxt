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
import Link from "next/link";
import { Badge } from "../ui/badge";
import { BadgeCheckIcon } from "lucide-react";

export default function TaskList({
  taskItems,
  activeTaskId,
}: {
  taskItems: Task[];
  activeTaskId: number | null;
}) {
  const onClickHandler = async (task: Task) => {
    if (activeTaskId) {
      toast.error("Another task is already in progress");
      return;
    }
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
            <TableCell>
              <Link
                href={`/tasks/${task.id}`}
                className="underline text-blue-600 hover:text-blue-800 hover:cursor-pointer"
              >
                {task.title}
              </Link>
            </TableCell>
            <TableCell>
              {activeTaskId === task.id && <p>In progress...</p>}
              {activeTaskId !== task.id && !task.isDone && (
                <Button onClick={() => onClickHandler(task)}>Play</Button>
              )}
              {activeTaskId !== task.id && task.isDone && (
                <Badge variant={"outline"}>
                  <BadgeCheckIcon />
                  Done
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
