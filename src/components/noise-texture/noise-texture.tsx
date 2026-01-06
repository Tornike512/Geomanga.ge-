/**
 * NoiseTexture Component
 *
 * Adds a subtle print/poster texture overlay to create the kinetic typography aesthetic.
 * Uses SVG feTurbulence filter for performance and visual quality.
 */
export function NoiseTexture() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
      aria-hidden="true"
    >
      <svg className="h-full w-full">
        <title>Texture overlay</title>
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
