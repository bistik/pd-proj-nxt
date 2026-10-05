import { getTask } from "@/actions/tasks-actions";
import {
  getTimeEntriesByTask,
  hasActiveTimeEntry,
} from "@/actions/time-entries-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDuration } from "@/lib/utils";
import { BadgeAlert, BadgeCheck, BadgeInfo, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import z from "zod";

export default function ShowTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  return (
    <>
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <ShowTaskResult params={params} />
      </Suspense>
    </>
  );
}

async function ShowTaskResult({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const parsed = z.coerce.number().int().positive().safeParse(taskId);
  if (!parsed.success) notFound();

  const task = await getTask(parsed.data);
  const entries = await getTimeEntriesByTask(parsed.data);
  const hasActiveEntry = await hasActiveTimeEntry(parsed.data);

  return (
    <>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl tracking-tight">{task.title}</h2>
        {task.isDone && (
          <Badge>
            <BadgeCheck data-icon="inline-start" />
            Done
          </Badge>
        )}
        {!task.isDone && (hasActiveEntry || entries.entries.length > 0) && (
          <Badge>
            <BadgeInfo data-icon="inline-start" />
            In Progress
          </Badge>
        )}
        {!task.isDone && !hasActiveEntry && entries.entries.length === 0 && (
          <Badge>
            <BadgeAlert data-icon="inline-start" />
            Not Started
          </Badge>
        )}
      </div>
      <Table>
        <TableCaption>Time entries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.success &&
            entries.entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.startedAt.toLocaleString()}</TableCell>
                <TableCell>{entry.endedAt?.toLocaleString()}</TableCell>
                <TableCell className="text-right">{entry.duration}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        {entries.success && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">
                {formatDuration(entries.totalDuration)}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
}
