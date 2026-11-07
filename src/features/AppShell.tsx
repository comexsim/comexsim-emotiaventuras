"use client";

import dynamic from "next/dynamic";

// El progreso vive en el navegador y la escena necesita WebGL: nada de esto existe en el servidor.
const App = dynamic(() => import("./App").then((module) => module.App), {
  ssr: false,
  loading: () => (
    <div className="boot">
      <span aria-hidden="true">🌟</span>
      <p>Preparando tu aventura…</p>
    </div>
  ),
});

export function AppShell() {
  return <App />;
}
