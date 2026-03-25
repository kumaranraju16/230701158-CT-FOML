import { motion } from "framer-motion";

interface TrustScoreGaugeProps {
  score: number;
  size?: "sm" | "lg";
}

const TrustScoreGauge = ({ score, size = "lg" }: TrustScoreGaugeProps) => {
  const riskLevel = score >= 71 ? "LOW" : score >= 41 ? "MEDIUM" : "HIGH";
  const riskColor =
    score >= 71
      ? "text-success"
      : score >= 41
      ? "text-warning"
      : "text-destructive";

  const isLarge = size === "lg";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg
          viewBox="0 0 120 70"
          className={isLarge ? "w-48 h-28" : "w-32 h-20"}
        >
          {/* Background arc */}
          <path
            d="M 10 65 A 50 50 0 0 1 110 65"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d="M 10 65 A 50 50 0 0 1 110 65"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="157"
            initial={{ strokeDashoffset: 157 }}
            animate={{ strokeDashoffset: 157 - (157 * score) / 100 }}
            transition={{ duration: 1.5, ease: [0.2, 0, 0, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <motion.span
            className={`font-display font-bold tracking-tighter text-foreground ${
              isLarge ? "text-5xl" : "text-3xl"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Trust Score
        </span>
        <span
          className={`font-mono text-xs font-bold uppercase tracking-widest ${riskColor}`}
        >
          Risk: {riskLevel}
        </span>
      </div>
    </div>
  );
};

export default TrustScoreGauge;
