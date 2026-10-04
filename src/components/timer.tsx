"use client";

import {
  endTimeEntry,
  type TimeEntryWithTask,
} from "@/actions/time-entries-actions";
import { RotateCwClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Timer({ timeEntry }: { timeEntry: TimeEntryWithTask }) {
  const onClickStop = async (entryId: number) => {
    const result = await endTimeEntry(entryId);
    if (result.success) {
      toast.success("Time entry is successfully recorded");
    } else {
      toast.error(result.error);
    }
  };
  if (timeEntry) {
    return (
      <div className="my-4 bg-slate-300 text-slate-800 px-8 py-4 rounded-2xl">
        <div className="flex shimmer shimmer-duration-2000 shimmer-spread-24">
          <RotateCwClock
            className="animate-spin"
            style={{ animationDuration: "10s" }}
            size={24}
          />
          <p className="ml-4">In progress...</p>
        </div>

        <p className="text-2xl">{timeEntry.tasks.title}</p>
        <p className="text-xl">
          {timeEntry.time_entries.startedAt.toLocaleString()}
        </p>
        <div className="flex gap-4 mt-4">
          <Button
            variant={"destructive"}
            onClick={() => onClickStop(timeEntry.time_entries.id)}
          >
            Stop
          </Button>
          <Button>Mark as Done</Button>
        </div>
      </div>
    );
  }
}
