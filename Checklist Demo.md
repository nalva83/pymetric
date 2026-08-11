# Checklist Demo — de la idea a la app publicada

Guion **comando por comando** del demo en vivo. Construís *"¿Tu idea es una AI App viable?"* —un form de 4 pasos que llama a un LLM y devuelve un diagnóstico— desde cero, dirigiendo al equipo de agentes. **No se toca código a mano.**

> Mensaje del demo: **"se dirige y funciona"**, no "aprendé cada línea". Nombrá los agentes en voz alta: la audiencia ve al *equipo*.
> Regla de tiempo: si un paso se pasa, seguí (o saltá a un save point). El pitch es sagrado.

---

## 0. Pre-flight (antes de salir en vivo)

- [ ] **Repo limpio (CP0):** solo `.claude/` + `docs/` + `CLAUDE.md` + `PROGRESS/DECISIONS/QUALITY.md`. **Sin `app/`.**
- [ ] **Node en PATH:** `nvm use 22` (o `export PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH"`). Probar `node -v`.
- [ ] **GitHub:** `gh auth status` → logueado (`dami-novolabs`).
- [ ] **Vercel:** `vercel whoami` → `novolabs-startupschool`; proyecto `curso-ai-app-demo` linkeado (existe `.vercel/`).
- [ ] **API key:** `OPENAI_API_KEY` ya cargada en Vercel (Production + Preview). Verificar: `vercel env ls`.
- [ ] **Claude Code** abierto en el repo, con los agentes visibles (`.claude/agents/`).
- [ ] Zoom de terminal/navegador grande y legible. Grabación de respaldo lista.

**El equipo (se nombra en voz alta):** Analista (`prd-author`) · Arquitecto (`architecture-author`) + Arq. de Datos (`data-modeler`) · Planificador (`roadmap-author`) · Autor de Specs (`spec-author`) · Programador (`spec-implementer`) · QA (`spec-verifier`) · Diseñador (`ux-reviewer`) · Contador (`cost-guardian`) · DevOps (`deploy-engineer`).

---

## Paso 0 — Contexto (1 min)

- [ ] Mostrar el repo limpio y la carpeta `.claude/agents/` (el equipo ya adentro).
- **Decís:** *"Esto es lo único que preparé: un proyecto vacío con mi equipo de agentes adentro. No voy a tocar el código a mano. Le voy a hablar."*

---

## Paso 1 — De la idea al PRD · `prd-author` (3 min)

- [ ] **Comando:**
  ```
  /new-prd
  ```
- [ ] **Prompt literal (la idea, en español):**
  > *"Quiero una app web simple: un formulario de 4 pasos donde alguien describe su idea de producto (qué hace, para quién, qué problema resuelve, si ya la validó). Al terminar, quiero que una IA le devuelva un diagnóstico corto y personalizado: si su idea encaja como AI App, cuál sería el primer módulo a construir, y cuál es su principal riesgo. Bajámelo a un PRD chico con el MVP mínimo. Sin base de datos: form → IA → resultado."*
- [ ] **Resultado:** `docs/prd.md` con MVP + milestones con DoD + no-objetivos.
- **Decís:** *"Le hablé en español, como a un socio. Me devolvió el documento que manda: qué construimos y qué NO."*
- **Checkpoint CP1** (parte 1). **Golpe → C2 "yo no puedo":** no hubo código, hubo una conversación.

---

## Paso 2 — Arquitectura básica · `architecture-author` + `data-modeler` (2 min · corto a propósito)

- [ ] **Comando:**
  ```
  /new-architecture
  ```
- [ ] **Prompt literal:**
  > *"Arquitectura mínima para esto: Next.js (App Router) en Vercel, una API route que llama a OpenAI, y sin base de datos —es sin estado, el diagnóstico se muestra y no se guarda—. La API key va como variable de entorno, nunca en el código, y ponele un techo de gasto por llamada."*
