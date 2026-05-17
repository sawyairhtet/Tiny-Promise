"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface SelectionState {
  hoveredId: string | null;
  pinnedId: string | null;
  focusedId: string | null;
}

export interface SelectionActions {
  setHovered: (id: string | null) => void;
  togglePin: (id: string) => void;
  pin: (id: string) => void;
  unpin: () => void;
  setFocused: (id: string | null) => void;
}

type Listener = (state: SelectionState) => void;

let currentState: SelectionState = {
  hoveredId: null,
  pinnedId: null,
  focusedId: null,
};
const listeners = new Set<Listener>();

function update(patch: Partial<SelectionState>) {
  const next = { ...currentState, ...patch };
  if (
    next.hoveredId === currentState.hoveredId &&
    next.pinnedId === currentState.pinnedId &&
    next.focusedId === currentState.focusedId
  ) {
    return;
  }
  currentState = next;
  listeners.forEach((l) => l(next));
}

export const selectionActions: SelectionActions = {
  setHovered: (id) => update({ hoveredId: id }),
  togglePin: (id) =>
    update({ pinnedId: currentState.pinnedId === id ? null : id }),
  pin: (id) => update({ pinnedId: id }),
  unpin: () => update({ pinnedId: null }),
  setFocused: (id) => update({ focusedId: id }),
};

export function getSelectionState(): SelectionState {
  return currentState;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): SelectionState {
  return {
    hoveredId: null,
    pinnedId: null,
    focusedId: null,
  };
}

export function useSelectionActions(): SelectionActions {
  return selectionActions;
}

export function useSelectionSlice<T>(
  selector: (state: SelectionState) => T,
): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(currentState),
    () => selector(getServerSnapshot()),
  );
}

export function useIsFlowerActive(id: string): {
  hovered: boolean;
  pinned: boolean;
  focused: boolean;
} {
  const hovered = useSelectionSlice((s) => s.hoveredId === id);
  const pinned = useSelectionSlice((s) => s.pinnedId === id);
  const focused = useSelectionSlice((s) => s.focusedId === id);
  return useMemo(
    () => ({ hovered, pinned, focused }),
    [hovered, pinned, focused],
  );
}

export function useActiveFlowerId(): string | null {
  return useSelectionSlice((s) => s.pinnedId ?? s.hoveredId ?? s.focusedId);
}
