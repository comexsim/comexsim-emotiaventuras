# AGENTS.md — comexsim-emotiaventuras

Reglas para todo agente en este repo. Complementa el `AGENTS.md` del paraguas (`comexsim-docs`), con la misma excepción que `comexsim-agrosim`: **solo frontend**, sin backend ni login. El modelo SaaS irá en otro repositorio.

## Qué cambia respecto del paraguas

- **No aplica:** multi-tenant, RLS, API, contratos, borrado lógico ni motor en paquete aparte.
- **Solo español** por ahora (el documento declara opcional el segundo idioma). Los textos viven en `src/content/` y en las pantallas, nunca en el motor.
- **Identidad propia:** EmotiAventuras no lleva la marca UPSA/SIMA salvo que el autor lo pida.

## Reglas de este producto (no negociables)

- **Es para niños de 5 a 9 años.** En textos visibles se habla de «simulador», «aventura» y «desafío».
- **Validar antes de corregir** y nunca avergonzar: nada de «fallaste», caras de desaprobación ni sonidos de derrota.
- **Sin presión:** sin rachas, anuncios, compras reales, rankings ni penalizaciones por ausentarse.
- **Una agresión nunca se muestra con contacto ni como algo divertido**, ni recibe animaciones llamativas.
- **La recomendada no se marca antes de decidir.**
- **Corazones:** se gastan al comenzar un desafío nuevo, nunca por elegir, equivocarse o pedir ayuda.
- **Privacidad:** ningún dato personal; el nombre se elige de una lista de fantasía; nada sale del dispositivo.
- **El panel de padres no diagnostica, no califica y no compara.**
- **Cambios en contenido sensible** (seguridad, acoso, datos en línea) los revisa un profesional antes de publicarse.
- **Motor puro** (`src/engine`): sin `Date.now()` ni `Math.random()`; el reloj entra como parámetro. Monedas en cuartos enteros.
- TypeScript estricto, comentarios y commits en español, tests nombrados por criterio (`EA-…`).
- Solo emojis disponibles en Windows 10: los más nuevos salen como cuadritos.
- Rendimiento: sin posprocesado; apunta a 60 FPS en un portátil común, con respaldo 2D.

## Flujo

Una rama por tarea y PR hacia `main`. Antes de instalar una dependencia, avisar y anotar el porqué en `docs/decisiones/`.
