import { FlipWords } from "@/components/ui/flip-words";
import React from "react";

export function FlipWordsDemo() {
  const words = ["expensive", "crowded", "broken"];

  return (
    <div className="h-[7vh] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal  text-neutral-200">
        Paid marketing is
        <FlipWords words={words} /> <br />
        
      </div>
    </div>
  );
}
