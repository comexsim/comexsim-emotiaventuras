"use client";

import { create } from "zustand";

import type { AvatarLook } from "@/engine/types";

/** Aspecto que se está eligiendo: la escena lo muestra antes de guardarlo. */
export const useDraft = create<{
  look: AvatarLook | null;
  set: (look: AvatarLook | null) => void;
}>((set) => ({
  look: null,
  set: (look) => set({ look }),
}));

export const useDraftLook = () => useDraft((state) => state.look);
