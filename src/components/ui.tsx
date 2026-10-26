"use client";

import { motion } from "framer-motion";
import { WipeIn, WipeWords } from "./wipe-in";

export function SectionTitle({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      {/* `as="div"` on purpose: the span variant sets display:inline-block
          inline, which would beat the flex centring on the circle. */}
      <WipeIn
        inView
        className="mono mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-[12px] text-fg-muted sm:h-10 sm:w-10 sm:text-[13px]"
      >
        {index}
      </WipeIn>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg-default sm:text-3xl">
          <WipeWords text={title} inView delay={0.1} stagger={0.06} />
        </h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-1 max-w-2xl text-sm text-fg-muted sm:text-[15px]"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
