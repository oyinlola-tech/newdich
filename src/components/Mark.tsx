/**
 * The mark. Measured off its 512x512 artboard: outer radius 116 (22.6%),
 * module 44 square with radius 12 (27.3%), gutter 14, one connector curve from
 * the top-left module to the bottom-right.
 *
 * The face carries the company's own logo gradient. It is the identity asset
 * rather than page decoration, and all three of its stops are blue — the
 * one-gradient rule in design.md governs what the site draws, not what the
 * company's mark already is.
 */
export function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ndFace" x1="16" y1="8" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#45B1E0" />
          <stop offset=".55" stopColor="#1296D4" />
          <stop offset="1" stopColor="#075894" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14.5" fill="url(#ndFace)" />
      <path
        d="M29.6 29.6c1.4 1.4.2 3.3 1.5 4.6 1.3 1.3 3.2.1 4.6 1.5"
        fill="none"
        stroke="#EFF8FC"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <g fill="#EFF8FC">
        <rect x="17.5" y="17.5" width="12.5" height="12.5" rx="3.4" />
        <rect x="34" y="17.5" width="12.5" height="12.5" rx="3.4" />
        <rect x="17.5" y="34" width="12.5" height="12.5" rx="3.4" />
        <rect x="34" y="34" width="12.5" height="12.5" rx="3.4" />
      </g>
    </svg>
  )
}
