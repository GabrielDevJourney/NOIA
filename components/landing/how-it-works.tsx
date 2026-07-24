"use client";

import { motion, useReducedMotion } from "motion/react";

type Step = {
  label: string;
  color: string;
};

const STEPS: Step[] = [
  { label: "add notes you've already saved", color: "bg-chart-1" },
  { label: "the app picks two", color: "bg-chart-5" },
  { label: "get back one new concept connecting them", color: "bg-chart-2" },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto flex max-w-[46ch] flex-col">
      {STEPS.map((step, index) => (
        <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
          {index < STEPS.length - 1 ? (
            <motion.div
              className="absolute left-[18px] top-9 w-px bg-border"
              style={{ height: "calc(100% - 2.25rem)", transformOrigin: "top" }}
              initial={{ scaleY: reduceMotion ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, ease: "easeOut", delay: index * 0.12 + 0.2 }
              }
            />
          ) : null}

          <motion.div
            className={`relative z-10 size-9 shrink-0 rounded-full ${step.color}`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
          />

          <motion.div
            className="flex flex-col pt-1.5"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
          >
            <span className="text-base text-foreground">{step.label}</span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
