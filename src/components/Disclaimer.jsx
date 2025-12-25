import { useState } from "react";

export default function Disclaimer() {
  const [dismissed, setDismissed] = useState(
    localStorage.getItem("disclaimer-dismissed") === "true"
  );

  if (dismissed) return null;

  return (
    <div className="disclaimer-banner">
      <div className="disclaimer-content">
        <strong>⚠️ Educational Demo Only</strong>
        <p>
          This is a demonstration application for educational purposes. 
          ChannelHub does not host, stream, or provide any video content. 
          All channel data is sourced from public APIs for demonstration purposes only.
        </p>
      </div>
      <button
        className="disclaimer-close"
        onClick={() => {
          setDismissed(true);
          localStorage.setItem("disclaimer-dismissed", "true");
        }}
        aria-label="Dismiss disclaimer"
      >
        ×
      </button>
    </div>
  );
}

