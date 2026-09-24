/**
 * Vivah Vedam flower mark — recreated from the brand logo:
 * blush circle, five petals, crimson stamens on green filaments.
 */
export function VivahMark({ size = 44 }: { size?: number }) {
  const petals = [0, 72, 144, 216, 288];
  const stamens = [36, 108, 180, 252, 324];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="Vivah Vedam">
      <circle cx="32" cy="32" r="32" fill="#f8e3e7" />
      {petals.map((a) => (
        <path
          key={`p${a}`}
          d="M32 34 C26.8 28.5, 26.2 18.5, 32 11 C37.8 18.5, 37.2 28.5, 32 34 Z"
          fill="#f2a9b7"
          opacity={a === 0 ? 1 : 0.92}
          transform={`rotate(${a} 32 32)`}
        />
      ))}
      {stamens.map((a) => (
        <g key={`s${a}`} transform={`rotate(${a} 32 32)`}>
          <path d="M32 33 L32 24" stroke="#4e6b45" strokeWidth="1.7" strokeLinecap="round" />
          <ellipse cx="32" cy="22" rx="2.2" ry="3.6" fill="#a6192e" />
        </g>
      ))}
      <circle cx="32" cy="33" r="2.4" fill="#a6192e" />
    </svg>
  );
}
