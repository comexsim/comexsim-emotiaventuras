# ADR-001 — Stack del simulador y escena propia

- **Estado:** Propuesta (2026-11-07)

## Contexto

EmotiAventuras se trabaja como los demás simuladores, pero sus escenas son primeros planos de personajes y su público usa tabletas o portátiles comunes. El kit de `comexsim-agrosim` está pensado para una maqueta isométrica con cámara ortográfica y posprocesado.

## Decisión

1. **Mismo stack base:** Next 16, React 19, React Three Fiber 9, drei 10, three, zustand y vitest. Sin dependencias nuevas respecto de AgroSim.
2. **Sin `postprocessing`, `decimal.js` ni `next-intl`:** no hay posprocesado para cuidar los FPS, las monedas son cuartos enteros y por ahora solo hay español.
3. **Escena propia** con cámara en perspectiva. De AgroSim se copian solo `src/world/quality.ts` y `src/world/runtime.ts` (calidad adaptable y detección de GPU).
4. **Personajes con primitivas articuladas**, sin archivos 3D ni licencias de terceros. Las animaciones son funciones puras del tiempo (`src/scene/poses.ts`).
5. **Un solo lienzo** montado todo el tiempo: cambiar de pantalla no recrea el contexto WebGL.
6. **Etiquetas del mapa como botones HTML** que la escena solo posiciona. `Html` de drei lanzó `removeChild` al desmontarse junto con la escena.
7. **Narración con la voz del sistema** (Web Speech), aislada en `src/state/narrator.ts`, para cambiarla por voces grabadas sin tocar las pantallas.

## Consecuencias

- A favor: instala sin tokens, despliega en Vercel sin configuración y pesa poco.
- En contra: el acabado es de juguete y no el de una película animada; la voz depende del dispositivo; agregar inglés exigirá dar idioma también a `src/content/`.
