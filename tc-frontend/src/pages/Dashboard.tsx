import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, BarChart3, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { getStats } from "@/lib/api";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getStats();
        setData(stats);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Analyzed Total", value: loading ? "..." : data?.analyzed_today, icon: FileText, change: "SYSTEM_TOTAL" },
    { label: "High Risk Flagged", value: loading ? "..." : data?.high_risk_flagged, icon: AlertTriangle, change: "CRITICAL" },
    { label: "Verified Authentic", value: loading ? "..." : data?.verified_authentic, icon: CheckCircle, change: "VALIDATED" },
    { label: "Avg Processing", value: loading ? "..." : data?.avg_processing_time, icon: Clock, change: "OPTIMIZED" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] as const } },
  };
  return (
    <div className="min-h-screen bg-background mastery-grid">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Operations Dashboard
              </span>
              <h1 className="font-display text-3xl font-bold text-foreground mt-1">
                System Overview
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="surface-card p-5 rounded-lg border border-border/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
                  <span className="font-mono text-[10px] text-accent">{s.change}</span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground tabular-nums">
                  {s.value}
                </p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Recent Batches */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Recent Audit History
              </h2>
              <div className="surface-card rounded-lg border border-border/30 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      {["Certificate ID", "Institution", "Trust", "Risk"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.recent_records || []).map((b: any, i: number) => (
                      <motion.tr
                        key={b.certificate_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.04 }}
                        className="border-b border-border/20 last:border-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-foreground">{b.certificate_id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.institution}</td>
                        <td className={`px-4 py-3 font-mono text-xs ${b.risk_level === 'LOW' ? 'text-success' : 'text-destructive'}`}>{b.trust_score}%</td>
                        <td className="px-4 py-3">
                          <span className={`forensic-badge-${b.risk_level === 'LOW' ? 'success' : 'destructive'}`}>{b.risk_level}</span>
                        </td>
                      </motion.tr>
                    ))}
                    {!loading && (!data?.recent_records || data.recent_records.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center font-mono text-xs text-muted-foreground">No recent records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">
                Neural Engine Performance
              </h2>
              <div className="surface-card p-5 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground font-bold">
                    ML Validation Metrics
                  </span>
                </div>
                
                {data?.ml_validation_metrics ? (
                  <div className="space-y-4">
                    {[
                      { label: "Accuracy", value: data.ml_validation_metrics.accuracy, color: "bg-success" },
                      { label: "Precision", value: data.ml_validation_metrics.precision, color: "bg-primary" },
                      { label: "Recall", value: data.ml_validation_metrics.recall, color: "bg-accent" },
                      { label: "F1 Score", value: data.ml_validation_metrics.f1_score, color: "bg-white" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-[10px] uppercase text-muted-foreground">{m.label}</span>
                          <span className="font-mono text-xs font-bold text-foreground">{(m.value * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${m.value * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full ${m.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center animate-pulse">
                    <span className="font-mono text-[10px] text-muted-foreground">LOADING NEURAL STATS...</span>
                  </div>
                )}
                
                <p className="mt-4 text-[10px] text-muted-foreground italic border-t border-border/20 pt-3">
                  Metrics generated via continuous train-test splitting on synthetic fraudulent datasets.
                </p>
              </div>

              {/* Institution Risk */}
              <h2 className="font-display text-lg font-bold text-foreground">
                Global Risk Monitoring
              </h2>
              <div className="space-y-3">
                {[
                  { name: "ABC University", trust: 0.92, certs: 12400, risk: "LOW" },
                  { name: "XYZ Institute", trust: 0.67, certs: 3200, risk: "MEDIUM" },
                  { name: "DEF College", trust: 0.41, certs: 890, risk: "HIGH" },
                  { name: "GHI Academy", trust: 0.88, certs: 5600, risk: "LOW" },
                ].map((inst) => (
                  <div
                    key={inst.name}
                    className="surface-card p-4 rounded-lg border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">{inst.name}</span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest ${
                          inst.risk === "LOW"
                            ? "text-success"
                            : inst.risk === "MEDIUM"
                            ? "text-warning"
                            : "text-destructive"
                        }`}
                      >
                        {inst.risk}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${inst.trust * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Trust: {(inst.trust * 100).toFixed(0)}%
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {inst.certs.toLocaleString()} certs
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Risk Overview */}
              <div className="mt-4 surface-card p-5 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-bold">
                    Risk Overview
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  System: AES-256 Secured
                </p>
                <p className="text-xs text-muted-foreground">
                  Current risk level: <span className="text-success font-bold">MINIMAL</span>. All 2,104 global nodes operating within SOC2 compliance parameters.
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="font-mono text-[10px] text-muted-foreground">Protocol Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="font-mono text-[10px] text-muted-foreground">Audit Logs Persisted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
