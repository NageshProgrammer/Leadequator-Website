"use client";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";


const words = ` Turn real conversations into real customers with AI-guided human engagement
`;

export function TextGenerateEffectDemo() {
  return <TextGenerateEffect className="text-xl md:text-2xl dark:text-zinc-200 text-zinc-800 mb-8 max-w-3xl mx-auto" words={words} />;
}
