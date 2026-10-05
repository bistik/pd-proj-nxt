import { getTask } from "@/actions/tasks-actions";
import { getTimeEntriesByTask } from "@/actions/time-entries-actions";
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
import { Loader2 } from "lucide-react";
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

  return (
    <>
      <h2 className="text-2xl">{task.title}</h2>
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
