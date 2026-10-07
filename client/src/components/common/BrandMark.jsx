export default function BrandMark({ size = 40, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-violet-600 shadow-lg shadow-primary-900/20 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-[72%] w-[72%]" fill="none">
        <path
          d="M10 31.5C14.1 26.6 18.8 24 24 24s9.9 2.6 14 7.5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path d="M15.5 32h17" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M24 24v8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M20 22.5 31.8 14l2.6 3.6L22.7 26"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m30.5 14.9-1.9-2.7" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M11.8 19.5c3.4-6.4 10.2-10.7 18-10.7 2.5 0 4.9.5 7.1 1.4"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="10.4" cy="21.8" r="1.9" fill="white" opacity="0.95" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.28),transparent_32%)]" />
    </div>
  );
}
