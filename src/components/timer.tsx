"use client";

import {
  endTimeEntry,
  type TimeEntryWithTask,
} from "@/actions/time-entries-actions";
import { RotateCwClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSyncExternalStore } from "react";
import { markAsDone } from "@/actions/tasks-actions";
import { LocalDate } from "./local-date";

const formatElapsed = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const subscribeToClock = (onTick: () => void) => {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
};

export function Timer({ timeEntry }: { timeEntry: TimeEntryWithTask }) {
  const nowSeconds = useSyncExternalStore(
    subscribeToClock,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );

  const onClickStop = async (entryId: number) => {
    const result = await endTimeEntry(entryId);
    if (result.success) {
      toast.success("Time entry is successfully recorded");
    } else {
      toast.error(result.error);
    }
  };

  const onClickDone = async (taskId: number, entryId: number) => {
    const result = await markAsDone(taskId, entryId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const elapsedSeconds =
    nowSeconds === null
      ? null
      : Math.max(
          0,
          nowSeconds -
            Math.floor(timeEntry.time_entries.startedAt.getTime() / 1000),
        );
  if (timeEntry) {
    return (
      <div className="my-4 bg-slate-300 text-slate-800 px-8 py-4 rounded-2xl">
        <div className="flex shimmer shimmer-duration-2000 shimmer-spread-24">
          <RotateCwClock
            className="animate-spin"
            style={{ animationDuration: "10s" }}
            size={24}
          />
          <p className="ml-4 font-mono text-xl tabular-nums">
            {elapsedSeconds === null
              ? "--:--:--"
              : formatElapsed(elapsedSeconds)}
          </p>
        </div>

        <p className="text-2xl">{timeEntry.tasks.title}</p>
        <p className="text-xl">
          <LocalDate isoDate={timeEntry.time_entries.startedAt.toISOString()} />
        </p>
        <div className="flex gap-4 mt-4">
          <Button
            variant={"destructive"}
            onClick={() => onClickStop(timeEntry.time_entries.id)}
          >
            Stop
          </Button>
          <Button
            onClick={() =>
              onClickDone(timeEntry.tasks.id, timeEntry.time_entries.id)
            }
          >
            Mark as Done
          </Button>
        </div>
      </div>
    );
  }
}
