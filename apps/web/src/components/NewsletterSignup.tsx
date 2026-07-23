interface NewsletterSignupProps {
  compact?: boolean;
}

export default function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  if (compact) {
    return (
      <iframe
        src="https://www.rumicat.com/embed/margin-of-error?variant=button"
        width={540}
        height={128}
        style={{ border: "none", background: "transparent", boxSizing: "border-box", maxWidth: "100%" }}
        frameBorder={0}
        title="Newsletter subscription"
      />
    );
  }

  return (
    <iframe
      src="https://www.rumicat.com/embed/margin-of-error"
      width="100%"
      height={368}
      style={{ border: "none", borderRadius: "8px", boxSizing: "border-box", maxWidth: "100%", minWidth: 0 }}
      frameBorder={0}
      title="Newsletter subscription"
    />
  );
}