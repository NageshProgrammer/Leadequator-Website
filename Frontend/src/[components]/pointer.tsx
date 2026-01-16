import { PointerHighlight } from "@/components/ui/pointer-highlight";

export function PointerHighlightDemo() {
  return (
    <div className="mx-auto max-w-4xl py-2 text-4xl md:text-5xl font-bold text-center ">
      3-5X Higher Conversions.
      <div className="flex justify-center mt-5  ">
        <PointerHighlight>
          <span className="text-amber-400 p-4 ">$0 Ad Spend.</span>
        </PointerHighlight>
      </div>
    </div>
  );
}