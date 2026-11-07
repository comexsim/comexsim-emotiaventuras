# EmotiAventuras

**La Academia de los Superpoderes Emocionales.** Simulador educativo para niños de 5 a 9 años: reconocer emociones, manejar la frustración, pedir ayuda, comunicarse y resolver conflictos, viendo la consecuencia de cada decisión y sin miedo a equivocarse.

Demo **solo frontend**: sin backend ni cuentas. Todo se guarda en el navegador del dispositivo. El modelo SaaS será otro repositorio.

## Qué incluye (alcance de la Versión 2.0 del documento)

| | |
|---|---|
| Mundos | 4 sobre una isla 3D: aula, recreo, paseos y casa |
| Situaciones | 30, con 150 alternativas y una consecuencia para cada una |
| Economía | +1 moneda por la recomendada, +0,25 por explorar otra (una vez por alternativa) |
| Corazones | 5; uno se gasta al empezar un desafío nuevo y vuelve uno por hora |
| Sin corazones | Bosque de la Calma: 6 cuentos, semáforo, respiración, termómetro y habitación tranquila |
| Personaje | Avatar 3D con 20 accesorios y tienda mágica |
| Adultos | Panel de padres con verificación, actividad real, límite de uso y edad orientativa |
| Seguridad | Botón permanente «Necesito ayuda», sin compras reales, anuncios, rachas ni rankings |

## Desarrollo

```bash
corepack pnpm install
corepack pnpm dev        # http://localhost:3400
corepack pnpm lint && corepack pnpm typecheck && corepack pnpm test && corepack pnpm build
```

## Dónde está cada cosa

| Necesitas | Vas a |
|---|---|
| Editar una historia, alternativa o consecuencia | `src/content/situations/` |
| Cuentos, accesorios, emociones, temas | `src/content/stories.ts`, `src/content/catalog.ts` |
| Reglas de monedas, corazones y niveles | `src/content/rules.ts` y `src/engine/` (motor puro con tests) |
| Avatar, escenarios y animaciones | `src/scene/` |
| Pantallas | `src/features/` |
| Decisiones y puntos a validar | `docs/decisiones/`, `docs/validacion-de-contenido.md` |

## Despliegue

Importar el repo en Vercel (Next.js, sin variables de entorno).

## Estado del contenido

Los textos de consecuencias y cuentos se redactaron siguiendo las reglas del documento, pero **todavía no los revisó un profesional de psicología infantil ni se probaron con niños**. Ver `docs/validacion-de-contenido.md`.
