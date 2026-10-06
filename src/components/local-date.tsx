"use client";

import { useEffect, useState } from "react";

export function LocalDate({ date }: { date: string | Date }) {
  const iso = typeof date === "string" ? date : date.toISOString();
  const [text, setText] = useState("");

  useEffect(() => {
    setText(new Date(iso).toLocaleString());
  }, [iso]);
  return <time dateTime={iso}>{text}</time>;
}
