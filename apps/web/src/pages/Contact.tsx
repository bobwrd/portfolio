import { useState } from "react";
import Layout from "@/components/Layout";
import { submitContact } from "@/lib/api";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const result = await submitContact(form);
    if (result.success) {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <Layout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Contact</h1>
        </div>
        <div className="rounded-xl border border-border p-8 text-center bg-secondary/20">
          <p className="text-lg font-semibold text-foreground mb-2">Message sent.</p>
          <p className="text-sm text-muted-foreground">Thanks — I will get back to you.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Send another message
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Contact</h1>
          <p className="text-sm text-muted-foreground">
            Questions, feedback, or just want to talk economics or law — reach out.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" required>
            <input
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={update("name")}
              className={inputClass}
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={form.email}
              onChange={update("email")}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Subject" required>
          <input
            type="text"
            required
            placeholder="What is this about?"
            value={form.subject}
            onChange={update("subject")}
            className={inputClass}
          />
        </Field>

        <Field label="Message" required>
          <textarea
            required
            rows={6}
            placeholder="Your message…"
            value={form.message}
            onChange={update("message")}
            className={`${inputClass} resize-y`}
          />
        </Field>

        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
        </div>
      </form>
    </Layout>
  );
}

const inputClass =
  "w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-muted-foreground ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}