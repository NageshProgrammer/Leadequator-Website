import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    icon?: React.ReactNode; // 1. Added optional icon property here
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                // CHANGED THIS LINE: Replaced solid amber-400 with a subtle, glowing transparent yellow that works with glassmorphism
                className="absolute inset-0 h-full w-full bg-[#fbbf24]/10 block rounded-[2.5rem] border border-[#fbbf24]/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            {/* 2. Render the icon if it exists */}
            {item.icon && <div className="mb-2">{item.icon}</div>}
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};


export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-[2rem] h-full w-full p-4 overflow-hidden bg-[#050505]/60 backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.05)] group-hover:bg-[#111111]/80 group-hover:border-white/[0.1] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-500 ease-out relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};