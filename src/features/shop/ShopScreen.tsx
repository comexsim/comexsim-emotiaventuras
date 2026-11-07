"use client";

import { useState } from "react";

import { ACCESSORIES } from "@/content/catalog";
import { QUARTERS_PER_COIN } from "@/content/rules";
import { formatCoins } from "@/engine/economy";
import type { Accessory } from "@/engine/types";
import { narrate } from "@/state/narrator";
import { coinSound, tapSound } from "@/state/sound";
import { useApp } from "@/state/store";

import { CoinIcon } from "../shared/CoinIcon";

/** Tienda con monedas virtuales: no se compran con dinero real y solo personalizan (V1 §2). */
export function ShopScreen() {
  const save = useApp((state) => state.save);
  const buy = useApp((state) => state.buy);
  const toggleEquip = useApp((state) => state.toggleEquip);
  const [message, setMessage] = useState("Toca un accesorio para probarlo.");

  const act = (item: Accessory) => {
    tapSound();
    if (save.owned.includes(item.id)) {
      const wearing = save.equipped[item.slot] === item.id;
      toggleEquip(item);
      setMessage(wearing ? `Guardaste: ${item.name}.` : `Te pusiste: ${item.name}.`);
      return;
    }
    const result = buy(item);
    if (result === "ok") {
      coinSound(4);
      setMessage(`¡${item.name} ya es tuyo!`);
      narrate(`¡${item.name} ya es tuyo!`);
    } else {
      const missing = item.price * QUARTERS_PER_COIN - save.coins;
      const text = `Te faltan ${formatCoins(missing)} monedas. Cada aventura te ayuda a reunirlas.`;
      setMessage(text);
      narrate(text);
    }
  };

  return (
    <aside className="side-panel shop">
      <p className="kicker">🛍️ Para tu personaje</p>
      <h2>La tienda mágica</h2>
      <p className="muted" aria-live="polite">
        {message}
      </p>
      <ul className="shop-grid">
        {ACCESSORIES.map((item) => {
          const owned = save.owned.includes(item.id);
          const wearing = save.equipped[item.slot] === item.id;
          const short = !owned && save.coins < item.price * QUARTERS_PER_COIN;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`shop-item${wearing ? " wearing" : ""}${short ? " short" : ""}`}
                aria-pressed={wearing}
                onClick={() => act(item)}
              >
                <span className="shop-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="shop-name">{item.name}</span>
                {owned ? (
                  <small className="tag">{wearing ? "Puesto" : "Lo tengo"}</small>
                ) : (
                  <small className="price">
                    <CoinIcon /> {item.price}
                  </small>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="fine">Las monedas son virtuales. Aquí no se usa dinero real.</p>
    </aside>
  );
}
