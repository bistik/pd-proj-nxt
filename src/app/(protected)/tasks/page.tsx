import { getTasks } from "@/actions/tasks-actions";
import TaskList from "@/components/tasks/task-list";

export default async function TaskListPage() {
  const taskResult = await getTasks();
  if (taskResult.success) {
    return (
      <>
        <h1 className="text-4xl">Tasks</h1>
        <TaskList taskItems={taskResult.tasks} />
      </>
    );
  }
  return <div>{taskResult.message}</div>;
}
