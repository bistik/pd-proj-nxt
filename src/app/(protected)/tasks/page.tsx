import { getTasks } from "@/actions/tasks-actions";
import { getLatestTimeEntry } from "@/actions/time-entries-actions";
import TaskList from "@/components/tasks/task-list";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function TaskListPage() {
  return (
    <>
      <h1 className="text-4xl">Tasks</h1>
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <TaskListResult />
      </Suspense>
    </>
  );
}

async function TaskListResult() {
  const taskResult = await getTasks();
  const activeEntry = await getLatestTimeEntry();
  const activeTaskId =
    activeEntry.success && activeEntry.data
      ? activeEntry.data.time_entries.taskId
      : null;
  if (taskResult.success) {
    return (
      <TaskList taskItems={taskResult.tasks} activeTaskId={activeTaskId} />
    );
  }
  return <div>{taskResult.message}</div>;
}