- [ ] **Resultado:** `docs/arquitectura/*.md` (integración LLM: secreto en env #2, techo de gasto #3) + reglas numeradas en la constitución. El modelo de datos es N/A (sin estado) — el Arquitecto de Datos lo deja anotado.
- **Decís:** *"El cómo técnico queda resuelto acá. Le pido al Arquitecto que fije dónde vive la API key y el límite de gasto, y sigo."*

---

## Paso 3 — Un solo Roadmap + Specs · `roadmap-author` + `spec-author` (3 min)

- [ ] **Comando (un solo roadmap para el milestone M1):**
  ```
  /new-roadmap M1
  ```
- [ ] **Prompt literal:**
  > *"Partime esto en specs chicas y verificables, con criterios de aceptación claros, en UN solo roadmap. Empezá por el formulario. Pensá dos o tres specs: (1) el form multi-step de 4 pasos, (2) la conexión al LLM y la pantalla de resultado."*
- [ ] **Resultado:** `docs/sdd/plans/active/m1-*.md` con la tabla de specs (§8): `M1-01` (form), `M1-02` (LLM + resultado).
- [ ] **Comando (autora el detalle de cada spec — fan-out):**
  ```
  /decompose docs/sdd/plans/active/m1-<slug>.md
  ```
- [ ] **Resultado:** `docs/sdd/specs/M1-01-*.md` y `docs/sdd/specs/M1-02-*.md` (cada una con criterios testables + plan de verificación de 3 capas).
- **Decís:** *"Acá está el secreto de por qué la IA no arma un castillo de naipes: no le pedís todo junto. Le das pedazos chicos con un contrato claro de 'terminado'. Este es el corazón del método."*
- **Checkpoint CP1** (completo). **Golpe:** siembra la respuesta a **C1** (el método es lo que lo vuelve serio).

---

## Paso 4 — Implementación I: el formulario · `spec-implementer` + `spec-verifier` + `ux-reviewer` (5 min)

- [ ] **Save point antes de arrancar:**
  ```
  /save-point antes-de-m1-01
  ```
- [ ] **Prosa al Programador:**
  > *"Implementá la Spec M1-01 con TDD. Es el form multi-step de 4 pasos, sin IA todavía. Cuando termines, que cada paso avance solo y se vea prolijo."*
- [ ] **Levantar el dev server y mirar el form andando:**
  ```
  npm install && npm run dev      # http://localhost:3000
  ```
- [ ] **Prosa al QA:** *"Verificá M1-01 — que cada paso avanza y las 3 capas quedan en verde."* → `spec-verifier`.
- [ ] **Prosa al Diseñador:** *"Revisá la UX, que no parezca hecho por IA."* → `ux-reviewer`.
- [ ] **Save point (commit en vivo):**
  ```
  /save-point form-andando
  ```
- **Decís:** *"No es un prototipo feo hecho por IA. Es un formulario real, con pasos y transiciones, que ya funciona. Y lo verificó otro agente antes de darlo por terminado."*
- **Checkpoint CP2** (form corriendo en local, sin IA). **Golpe → C1 (p1):** salió algo real y prolijo.

---

## Paso 5 — Conexión con IA · `spec-implementer` + `cost-guardian` (5 min)

- [ ] **Prosa al Programador:**
  > *"Implementá la Spec M1-02: conectá el formulario a OpenAI para que devuelva el diagnóstico (encaje como AI App + primer módulo + riesgo principal), y mostralo en una pantalla de resultado. Manejá la API key de forma segura (env) y ponele un techo de gasto."*
- [ ] **Prosa al Contador:** *"Revisá el gasto y la API key."* → `cost-guardian` confirma key en env (#2) + techo de gasto (#3).
- [ ] **Cargar la key en local (si hace falta):** `cp .env.local.example .env.local` → pegar `OPENAI_API_KEY`. *(En Vercel ya está.)*
- [ ] **Llenar el form en vivo con una idea del público** (pedila por el chat) → mostrar el **diagnóstico personalizado**.
- **Decís:** *"Pásenme una idea. Cualquiera."* → *"Esto es lo que lo vuelve una AI App: no es un form que guarda datos, es un form que **piensa**. Miren: la respuesta es específica de esta idea, no un texto genérico."*
- **Checkpoint CP3** (LLM conectado, devuelve diagnóstico). **Golpe → C1 (p2)** + prueba de que no está scripteado.

---

## Paso 6 — Deploy · `deploy-engineer` (3 min)

- [ ] **Comando (gate listo-para-producción):**
  ```
  /deploy-check prod
  ```
  → `deploy-engineer` corre el checklist (3 capas #5, secretos en env #2, techo #3, build, URL) e invoca a `cost-guardian` y `ux-reviewer`.
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
| 1 | `/new-prd` | prd-author | CP1 |
| 2 | `/new-architecture` | architecture-author + data-modeler | CP1 |
| 3 | `/new-roadmap M1` → `/decompose <roadmap>` | roadmap-author + spec-author | CP1 |
| 4 | *prosa* "implementá M1-01" / "verificá" / "revisá UX" + `/save-point` | spec-implementer · spec-verifier · ux-reviewer | CP2 |
| 5 | *prosa* "implementá M1-02" / "revisá gasto y key" | spec-implementer · cost-guardian | CP3 |
| 6 | `/deploy-check prod` → `git push` **o** `vercel --prod` | deploy-engineer | CP4 |
| 7 | abrir URL + QR | — | WOW |

## Red de seguridad
- Cada `/save-point` deja un hash de retorno: si algo se rompe, `git checkout <hash>` (o `git reset --hard <hash>`) y seguís.
- Fallback total: grabación completa del demo lista para reproducir.
- La `OPENAI_API_KEY` **nunca** se muestra en pantalla (regla #2): ya vive en Vercel y en `.env.local` (gitignored).

## Infra ya lista (no se toca en vivo)
- **Repo:** https://github.com/dami-novolabs/curso-ai-app-demo (conectado a Vercel: cada push deploya).
- **Vercel:** proyecto `novolabs-startupschool/curso-ai-app-demo`, `OPENAI_API_KEY` cargada, producción pública (previews protegidos).
- **URL de producción:** https://curso-ai-app-demo.vercel.app
