"use client";

import { useEffect } from "react";

import { World } from "@/scene/World";
import { stopNarration } from "@/state/narrator";
import { useApp } from "@/state/store";

import { ChallengeScreen } from "./challenge/ChallengeScreen";
import { Creator } from "./creator/Creator";
import { CalmRoom } from "./forest/CalmRoom";
import { ForestScreen } from "./forest/ForestScreen";
import { StoryScreen } from "./forest/StoryScreen";
import { ToolScreen } from "./forest/ToolScreen";
import { MapScreen } from "./map/MapScreen";
import { ParentsScreen } from "./parents/ParentsScreen";
import { HelpOverlay } from "./shared/HelpOverlay";
import { Hud } from "./shared/Hud";
import { ShopScreen } from "./shop/ShopScreen";
import { SuperpowersScreen } from "./shop/SuperpowersScreen";

const USAGE_TICK_SECONDS = 15;

export function App() {
  const ready = useApp((state) => state.ready);
  const hydrate = useApp((state) => state.hydrate);
  const screen = useApp((state) => state.screen);
  const tickUsage = useApp((state) => state.tickUsage);

  useEffect(() => hydrate(), [hydrate]);

  // Cuenta el tiempo solo con la pestaña visible y fuera del panel de adultos.
  useEffect(() => {
    if (!ready) return undefined;
    const timer = window.setInterval(() => {
      const current = useApp.getState();
      if (
        document.visibilityState === "visible" &&
        current.screen !== "parents" &&
        current.save.avatar
      ) {
        tickUsage(USAGE_TICK_SECONDS);
      }
    }, USAGE_TICK_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [ready, tickUsage]);

  // La narración de una pantalla nunca se oye en la siguiente.
  useEffect(() => stopNarration, [screen]);

  if (!ready) return null;
  return (
    <main className="stage">
      <World />
      {screen !== "parents" && screen !== "creator" && <Hud />}
      {screen === "creator" && <Creator />}
      {screen === "map" && <MapScreen />}
      {screen === "challenge" && <ChallengeScreen />}
      {screen === "shop" && <ShopScreen />}
      {screen === "superpowers" && <SuperpowersScreen />}
      {screen === "forest" && <ForestScreen />}
      {screen === "story" && <StoryScreen />}
      {screen === "tool" && <ToolScreen />}
      {screen === "room" && <CalmRoom />}
      {screen === "parents" && <ParentsScreen />}
      {screen !== "parents" && <HelpOverlay />}
    </main>
  );
}
