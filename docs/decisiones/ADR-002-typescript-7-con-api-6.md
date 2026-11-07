# ADR-002 — TypeScript 7 junto a la API de TypeScript 6

- **Estado:** Propuesta (2026-11-07)

## Contexto

TypeScript 7.0 no trae API de compilador. `typescript-eslint` 8.72.1, que carga `eslint-config-next`, solo admite versiones por debajo de 6.1, y se niega a arrancar con la 7.0. Por eso el lint fallaba al actualizar.

## Decisión

Seguir la vía que publica Microsoft en el anuncio de TypeScript 7.0, con dos alias en `devDependencies`:

- `typescript` apunta a `@typescript/typescript6`, para las herramientas que necesitan la API.
- `@typescript/native` apunta a `typescript` 7, y de ahí sale el `tsc` que usa `pnpm typecheck`.

## Consecuencias

- A favor: la revisión de tipos usa el compilador nuevo, y lint, Next y los tests siguen con la API que soportan.
- En contra: hay dos versiones de TypeScript instaladas, y el editor o una herramienta pueden usar la 6 aunque `tsc` sea la 7.
- Los alias se quitan cuando `typescript-eslint` admita TypeScript 7.1 ([seguimiento](https://github.com/typescript-eslint/typescript-eslint/issues/10940)).
