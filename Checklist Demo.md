# Checklist Demo — de la idea a la app publicada

Guion **comando por comando** del demo en vivo. Construís *"¿Tu idea es una AI App viable?"* —un form de 4 pasos que llama a un LLM y devuelve un diagnóstico— desde cero, dirigiendo al equipo de agentes. **No se toca código a mano.**

> Mensaje del demo: **"se dirige y funciona"**, no "aprendé cada línea". Nombrá los agentes en voz alta: la audiencia ve al *equipo*.
> Regla de tiempo: si un paso se pasa, seguí (o saltá a un save point). El pitch es sagrado.

---

## 0. Pre-flight (antes de salir en vivo)

- [ ] **Repo limpio (CP0):** solo `.claude/` + `docs/` + `CLAUDE.md` + `PROGRESS/DECISIONS/QUALITY.md`. **Sin `app/`.**
- [ ] **Node en PATH:** `nvm use 22`. Probar `node -v`.
- [ ] **GitHub:** `gh auth status` → logueado (`dami-novolabs`).
- [ ] **Vercel:** `vercel whoami` → `novolabs-startupschool`; proyecto `curso-ai-app-demo` linkeado (existe `.vercel/`).
- [ ] **API key:** `OPENAI_API_KEY` ya cargada en Vercel (Production + Preview). Verificar: `vercel env ls`.
- [ ] **Claude Code** abierto en el repo, con los agentes visibles (`.claude/agents/`).
- [ ] Zoom de terminal/navegador grande y legible. Grabación de respaldo lista.

**El equipo (se nombra en voz alta):** Analista (`prd-author`) · Arquitecto (`architecture-author`) · Planificador (`planner`) · Programador (`builder`) · Diseñador (`ux-reviewer`) · DevOps (`deploy-engineer`).

---

## Paso 0 — Contexto (1 min)

- [ ] Mostrar el repo limpio y la carpeta `.claude/` (el equipo ya adentro).
- **Decís:** *"Esto es lo único que preparé: un proyecto vacío con mi equipo de agentes adentro. No voy a tocar el código a mano. Le voy a hablar."*

---

## Paso 1 — De la idea al PRD · Analista (3 min)

- [ ] **Comando:**
  ```
  /new-prd
  ```
- [ ] **Prompt literal (la idea, en español):**
  > *"Quiero una app web simple: un formulario de 4 pasos donde alguien describe su idea de producto (qué hace, para quién, qué problema resuelve, si ya la validó). Al terminar, quiero que una IA le devuelva un diagnóstico corto y personalizado: si su idea encaja como AI App, cuál sería el primer módulo a construir, y cuál es su principal riesgo. Bajámelo a un PRD chico con el MVP mínimo. Sin base de datos: form → IA → resultado."*
- [ ] **Resultado:** `docs/prd.md` con el MVP como recorrido completo + milestones demostrables + fuera de alcance. Una sola tanda de preguntas.
- **Decís:** *"Le hablé en español, como a un socio. Me hizo un par de preguntas y me devolvió el documento que manda: qué construimos y qué NO."*
- **Checkpoint CP1** (parte 1). **Golpe → C2 "yo no puedo":** no hubo código, hubo una conversación.

---

## Paso 2 — Arquitectura básica · Arquitecto (2 min · corto a propósito)

- [ ] **Comando:**
  ```
  /new-architecture
  ```
- [ ] **Prompt literal:**
  > *"Arquitectura mínima para esto: Next.js (App Router) en Vercel, una API route que llama a OpenAI, y sin base de datos —es sin estado, el diagnóstico se muestra y no se guarda—. La API key va como variable de entorno, nunca en el código, y ponele un techo de gasto por llamada."*
