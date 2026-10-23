
export function Wordmark({ text }: { text: string }) {
  return (
    <svg
      className="wordmark"
      viewBox="0 0 1000 172"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="0"
        y="140"
        textLength="1000"
        lengthAdjust="spacing"
        fontFamily="var(--display)"
        fontSize="176"
        fontWeight="700"
        fill="currentColor"
        style={{ fontVariationSettings: "'wdth' 112" }}
      >
        {text}
      </text>
    </svg>
  )
}
