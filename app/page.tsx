"use client";

import { useState } from "react";

type Answers = {
  que: string;
  paraQuien: string;
  problema: string;
  validado: string;
};

type Diagnosis = {
  encaje: "alto" | "medio" | "bajo";
  encajeResumen: string;
  primerModulo: string;
  riesgo: string;
};

const VALIDACION_OPCIONES = [
  "Todavía no, es solo una idea",
  "Hablé con algunos usuarios potenciales",
  "Ya tengo usuarios usándola",
];

const TOTAL_STEPS = 4;

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    que: "",
    paraQuien: "",
    problema: "",
    validado: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof Answers, v: string) =>
    setAnswers((a) => ({ ...a, [k]: v }));

  const canContinue = () => {
    if (step === 0) return answers.que.trim().length > 3;
    if (step === 1) return answers.paraQuien.trim().length > 2;
    if (step === 2) return answers.problema.trim().length > 3;
    if (step === 3) return answers.validado.length > 0;
    return false;
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else submit();
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo generar el diagnóstico.");
      setResult(data as Diagnosis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({ que: "", paraQuien: "", problema: "", validado: "" });
    setResult(null);
    setError(null);
  }

  return (
    <main className="shell">
      <div className="brand">
        <span className="dot" />
        <span>construido con el método de Novo · en vivo</span>
      </div>

      <div className="card">
        {result ? (
          <Result data={result} onReset={reset} />
        ) : loading ? (
          <Loading />
        ) : (
          <>
            <div className="progress">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <span key={i} className={i <= step ? "done" : ""} />
              ))}
            </div>

            <p className="eyebrow">
              Paso {step + 1} de {TOTAL_STEPS}
            </p>

            {step === 0 && (
              <div className="step">
                <h1>¿Qué hace tu producto?</h1>
                <p className="hint">
                  En una o dos frases, contá qué hace tu idea. Como si se lo
                  explicaras a un amigo.
                </p>
                <label htmlFor="que">Tu idea</label>
                <textarea
                  id="que"
                  autoFocus
                  placeholder="Ej: una app que arma el plan de entrenamiento semanal según tus objetivos y equipo disponible."
                  value={answers.que}
                  onChange={(e) => set("que", e.target.value)}
                />
              </div>
            )}

            {step === 1 && (
              <div className="step">
                <h1>¿Para quién es?</h1>
                <p className="hint">¿Quién es la persona que más lo necesita?</p>
                <label htmlFor="paraQuien">Tu usuario</label>
                <input
                  id="paraQuien"
                  type="text"
                  autoFocus
                  placeholder="Ej: personas que entrenan solas en casa y no saben qué rutina seguir."
                  value={answers.paraQuien}
                  onChange={(e) => set("paraQuien", e.target.value)}
                />
              </div>
            )}

            {step === 2 && (
              <div className="step">
                <h1>¿Qué problema resuelve?</h1>
                <p className="hint">
                  ¿Qué dolor concreto le sacás a esa persona?
                </p>
                <label htmlFor="problema">El problema</label>
                <textarea
                  id="problema"
                  autoFocus
                  placeholder="Ej: pierden motivación porque improvisan y no ven progreso; abandonan a las 3 semanas."
                  value={answers.problema}
                  onChange={(e) => set("problema", e.target.value)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="step">
                <h1>¿Ya la validaste?</h1>
                <p className="hint">
                  Sé honesto: nos ayuda a calibrar el diagnóstico.
                </p>
                <div className="choices">
                  {VALIDACION_OPCIONES.map((opt) => (
                    <div
                      key={opt}
                      className={
                        "choice" + (answers.validado === opt ? " active" : "")
                      }
                      onClick={() => set("validado", opt)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") set("validado", opt);
                      }}
                    >
                      <span className="radio" />
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="err">{error}</div>}

            <div className="actions">
              {step > 0 && (
                <button className="btn-ghost" onClick={back} type="button">
                  Atrás
                </button>
              )}
              <button
                className="btn-primary"
                onClick={next}
                disabled={!canContinue()}
                type="button"
              >
                {step < TOTAL_STEPS - 1 ? "Continuar" : "Ver mi diagnóstico"}
              </button>
            </div>
          </>
        )}
      </div>

      <p className="footer">Tu idea no se guarda. El diagnóstico lo genera una IA.</p>
    </main>
  );
}

function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>Analizando tu idea con IA…</p>
    </div>
  );
}

function Result({ data, onReset }: { data: Diagnosis; onReset: () => void }) {
  const label =
    data.encaje === "alto"
      ? "Encaje alto"
      : data.encaje === "medio"
        ? "Encaje medio"
        : "Encaje bajo";
  return (
    <div className="result">
      <span className={"verdict " + data.encaje}>{label} como AI App</span>
      <h2>Tu diagnóstico</h2>

      <div className="block">
        <p className="k">🎯 Encaje como AI App</p>
        <p className="v">{data.encajeResumen}</p>
      </div>
      <div className="block">
        <p className="k">🧱 Primer módulo a construir</p>
        <p className="v">{data.primerModulo}</p>
      </div>
      <div className="block">
        <p className="k">⚠️ Tu riesgo principal</p>
        <p className="v">{data.riesgo}</p>
      </div>

      <div className="actions">
        <button className="btn-ghost" onClick={onReset} type="button">
          Probar otra idea
        </button>
      </div>
    </div>
  );
}
