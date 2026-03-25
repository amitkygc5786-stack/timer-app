interface CircularProgressProps {
  progress: number; // 0 to 1
  isAlarming: boolean;
  isPreAlert?: boolean;
  isPulsing?: boolean;
  isRestPhase?: boolean;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  progress,
  isAlarming,
  isPreAlert = false,
  isPulsing = false,
  isRestPhase = false,
  size = 260,
  strokeWidth = 11,
}: CircularProgressProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * Math.max(0, Math.min(1, progress));
  const gap = circumference - dash;

  const ringColor = isAlarming
    ? "oklch(0.63 0.24 32)"
    : isPreAlert
      ? "oklch(0.88 0.18 80)"
      : isRestPhase
        ? "oklch(0.63 0.24 32)"
        : "oklch(0.93 0.3 155)";
  const glowColor = isAlarming
    ? "oklch(0.65 0.22 25 / 0.65)"
    : isPreAlert
      ? "oklch(0.88 0.18 80 / 0.6)"
      : isRestPhase
        ? "oklch(0.6 0.2 15 / 0.55)"
        : "oklch(0.93 0.3 155 / 0.65)";
  const trackColor = "oklch(0.2 0.007 230)";
  const glowBlur = isAlarming ? "6" : isPreAlert ? "5" : "7";
  const glowWidth = strokeWidth + 8;

  // Shimmer dot at the leading edge of the ring
  const dotDash = 4;
  const dotOffset = -(dash - 2);

  return (
    <div
      style={{
        filter:
          isRestPhase && !isAlarming
            ? "drop-shadow(0 0 8px oklch(0.6 0.2 15 / 0.5))"
            : "drop-shadow(0 0 8px oklch(0.93 0.3 155 / 0.4))",
        animation:
          isRestPhase && !isAlarming
            ? "restPulse 2s ease-in-out infinite"
            : undefined,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: "rotate(-90deg)",
          transition: "transform 0.2s ease",
          ...(isPulsing
            ? { animation: "ringCountdownPulse 0.2s ease-out forwards" }
            : {}),
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={glowBlur} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="ring-glow-strong"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="10" result="blur1" />
            <feGaussianBlur
              stdDeviation="4"
              result="blur2"
              in="SourceGraphic"
            />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Wide glow layer */}
        {progress > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={glowColor}
            strokeWidth={glowWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            filter="url(#ring-glow-strong)"
            style={{
              transition:
                "stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease",
            }}
          />
        )}

        {/* Main ring */}
        {progress > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            filter="url(#ring-glow)"
            style={{
              transition:
                "stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease",
            }}
          />
        )}

        {/* Shimmer dot at leading edge */}
        {progress > 0.01 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="oklch(1 0 0 / 0.85)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${dotDash} ${circumference - dotDash}`}
            strokeDashoffset={dotOffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        )}
      </svg>
    </div>
  );
}
