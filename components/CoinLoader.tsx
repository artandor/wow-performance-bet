const COIN_STYLES = `
  @keyframes cl-coin-spin {
    0%,100% { rx:38; ry:38; }
    25%,75% { rx:6;  ry:38; }
    50%     { rx:38; ry:38; }
  }
  @keyframes cl-face-squeeze {
    0%,50%,100% { transform:scaleX(1); }
    25%,75%     { transform:scaleX(0.14); }
  }
  @keyframes cl-edge-squeeze {
    0%,50%,100% { transform:scaleX(1); opacity:1; }
    20%,70%     { transform:scaleX(0.4); opacity:1; }
    25%,75%     { transform:scaleX(0); opacity:0; }
  }
  @keyframes cl-shine-move {
    0%,50%,100% { transform:scaleX(1) translateX(-30px); opacity:0; }
    20%,70%     { opacity:0.55; }
    45%,95%     { transform:scaleX(1) translateX(30px); opacity:0; }
  }
  @keyframes cl-shadow-pulse {
    0%,50%,100% { rx:28; ry:5; opacity:0.55; }
    25%,75%     { rx:4;  ry:5; opacity:0.2; }
  }
  @keyframes cl-glow-pulse {
    0%,50%,100% { opacity:0.18; }
    25%,75%     { opacity:0.04; }
  }
  @keyframes cl-dot-blink {
    0%,100% { opacity:1;   }
    33%     { opacity:0.3; }
    66%     { opacity:0.6; }
  }
  .cl-body   { animation: cl-coin-spin    1.4s ease-in-out infinite; transform-origin: 340px 200px; }
  .cl-face   { animation: cl-face-squeeze 1.4s ease-in-out infinite; transform-origin: 340px 200px; }
  .cl-edge   { animation: cl-edge-squeeze 1.4s ease-in-out infinite; transform-origin: 340px 200px; }
  .cl-shine  { animation: cl-shine-move   1.4s ease-in-out infinite; transform-origin: 340px 200px; }
  .cl-shadow { animation: cl-shadow-pulse 1.4s ease-in-out infinite; transform-origin: 340px 260px; }
  .cl-glow   { animation: cl-glow-pulse   1.4s ease-in-out infinite; transform-origin: 340px 200px; }
  .cl-d1 { animation: cl-dot-blink 0.9s ease-in-out 0s   infinite; }
  .cl-d2 { animation: cl-dot-blink 0.9s ease-in-out 0.3s infinite; }
  .cl-d3 { animation: cl-dot-blink 0.9s ease-in-out 0.6s infinite; }
`

interface CoinLoaderProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CoinLoader({ label = 'Loading', size = 'md' }: CoinLoaderProps) {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.4 : 1
  const w = Math.round(200 * scale)
  const h = Math.round(240 * scale)

  return (
    <div className="flex flex-col items-center gap-5">
      <style dangerouslySetInnerHTML={{ __html: COIN_STYLES }} />

      <svg width={w} height={h} viewBox="240 130 200 160">
        <defs>
          <linearGradient id="cl-gold-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#ffe066" />
            <stop offset="40%"  stopColor="#ffc93c" />
            <stop offset="100%" stopColor="#c47a1e" />
          </linearGradient>
          <linearGradient id="cl-gold-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b8860b" />
            <stop offset="50%"  stopColor="#8b6508" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
          <linearGradient id="cl-glow-grad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="#ffc93c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffc93c" stopOpacity="0" />
          </linearGradient>
          <clipPath id="cl-face-clip">
            <ellipse cx="340" cy="200" rx="38" ry="38" className="cl-body" />
          </clipPath>
        </defs>

        {/* Glow halo */}
        <ellipse className="cl-glow" cx="340" cy="200" rx="62" ry="62"
          fill="url(#cl-glow-grad)" opacity="0.18" />

        {/* Ground shadow */}
        <ellipse className="cl-shadow" cx="340" cy="258" rx="28" ry="5"
          fill="#000" opacity="0.55" />

        {/* Coin edge (side thickness) */}
        <g className="cl-edge">
          <ellipse cx="340" cy="203" rx="38" ry="38" fill="url(#cl-gold-edge)" />
          <ellipse cx="340" cy="197" rx="38" ry="38" fill="url(#cl-gold-edge)" opacity="0.6" />
          <line x1="302" y1="197" x2="302" y2="203" stroke="#8b6508" strokeWidth="0.5" />
          <line x1="378" y1="197" x2="378" y2="203" stroke="#b8860b" strokeWidth="0.5" />
        </g>

        {/* Coin face */}
        <g className="cl-face" clipPath="url(#cl-face-clip)">
          <ellipse cx="340" cy="200" rx="38" ry="38" fill="url(#cl-gold-face)" />
          <circle cx="340" cy="200" r="32" fill="none" stroke="#c49a00" strokeWidth="1.5" opacity="0.6" />
          <circle cx="340" cy="200" r="27" fill="none" stroke="#c49a00" strokeWidth="0.5" opacity="0.3" />
          <text x="340" y="196" textAnchor="middle" dominantBaseline="central"
            fontFamily="Georgia, serif" fontWeight="700" fontSize="22"
            fill="#7a4f00" opacity="0.9">G</text>
          <text x="340" y="215" textAnchor="middle"
            fontFamily="Georgia, serif" fontSize="6" fontWeight="600"
            fill="#7a4f00" opacity="0.7" letterSpacing="1">GOBLIN</text>
          {/* Shine highlight */}
          <ellipse className="cl-shine" cx="325" cy="186" rx="10" ry="5"
            fill="#fffbe0" opacity="0" transform="rotate(-30,325,186)" />
        </g>

        {/* Rim outline */}
        <ellipse className="cl-body" cx="340" cy="200" rx="38" ry="38"
          fill="none" stroke="#ffe066" strokeWidth="1.5" opacity="0.5" />
        <ellipse className="cl-body" cx="340" cy="200" rx="36" ry="36"
          fill="none" stroke="#c49a00" strokeWidth="0.5" opacity="0.4" />
      </svg>

      {label && (
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: '#9b8ec4', fontFamily: 'var(--font-sans)' }}
          >
            {label}
          </span>
          <svg width="24" height="12" viewBox="0 0 24 12">
            <circle cx="4"  cy="6" r="2.5" fill="#ffc93c" className="cl-d1" />
            <circle cx="12" cy="6" r="2.5" fill="#ffc93c" opacity="0.4" className="cl-d2" />
            <circle cx="20" cy="6" r="2.5" fill="#ffc93c" opacity="0.4" className="cl-d3" />
          </svg>
        </div>
      )}
    </div>
  )
}
