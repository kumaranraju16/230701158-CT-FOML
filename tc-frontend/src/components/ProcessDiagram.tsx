import { motion } from "framer-motion";
import { Database, FileText, Fingerprint, ShieldCheck } from "lucide-react";

const ProcessDiagram = () => {
  const steps = [
    { id: "ingest", icon: <FileText className="w-5 h-5" />, label: "Ingestion", x: 20, y: 50 },
    { id: "analyze", icon: <Fingerprint className="w-5 h-5" />, label: "Analysis", x: 40, y: 30 },
    { id: "ledger", icon: <Database className="w-5 h-5" />, label: "Ledger", x: 60, y: 70 },
    { id: "seal", icon: <ShieldCheck className="w-5 h-5" />, label: "Seal", x: 80, y: 50 },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ];

  return (
    <div className="relative w-full h-full min-h-[180px] flex items-center justify-center overflow-hidden bg-muted/20 rounded-xl border border-border/10">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" opacity="0.5" />
          </marker>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {connections.map((conn, i) => {
          const from = steps[conn.from];
          const to = steps[conn.to];
          return (
            <motion.line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity, repeatDelay: 1 }}
            />
          );
        })}
      </svg>

      <div className="relative w-full h-full flex items-center justify-between px-[10%] z-10">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.3 }}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center text-primary shadow-lg shadow-primary/5 group-hover:glow-primary transition-all duration-300">
              {step.icon}
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/10">
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
      
      {/* Background pulses */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="absolute bottom-2 right-4 flex items-center gap-2 opacity-30">
         <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
         <span className="font-mono text-[6px] uppercase tracking-tighter">Real-time Node Status: SYNCED</span>
      </div>
    </div>
  );
};

export default ProcessDiagram;
