export default function BrandMark({ size = 40, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="awOrbitGradient" x1="8" y1="10" x2="57" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="0.52" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
          <radialGradient id="awCoreGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(23 18) rotate(47) scale(42)">
            <stop stopColor="#1B2235" />
            <stop offset="1" stopColor="#090C15" />
          </radialGradient>
          <filter id="awGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="32" cy="32" r="25" fill="url(#awCoreGradient)" stroke="rgba(255,255,255,.09)" strokeWidth="1.4" />
        <ellipse cx="32" cy="32" rx="29" ry="13.5" transform="rotate(-24 32 32)" stroke="url(#awOrbitGradient)" strokeWidth="2" opacity="0.8" />
        <circle cx="54.2" cy="18.9" r="2.7" fill="#67E8F9" filter="url(#awGlow)" />

        <path d="M18 43.5c3.8-5.6 8.6-8.4 14-8.4s10.2 2.8 14 8.4" stroke="#F8FAFC" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M22.2 44h19.6" stroke="#F8FAFC" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M32 35.2V44" stroke="#F8FAFC" strokeWidth="2.4" strokeLinecap="round" />
        <path d="m27.8 33 10.8-8.1 3 4-10.7 8" stroke="url(#awOrbitGradient)" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m38.2 25.5-2.1-2.9" stroke="#C4B5FD" strokeWidth="2.3" strokeLinecap="round" />
        <circle cx="19.1" cy="21.4" r="1.35" fill="#FBBF24" opacity="0.95" />
      </svg>
    </div>
  );
}
