"use client";

import { useEffect, useRef } from "react";
import { mountApp } from "@follback/ui";

export default function Page() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) mountApp(ref.current);
  }, []);

  return <div ref={ref} />;
}
