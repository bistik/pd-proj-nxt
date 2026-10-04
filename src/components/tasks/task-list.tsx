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
import { useState } from "react";
import { Square } from "lucide-react";

export default function TaskList({ taskItems }: { taskItems: Task[] }) {
  const [playingTaskId, setPlayingTaskId] = useState<number | null>(null);
  const onClickHandler = async (task: Task) => {
    const result = await createTimeEntry(task);
    if (result.success) {
      setPlayingTaskId(task.id);
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
              {playingTaskId === task.id && (
                <>
                  <Square className="animate-spin w-10 h-10 text-indigo-600" />
                  {"In progress..."}
                </>
              )}
              {playingTaskId !== task.id && (
                <Button onClick={() => onClickHandler(task)}>Play</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
