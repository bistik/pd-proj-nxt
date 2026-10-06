"use client";

import { useId } from "react";
import { InlineScript } from "./inline-script";

export function LocalDate({ isoDate }: { isoDate: string }) {
  const id = useId();

  return (
    <>
      <time id={id} dateTime={isoDate} suppressHydrationWarning>
        {new Date(isoDate).toLocaleString()}
      </time>
      <InlineScript
        html={`{var n=document.getElementById("${id}");if(n)n.textContent=new Date("${isoDate}").toLocaleString()}`}
      />
    </>
  );
}
