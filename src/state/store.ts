"use client";

import { create } from "zustand";

import { situationById } from "@/content/catalog";
import { DEMO_COINS_QUARTERS, HEARTS, type DailyLimit, type Level } from "@/content/rules";
import { purchase, rewardFor } from "@/engine/economy";
import { initialHearts, settleHearts, spendHeart } from "@/engine/hearts";
import { addUsage, dayKey, entryFor, type Entry } from "@/engine/progress";
import type { Accessory, AvatarLook, Emotion, Option, SaveData, WorldId } from "@/engine/types";

import { clearSave, loadSave, writeSave } from "./persistence";

export type Screen =
  | "creator"
  | "map"
  | "challenge"
  | "shop"
  | "superpowers"
  | "forest"
  | "story"
  | "tool"
  | "room"
  | "parents";

export type ToolId = "traffic" | "volcano" | "breath";

export type Phase = "story" | "feel" | "choose" | "consequence" | "feedback";

export interface Challenge {
  situation: number;
  entry: Extract<Entry, "heart" | "practice">;
  phase: Phase;
  feeling: Emotion | null;
  option: Option["id"] | null;
  earned: number;
  /** Cambia en cada decisión: reinicia la animación aunque se repita la misma alternativa. */
  take: number;
}

export function emptySave(now: number): SaveData {
  return {
    version: 1,
    avatar: null,
    coins: 0,
    hearts: initialHearts(now),
    owned: [],
    equipped: {},
    records: {},
    log: [],
    usage: {},
    settings: { level: 3, dailyLimit: 30, volume: 0.9, subtitles: true, narration: true },
  };
}

// Reloj inyectable: el motor nunca lee la hora; la recibe desde aquí.
let clock: () => number = () => Date.now();
export const setClock = (next: () => number) => {
  clock = next;
};

const MAX_LOG = 2000;

interface AppState {
  ready: boolean;
  save: SaveData;
  screen: Screen;
  focusWorld: WorldId | null;
  challenge: Challenge | null;
  story: string | null;
  tool: ToolId | null;
  help: boolean;
  /** Mensaje amable al entrar sin corazones o con el límite cumplido. */
  notice: "forest" | "rest" | null;

  hydrate: () => void;
  go: (screen: Screen) => void;
  setHelp: (open: boolean) => void;
  dismissNotice: () => void;
  setFocusWorld: (world: WorldId | null) => void;
  createAvatar: (look: AvatarLook) => void;
  updateAvatar: (look: AvatarLook) => void;
  startSituation: (id: number) => void;
  setPhase: (phase: Phase) => void;
  pickFeeling: (feeling: Emotion) => void;
  decide: (option: Option["id"]) => void;
  tryAnother: () => void;
  leaveChallenge: () => void;
  buy: (item: Accessory) => "ok" | "already-owned" | "not-enough-coins";
  toggleEquip: (item: Accessory) => void;
  openStory: (id: string) => void;
  finishStory: (id: string) => void;
  openTool: (tool: ToolId) => void;
  setSettings: (patch: Partial<SaveData["settings"]>) => void;
  setLevel: (level: Level) => void;
  setDailyLimit: (limit: DailyLimit) => void;
  tickUsage: (seconds: number) => void;
  loadDemo: () => void;
  resetAll: () => void;
}

