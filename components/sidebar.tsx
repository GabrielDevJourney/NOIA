"use client";

import { useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Link04Icon,
  Idea01Icon,
  PencilEdit01Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export type Tab = "write" | "library" | "connect" | "concepts";

export const TABS: { id: Tab; label: string; icon: IconSvgElement }[] = [
  { id: "write", label: "Write", icon: PencilEdit01Icon },
  { id: "library", label: "Library", icon: BookOpen01Icon },
  { id: "connect", label: "Connect", icon: Link04Icon },
  { id: "concepts", label: "Concepts", icon: Idea01Icon },
];

/**
 * Sidebar — drop-in props:
 *   - activeTab: Tab
 *   - onTabChange: (tab: Tab) => void
 *
 * Collapse state (icon-only rail vs. full sidebar) is owned locally here;
 * the parent doesn't need to know about it. Collapsing only affects the
 * `md:` layout — on narrow/mobile viewports the sidebar always renders
 * expanded, since the rail treatment only makes sense once it stops
 * spanning the full width.
 */
export function Sidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col gap-8 border-border p-6 transition-[width] duration-300 md:h-full md:border-r",
        collapsed ? "md:w-16 md:p-3" : "md:w-72 md:p-8"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex flex-col gap-1 overflow-hidden transition-[max-width,opacity] duration-300",
            collapsed ? "md:max-w-0 md:opacity-0" : "md:max-w-[240px] md:opacity-100"
          )}
        >
          <h1 className="font-serif text-2xl italic tracking-tight text-foreground">
            NOIA
          </h1>
          <p className="text-sm text-muted-foreground">
            two of your own notes, one new concept.
          </p>
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
        >
          <HugeiconsIcon
            icon={SidebarLeftIcon}
            size={20}
            strokeWidth={1.5}
            className={cn(
              "transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex gap-4 md:flex-col md:gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
            className={cn(
              "flex w-fit items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors md:w-full",
              collapsed && "md:w-fit md:justify-center md:px-1.5",
              activeTab === tab.id
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={tab.icon} size={20} strokeWidth={1.5} />
            <span className={cn(collapsed && "md:hidden")}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