- [ ] **Resultado:** `docs/arquitectura/decisiones.md` (un solo archivo: API key en env #2, techo de gasto #3, "sin base de datos" en una línea) + reglas numeradas en la constitución.
- **Decís:** *"El cómo técnico queda resuelto en un solo documento: dónde vive la API key, el límite de gasto, y sigo."*

---

## Paso 3 — El plan con sus specs · Planificador (3 min)

- [ ] **Comando (una sola pasada: plan + specs):**
  ```
  /new-plan M1
  ```
- [ ] **Prompt literal:**
  > *"Partime esto en specs chicas y verificables, con criterios de aceptación claros. Empezá por el formulario. Pensá dos specs: (1) el form multi-step de 4 pasos, (2) la conexión al LLM y la pantalla de resultado."*
- [ ] **Resultado:** `docs/sdd/plans/active/m1-*.md` con la tabla de piezas + `docs/sdd/specs/M1-01-*.md` y `M1-02-*.md` (fichas cortas, criterios comprobables). Todo en un comando.
- **Decís:** *"Acá está el secreto de por qué la IA no arma un castillo de naipes: no le pedís todo junto. Le das pedazos chicos con un contrato claro de 'terminado'. Este es el corazón del método."*
- **Checkpoint CP1** (completo). **Golpe:** siembra la respuesta a **C1** (el método es lo que lo vuelve serio).

---

## Paso 4 — Implementación I: el formulario · Programador + Diseñador (5 min)

- [ ] **Save point antes de arrancar:**
  ```
  /save-point antes-de-m1-01
  ```
- [ ] **Prosa al Programador:**
  > *"Construí la M1-01. Es el form multi-step de 4 pasos, sin IA todavía. Cuando termines, que cada paso avance solo, se vea prolijo, y dejá las 3 verificaciones en verde."*
- [ ] **Levantar el dev server y mirar el form andando:**
  ```
  npm install && npm run dev      # http://localhost:3000
  ```
- [ ] **Prosa al Diseñador:** *"Revisá la UX, que no parezca hecho por IA."* → `ux-reviewer`.
- [ ] **Save point (commit en vivo):**
  ```
  /save-point form-andando
  ```
- **Decís:** *"No es un prototipo feo hecho por IA. Es un formulario real, con pasos y transiciones, que ya funciona. Y el mismo agente que lo construyó lo verificó tres veces antes de darlo por terminado."*
- **Checkpoint CP2** (form corriendo en local, sin IA). **Golpe → C1 (p1):** salió algo real y prolijo.

---

## Paso 5 — Conexión con IA · Programador (5 min)

- [ ] **Prosa al Programador:**
  > *"Construí la M1-02: conectá el formulario a OpenAI para que devuelva el diagnóstico (encaje como AI App + primer módulo + riesgo principal), y mostralo en una pantalla de resultado. Manejá la API key de forma segura (env) y ponele un techo de gasto."*
- [ ] **Cargar la key en local (si hace falta):** `cp .env.local.example .env.local` → pegar `OPENAI_API_KEY`. *(En Vercel ya está.)*
- [ ] **Llenar el form en vivo con una idea del público** (pedila por el chat) → mostrar el **diagnóstico personalizado**.
- **Decís:** *"Pásenme una idea. Cualquiera."* → *"Esto es lo que lo vuelve una AI App: no es un form que guarda datos, es un form que **piensa**. Miren: la respuesta es específica de esta idea, no un texto genérico."*
- **Checkpoint CP3** (LLM conectado, devuelve diagnóstico). **Golpe → C1 (p2)** + prueba de que no está scripteado.

---

## Paso 6 — Deploy · DevOps (3 min)

- [ ] **Comando (control listo-para-publicar):**
  ```
  /deploy-check prod
  ```
  → `deploy-engineer` corre el checklist (verificaciones #5, key en env #2, techo #3, costo estimado, build, URL) y `ux-reviewer` da la mirada de diseño — dos agentes, en paralelo.
- [ ] **Deploy real (una de las dos):**
  ```
  # A) por Git (auto-deploy vía la integración GitHub↔Vercel):
  git add -A && git commit -m "feat: AI App viable — form + LLM" && git push

  # B) directo por CLI (URL al toque):
  vercel --prod
  ```
- [ ] **Mostrar la tabla de costos al pasar:** Claude ~$20/mes · Vercel/Supabase/Railway empiezan gratis · ~$5 de créditos de IA.
- [ ] **Sale la URL pública, grande en pantalla:** `https://curso-ai-app-demo.vercel.app`
- **Decís:** *"Y ahora lo más importante: lo publico. En internet. Ahora mismo. Tardó veinte minutos y las herramientas empiezan casi todas gratis."*
- **Checkpoint CP4** (app desplegada, URL viva). **Golpe → C3 "años y plata":** rápido, barato, publicado de verdad.

---

## Paso 7 — El WOW (2 min)

- [ ] Poner la **URL corta + QR gigante** en pantalla.
- **Decís:** *"Abran el link en su celular. Ahora. Usen la app que construimos juntos, recién, frente a ustedes."*
- [ ] **30–60 seg de silencio** mientras la usan. Leer en voz alta 1–2 diagnósticos que compartan por el chat.
- **Cierre:** *"Hace veinte minutos esto no existía. Y no escribí una sola línea de código a mano."* → cortar screenshare → **slide 18**.

---

## Mapa rápido (etapa → comando → checkpoint)

| Paso | Comando / disparo | Agente | Checkpoint |
|---|---|---|---|
| 1 | `/new-prd` | Analista | CP1 |
| 2 | `/new-architecture` | Arquitecto | CP1 |
| 3 | `/new-plan M1` | Planificador | CP1 |
| 4 | *prosa* "construí M1-01" / "revisá UX" + `/save-point` | Programador · Diseñador | CP2 |
| 5 | *prosa* "construí M1-02" | Programador | CP3 |
| 6 | `/deploy-check prod` → `git push` **o** `vercel --prod` | DevOps · Diseñador | CP4 |
| 7 | abrir URL + QR | — | WOW |

## Red de seguridad
- Cada `/save-point` deja un hash de retorno: si algo se rompe, `git checkout <hash>` (o `git reset --hard <hash>`) y seguís.
- Fallback total: grabación completa del demo lista para reproducir.
- La `OPENAI_API_KEY` **nunca** se muestra en pantalla (regla #2): ya vive en Vercel y en `.env.local` (gitignored).

## Infra ya lista (no se toca en vivo)
- **Repo:** https://github.com/dami-novolabs/curso-ai-app-demo (conectado a Vercel: cada push deploya).
- **Vercel:** proyecto `novolabs-startupschool/curso-ai-app-demo`, `OPENAI_API_KEY` cargada, producción pública (previews protegidos).
- **URL de producción:** https://curso-ai-app-demo.vercel.app