export const useApp = create<AppState>((set, get) => {
  const commit = (save: SaveData) => {
    writeSave(save);
    set({ save });
  };

  return {
    ready: false,
    save: emptySave(0),
    screen: "creator",
    focusWorld: null,
    challenge: null,
    story: null,
    tool: null,
    help: false,
    notice: null,

    hydrate: () => {
      const now = clock();
      const save = loadSave() ?? emptySave(now);
      const settled = { ...save, hearts: settleHearts(save.hearts, now) };
      writeSave(settled);
      set({ ready: true, save: settled, screen: settled.avatar ? "map" : "creator" });
    },

    go: (screen) => set({ screen, notice: null, challenge: null }),
    setHelp: (help) => set({ help }),
    dismissNotice: () => set({ notice: null }),
    setFocusWorld: (focusWorld) => set({ focusWorld }),

    createAvatar: (look) => {
      commit({ ...get().save, avatar: look });
      set({ screen: "map" });
    },
    updateAvatar: (look) => commit({ ...get().save, avatar: look }),

    startSituation: (id) => {
      const { save } = get();
      const now = clock();
      const entry = entryFor({
        record: save.records[id],
        hearts: save.hearts,
        now,
        usedSecondsToday: save.usage[dayKey(now)] ?? 0,
        dailyLimit: save.settings.dailyLimit,
      });
      if (entry === "forest" || entry === "rest") {
        set({ notice: entry });
        return;
      }
      if (entry === "heart") {
        const hearts = spendHeart(save.hearts, now);
        if (!hearts) {
          set({ notice: "forest" });
          return;
        }
        commit({
          ...save,
          hearts,
          records: { ...save.records, [id]: { explored: [], plays: 1 } },
        });
      } else {
        const record = save.records[id];
        if (record) {
          commit({
            ...save,
            records: { ...save.records, [id]: { ...record, plays: record.plays + 1 } },
          });
        }
      }
      set({
        screen: "challenge",
        challenge: {
          situation: id,
          entry,
          phase: "story",
          feeling: null,
          option: null,
          earned: 0,
          take: 0,
        },
      });
    },

    setPhase: (phase) => {
      const { challenge } = get();
      if (challenge) set({ challenge: { ...challenge, phase } });
    },

    pickFeeling: (feeling) => {
      const { challenge } = get();
      if (challenge) set({ challenge: { ...challenge, feeling } });
    },

    decide: (optionId) => {
      const { challenge, save } = get();
      if (!challenge) return;
      const situation = situationById(challenge.situation);
      const option = situation?.options.find((item) => item.id === optionId);
      if (!situation || !option) return;
      const record = save.records[situation.id] ?? { explored: [], plays: 1 };
      const earned = rewardFor(option, record);
      const explored = record.explored.includes(optionId)
        ? record.explored
        : [...record.explored, optionId];
      const now = clock();
      commit({
        ...save,
        coins: save.coins + earned,
        records: { ...save.records, [situation.id]: { ...record, explored } },
        log: [
          ...save.log,
          {
            kind: "decision" as const,
            at: now,
            situation: situation.id,
            option: optionId,
            topic: situation.topic,
            skills: situation.skills,
            earned,
          },
        ].slice(-MAX_LOG),
      });
      set({
        challenge: {
          ...challenge,
          option: optionId,
          earned,
          phase: "consequence",
          take: challenge.take + 1,
        },
      });
    },

    tryAnother: () => {
      const { challenge } = get();
      if (challenge) set({ challenge: { ...challenge, phase: "choose", option: null, earned: 0 } });
    },

    leaveChallenge: () => set({ challenge: null, screen: "map" }),

    buy: (item) => {
      const { save } = get();
      const result = purchase(save, item);
      if (!result.ok) return result.reason;
      commit({
        ...save,
        coins: result.coins,
        owned: result.owned,
        equipped: { ...save.equipped, [item.slot]: item.id },
      });
      return "ok";
    },

    toggleEquip: (item) => {
      const { save } = get();
      if (!save.owned.includes(item.id)) return;
      const equipped = { ...save.equipped };
      if (equipped[item.slot] === item.id) delete equipped[item.slot];
      else equipped[item.slot] = item.id;
      commit({ ...save, equipped });
    },

    openStory: (story) => set({ story, screen: "story", notice: null }),
    finishStory: (id) => {
      const { save } = get();
      commit({
        ...save,
        log: [...save.log, { kind: "story" as const, at: clock(), story: id }].slice(-MAX_LOG),
      });
    },
    openTool: (tool) => set({ tool, screen: "tool", notice: null }),

    setSettings: (patch) => {
      const { save } = get();
      commit({ ...save, settings: { ...save.settings, ...patch } });
    },
    setLevel: (level) => get().setSettings({ level }),
    setDailyLimit: (dailyLimit) => get().setSettings({ dailyLimit }),

    tickUsage: (seconds) => {
      const { save } = get();
      const now = clock();
      // Se escribe con la misma frecuencia del contador: el avance sobrevive a cerrar la pestaña.
      commit({
        ...save,
        hearts: settleHearts(save.hearts, now),
        usage: addUsage(save.usage, now, seconds),
      });
    },

    loadDemo: () => {
      const { save } = get();
      commit({
        ...save,
        coins: save.coins + DEMO_COINS_QUARTERS,
        hearts: { count: HEARTS.max, anchor: clock() },
      });
    },

    resetAll: () => {
      clearSave();
      set({
        save: emptySave(clock()),
        screen: "creator",
        challenge: null,
        story: null,
        notice: null,
        focusWorld: null,
      });
    },
  };
});

export const nowMs = () => clock();
