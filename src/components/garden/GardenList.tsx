"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { formatDisplayDate } from "@/lib/dateUtils";
import { statusLabels } from "@/lib/statusDisplay";
import type { PromiseEntry } from "@/types/promise";
import { promiseToFlower } from "./config/promiseToFlower";
import { useSelectionActions, useSelectionSlice } from "./hooks/useSelectionStore";
import { FlowerIcon } from "./icons/FlowerIcons";

interface Props {
  promises: PromiseEntry[];
  defaultOpen: boolean;
}

const STATUS_DOT: Record<PromiseEntry["status"], string> = {
  kept: "#79B98C",
  partly: "#E6B561",
  broke: "#D67878",
  pending: "#9B92B7",
};

export default function GardenList({ promises, defaultOpen }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const actions = useSelectionActions();
  const focusedId = useSelectionSlice((s) => s.focusedId);
  const pinnedId = useSelectionSlice((s) => s.pinnedId);

  const sorted = useMemo(() => {
    return [...promises].sort((a, b) => {
      const ad = a.completedAt ?? a.date;
      const bd = b.completedAt ?? b.date;
      return bd.localeCompare(ad);
    });
  }, [promises]);

  function handleFocus(id: string) {
    actions.setFocused(id);
  }

  function handleBlur(id: string) {
    if (focusedId === id) actions.setFocused(null);
  }

  function handleActivate(id: string) {
    actions.togglePin(id);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLLIElement>, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate(id);
    }
  }

  return (
    <section
      style={{
        marginTop: "16px",
        borderRadius: "14px",
        border: "1px solid rgba(245, 230, 208, 0.18)",
        background: "rgba(15, 12, 40, 0.4)",
        color: "#F5E6D0",
        overflow: "hidden",
      }}
      aria-label="Garden list"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="garden-list-content"
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "transparent",
          border: "none",
          color: "#F5E6D0",
          textAlign: "left",
          fontFamily:
            "var(--font-garden-serif), 'Cormorant Garamond', 'Fraunces', serif",
          fontSize: "15px",
          letterSpacing: "0.03em",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "10px",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 180ms ease",
          }}
        >
          ▸
        </span>
        Garden list
        <span
          style={{
            marginLeft: "auto",
            fontSize: "12px",
            opacity: 0.65,
            letterSpacing: "0.06em",
          }}
        >
          {sorted.length} {sorted.length === 1 ? "flower" : "flowers"}
        </span>
      </button>

      {open && (
        <ul
          id="garden-list-content"
          role="list"
          style={{
            listStyle: "none",
            margin: 0,
            padding: "4px 0 12px",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {sorted.length === 0 && (
            <li
              style={{
                padding: "12px 16px",
                fontSize: "13px",
                opacity: 0.7,
                fontStyle: "italic",
              }}
            >
              No flowers have grown yet.
            </li>
          )}
          {sorted.map((p) => {
            const flower = promiseToFlower(p);
            const isFocused = focusedId === p.id;
            const isPinned = pinnedId === p.id;
            const dateStr = formatDisplayDate(
              p.completedAt
                ? new Date(p.completedAt).toISOString().slice(0, 10)
                : p.date,
            );
            return (
              <li
                key={p.id}
                tabIndex={0}
                role="button"
                aria-pressed={isPinned}
                onFocus={() => handleFocus(p.id)}
                onBlur={() => handleBlur(p.id)}
                onMouseEnter={() => handleFocus(p.id)}
                onMouseLeave={() => handleBlur(p.id)}
                onClick={() => handleActivate(p.id)}
                onKeyDown={(e) => handleKeyDown(e, p.id)}
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  cursor: "pointer",
                  outline: "none",
                  background:
                    isFocused || isPinned
                      ? "rgba(245, 230, 208, 0.08)"
                      : "transparent",
                  borderLeft: isPinned
                    ? "2px solid #F5E6D0"
                    : "2px solid transparent",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    color: "#F5E6D0",
                    opacity: 0.85,
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <FlowerIcon archetype={flower.archetype} />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: "2px",
                    }}
                  >
                    {dateStr}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontFamily:
                        "var(--font-garden-serif), 'Cormorant Garamond', 'Fraunces', serif",
                      fontStyle: "italic",
                      lineHeight: 1.35,
                      wordBreak: "break-word",
                    }}
                  >
                    {p.text}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "11px",
                      opacity: 0.85,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: STATUS_DOT[p.status],
                        display: "inline-block",
                      }}
                    />
                    {statusLabels[p.status]}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
