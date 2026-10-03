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

export default function TaskList({ taskItems }: { taskItems: Task[] }) {
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
            <TableCell>{/* Play button will go here */}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
