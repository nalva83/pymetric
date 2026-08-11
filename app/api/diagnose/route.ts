import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Techo de gasto (regla #3): límite duro de tokens de salida por llamada.
const MAX_OUTPUT_TOKENS = 500;
const MODEL = "gpt-4o-mini";

type Body = {
  que?: string;
  paraQuien?: string;
  problema?: string;
  validado?: string;
};

const SYSTEM = `Sos un evaluador de producto experto en "AI Apps" (aplicaciones cuyo núcleo de valor es un modelo de IA que razona sobre el problema del usuario, no un simple CRUD).
Recibís la descripción de una idea y devolvés un diagnóstico BREVE, concreto y personalizado para ESA idea (nada genérico).
Respondé SIEMPRE en español rioplatense, en JSON válido con exactamente estas claves:
- "encaje": uno de "alto" | "medio" | "bajo" (qué tan bien encaja como AI App).
- "encajeResumen": 1-2 frases explicando el encaje, específicas de la idea.
- "primerModulo": 1 frase con el PRIMER módulo concreto a construir (el más chico que ya da valor).
- "riesgo": 1 frase con el riesgo principal específico de esta idea.
No inventes datos de mercado. Sé directo y honesto.`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar OPENAI_API_KEY en el entorno." },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const que = (body.que || "").trim();
  const paraQuien = (body.paraQuien || "").trim();
  const problema = (body.problema || "").trim();
  const validado = (body.validado || "").trim();

  if (!que || !paraQuien || !problema) {
    return NextResponse.json(
      { error: "Faltan respuestas para diagnosticar." },
      { status: 400 },
    );
  }

  const userPrompt = `Idea del usuario:
- Qué hace: ${que}
- Para quién: ${paraQuien}
- Qué problema resuelve: ${problema}
- Estado de validación: ${validado || "no indicado"}

Devolvé el diagnóstico en el JSON pedido.`;

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "El modelo no devolvió respuesta." },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(raw);
    const encaje = ["alto", "medio", "bajo"].includes(parsed.encaje)
      ? parsed.encaje
      : "medio";

    return NextResponse.json({
      encaje,
      encajeResumen: String(parsed.encajeResumen || "").trim(),
      primerModulo: String(parsed.primerModulo || "").trim(),
      riesgo: String(parsed.riesgo || "").trim(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error llamando al modelo.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
