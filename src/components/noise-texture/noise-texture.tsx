/**
 * NoiseTexture Component
 *
 * Adds a subtle atmospheric noise texture to create depth in the Minimalist Dark design.
 * Uses SVG feTurbulence filter for performance and visual quality.
 * Very low opacity (0.015) to maintain the clean, sophisticated aesthetic.
 */
export function NoiseTexture() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.015] mix-blend-overlay"
      aria-hidden="true"
    >
      <svg className="h-full w-full">
        <title>Atmospheric texture overlay</title>
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
