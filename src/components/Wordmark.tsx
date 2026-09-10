/**
 * The footer nameplate — design.md, Footer.
 *
 * Set as SVG text with `textLength` so it fills its container exactly at every
 * width, from a 320px phone to a 1280px page, without a font-size clamp that
 * is only correct at one of them. `lengthAdjust="spacing"` opens and closes
 * the tracking to reach that width rather than stretching the glyphs, which is
 * what a stamped nameplate actually does.
 *
 * It is decorative: the company name is already stated in the legal rail
 * directly beneath it, so it is hidden from assistive technology rather than
 * read out twice.
 */
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
