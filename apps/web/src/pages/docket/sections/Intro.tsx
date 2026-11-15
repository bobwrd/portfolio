import ToolIntro from "@/components/ToolIntro";

export default function Intro() {
  return (
    <ToolIntro
      prefix="docket"
      meta="NJDG and eCourts data, 2022–24"
      number="02.6"
      title="49 million cases. One broken paper trail."
      byline="India's courts have more pending cases than any country on earth. Citizens cannot see where their case stands, judges cannot easily see what is ahead of them, and no one tracks the delays precisely enough to fix them."
      keywords="49.6M pending cases (2024). 30% of High Court judge posts vacant. Average case age of 5.2 years in Uttar Pradesh district courts. 75% of India's prisoners are undertrials."
      abstract={
        <p>
          This tool maps the backlog using aggregated public data (pending cases
          by state, court level and case type), scores the structural
          bottlenecks behind those numbers, and builds a prototype case tracker
          showing what better record-keeping could look like for an ordinary
          citizen.
        </p>
      }
      chapters={[
        { href: "#backlog", number: "1", title: "Map the backlog", meta: "By state and court level" },
        { href: "#bottlenecks", number: "2", title: "Score the bottlenecks", meta: "Where delays come from" },
        { href: "#tracker", number: "3", title: "Case tracker prototype", meta: "A digital case register" },
        { href: "#indosing", number: "4", title: "India vs Singapore", meta: "The digital court gap" },
      ]}
      note={
        <>
          Data: NJDG, eCourts project, Ministry of Law &amp; Justice (2022-24).
          Figures are aggregated and approximate; see the{" "}
          <a href="/mini/docket/methods" className="underline" style={{ color: "var(--docket-accent)" }}>
            technical note
          </a>{" "}
          for sourcing.
        </>
      }
    >
      <p>
        The comparison is personal. I moved from India to Singapore to study,
        and the contrast is stark. Singapore's eLitigation system files, tracks
        and notifies digitally. Most Indian district courts still rely on
        handwritten cause lists, postal notices and manual registers. The
        difference comes down to data infrastructure.
      </p>
      <p>
        The central question: could better data organisation and simple digital
        tools reduce the backlog, without more judges or new laws? The evidence
        says yes, for a specific, tractable subset of delays.
      </p>
    </ToolIntro>
  );
}
