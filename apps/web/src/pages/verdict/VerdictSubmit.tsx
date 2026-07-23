import { useState } from "react";

interface FormState {
  title: string;
  date: string;
  decision_type: string;
  jurisdiction: string;
  summary: string;
  legal_mechanism: string;
  economic_consequence: string;
  LI: string;
  SE: string;
  ER: string;
  SF: string;
  PS: string;
  sources: string;
  contributor: string;
  password: string;
}

const EMPTY: FormState = {
  title: "", date: "", decision_type: "regulatory", jurisdiction: "",
  summary: "", legal_mechanism: "", economic_consequence: "",
  LI: "", SE: "", ER: "", SF: "", PS: "",
  sources: "", contributor: "", password: "",
};

function ScoreInput({ label, name, value, onChange }: {
  label: string; name: keyof FormState; value: string;
  onChange: (name: keyof FormState, v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[0.65rem] font-mono tracking-widest uppercase mb-1" style={{ color: "var(--verdict-muted)" }}>
        {label}
      </label>
      <input
        type="number" min="1" max="10" step="1"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder="1–10"
        className="w-full rounded border px-3 py-2 text-sm font-mono bg-transparent outline-none focus:ring-1"
        style={{
          borderColor: "var(--verdict-border)",
          color: "var(--verdict-text)",
          "--tw-ring-color": "var(--verdict-accent)",
        } as React.CSSProperties}
      />
    </div>
  );
}

function TextInput({ label, name, value, onChange, placeholder, multiline = false }: {
  label: string; name: keyof FormState; value: string;
  onChange: (name: keyof FormState, v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const commonProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(name, e.target.value),
    placeholder,
    className: "w-full rounded border px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 font-sans",
    style: {
      borderColor: "var(--verdict-border)",
      color: "var(--verdict-text)",
      "--tw-ring-color": "var(--verdict-accent)",
    } as React.CSSProperties,
  };

  return (
    <div>
      <label className="block text-[0.65rem] font-mono tracking-widest uppercase mb-1" style={{ color: "var(--verdict-muted)" }}>
        {label}
      </label>
      {multiline
        ? <textarea rows={3} {...commonProps} />
        : <input type="text" {...commonProps} />
      }
    </div>
  );
}

export default function VerdictSubmit() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (name: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const scores: Record<string, number> = {};
    for (const key of ["LI", "SE", "ER", "SF", "PS"] as const) {
      const v = parseInt(form[key], 10);
      if (isNaN(v) || v < 1 || v > 10) {
        setErrorMsg(`${key} must be a number between 1 and 10.`);
        setStatus("error");
        return;
      }
      scores[key] = v;
    }

    const sources = form.sources.split("\n").map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/verdict/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-verdict-password": form.password,
        },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          decision_type: form.decision_type,
          jurisdiction: form.jurisdiction,
          summary: form.summary,
          legal_mechanism: form.legal_mechanism,
          economic_consequence: form.economic_consequence,
          scores,
          sources,
          contributor: form.contributor || "anonymous",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? `Error ${res.status}`);
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  };

  const inputGroupStyle = {
    backgroundColor: "var(--verdict-surface)",
    borderColor: "var(--verdict-border)",
  };

  if (status === "success") {
    return (
      <div className="py-16 text-center">
        <div className="text-4xl font-mono mb-4" style={{ color: "var(--verdict-accent)" }}>✓</div>
        <div className="font-semibold mb-2" style={{ color: "var(--verdict-text)" }}>Case submitted as draft.</div>
        <p className="text-sm font-mono" style={{ color: "var(--verdict-muted)" }}>
          It will appear once reviewed and published.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 px-4 py-2 rounded text-sm font-mono border transition-all duration-150"
          style={{ borderColor: "var(--verdict-accent)", color: "var(--verdict-accent)" }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--verdict-text)" }}>
          Submit a case
        </h1>
        <p className="text-sm" style={{ color: "var(--verdict-muted)" }}>
          Submissions are saved as drafts. Scores are computed automatically when published.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="rounded-lg border p-5 space-y-4" style={inputGroupStyle}>
          <div className="text-[0.65rem] font-mono tracking-widest uppercase" style={{ color: "var(--verdict-muted)" }}>
            Case details
          </div>
          <TextInput label="Title" name="title" value={form.title} onChange={update} placeholder="Full case or decision name" />
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Date (YYYY-MM-DD)" name="date" value={form.date} onChange={update} placeholder="2024-08-01" />
            <div>
              <label className="block text-[0.65rem] font-mono tracking-widest uppercase mb-1" style={{ color: "var(--verdict-muted)" }}>
                Decision type
              </label>
              <select
                value={form.decision_type}
                onChange={(e) => update("decision_type", e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm bg-transparent outline-none"
                style={{ borderColor: "var(--verdict-border)", color: "var(--verdict-text)" }}
              >
                <option value="court">Court</option>
                <option value="regulatory">Regulatory</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
          </div>
          <TextInput label="Jurisdiction" name="jurisdiction" value={form.jurisdiction} onChange={update} placeholder="e.g. European Union, United States" />
        </div>

        {/* Content */}
        <div className="rounded-lg border p-5 space-y-4" style={inputGroupStyle}>
          <div className="text-[0.65rem] font-mono tracking-widest uppercase" style={{ color: "var(--verdict-muted)" }}>
            Content
          </div>
          <TextInput label="Summary" name="summary" value={form.summary} onChange={update} multiline placeholder="2–4 sentence summary of the decision and its significance." />
          <TextInput label="Legal mechanism" name="legal_mechanism" value={form.legal_mechanism} onChange={update} multiline placeholder="What legal instrument? How does it bind? What are the penalties?" />
          <TextInput label="Economic consequence" name="economic_consequence" value={form.economic_consequence} onChange={update} multiline placeholder="What does this cost, who bears it, and over what timeframe?" />
        </div>

        {/* Scores */}
        <div className="rounded-lg border p-5" style={inputGroupStyle}>
          <div className="text-[0.65rem] font-mono tracking-widest uppercase mb-4" style={{ color: "var(--verdict-muted)" }}>
            Raw scores (1–10)
          </div>
          <div className="grid grid-cols-5 gap-3">
            <ScoreInput label="LI" name="LI" value={form.LI} onChange={update} />
            <ScoreInput label="SE" name="SE" value={form.SE} onChange={update} />
            <ScoreInput label="ER" name="ER" value={form.ER} onChange={update} />
            <ScoreInput label="SF" name="SF" value={form.SF} onChange={update} />
            <ScoreInput label="PS" name="PS" value={form.PS} onChange={update} />
          </div>
          <p className="text-xs font-mono mt-3" style={{ color: "var(--verdict-muted)" }}>
            LI = Legal Instrument · SE = Societal Effect · ER = Economic Reach · SF = Structural Force · PS = Political Salience
          </p>
        </div>

        {/* Sources + contributor */}
        <div className="rounded-lg border p-5 space-y-4" style={inputGroupStyle}>
          <div className="text-[0.65rem] font-mono tracking-widest uppercase" style={{ color: "var(--verdict-muted)" }}>
            Attribution
          </div>
          <TextInput
            label="Sources (one URL per line)"
            name="sources"
            value={form.sources}
            onChange={update}
            multiline
            placeholder={"https://example.com/source1\nhttps://example.com/source2"}
          />
          <TextInput label="Contributor (optional)" name="contributor" value={form.contributor} onChange={update} placeholder="Your name or handle" />
        </div>

        {/* Password */}
        <div className="rounded-lg border p-5" style={inputGroupStyle}>
          <div className="text-[0.65rem] font-mono tracking-widest uppercase mb-3" style={{ color: "var(--verdict-muted)" }}>
            Access
          </div>
          <div>
            <label className="block text-[0.65rem] font-mono tracking-widest uppercase mb-1" style={{ color: "var(--verdict-muted)" }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm bg-transparent outline-none font-mono"
              style={{ borderColor: "var(--verdict-border)", color: "var(--verdict-text)" }}
              placeholder="Required to submit"
            />
          </div>
        </div>

        {status === "error" && (
          <div
            className="rounded border p-3 text-sm font-mono"
            style={{ borderColor: "var(--verdict-seismic)", color: "var(--verdict-seismic)", backgroundColor: "rgba(248,113,113,0.08)" }}
          >
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded py-3 text-sm font-mono font-bold tracking-wider transition-all duration-150 disabled:opacity-50"
          style={{
            backgroundColor: "var(--verdict-accent)",
            color: "var(--verdict-bg)",
          }}
        >
          {status === "loading" ? "Submitting…" : "Submit as draft"}
        </button>
      </form>
    </div>
  );
}
