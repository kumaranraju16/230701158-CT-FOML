import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { quickVerifyFile } from "@/lib/api";
import { toast } from "sonner";
import {
  Shield,
  ScanLine,
  Brain,
  Network,
  FileCheck,
  QrCode,
  ArrowRight,
  Lock,
  Eye,
  BarChart3,
  UploadCloud,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as const } },
};

const pipelineSteps = [
  { icon: ScanLine, label: "OCR Extraction", id: "01" },
  { icon: Brain, label: "AI Forensic Analysis", id: "02" },
  { icon: Shield, label: "Institution Validation", id: "03" },
  { icon: Network, label: "Graph Trust Network", id: "04" },
  { icon: BarChart3, label: "ML Risk Scoring", id: "05" },
  { icon: QrCode, label: "Seal Generation", id: "06" },
];

const features = [
  {
    icon: Eye,
    title: "AI Document Forensics",
    desc: "Neural analysis detects pixel anomalies, font inconsistencies, and metadata tampering across 421 separate document layers.",
  },
  {
    icon: Shield,
    title: "Institution Intelligence",
    desc: "Probabilistic matching against 40,000+ institutional records from global accreditation databases and government registries.",
  },
  {
    icon: Network,
    title: "Graph Trust Network",
    desc: "Cross-reference across distributed trust nodes. Detect suspicious clusters and abnormal certificate issuance patterns.",
  },
  {
    icon: QrCode,
    title: "Secure Verification Seal",
    desc: "Cryptographic QR seal with SHA-256 hash. Tamper-resistant, machine-readable, embedded directly into certificate.",
  },
  {
    icon: FileCheck,
    title: "Forensic Audit Reports",
    desc: "Complete verification audit trail with granular event logs, model explanations, and institutional fingerprint analysis.",
  },
  {
    icon: Lock,
    title: "Instant QR Verification",
    desc: "Scan any CertiTrust seal for real-time verification. Hash mismatch detection flags post-verification tampering.",
  },
];

const Index = () => {
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const handleHeroScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScanning(true);
      const res = await quickVerifyFile(file);
      
      if (res.status === "success") {
        toast.success("Identity Verified", {
            description: `Validating record for ${res.cert.name}`
        });
        navigate("/quick-verify-result", { state: { status: "success", cert: res.cert } });
      } else if (res.status === "no_qr") {
        navigate("/quick-verify-result", { state: { status: "no_qr" } });
      } else {
        navigate("/quick-verify-result", { state: { status: "invalid_qr", message: res.message } });
      }
    } catch (err) {
      toast.error("System Error", {
          description: "Could not connect to verification nodes."
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden mastery-grid mastery-vignette">
        {/* Background neural watermark - Large and Bold */}
        <div className="absolute top-24 left-0 w-full text-center pointer-events-none select-none z-0" style={{ opacity: 'var(--watermark-opacity)' }}>
           <h1 className="text-[14rem] font-bold tracking-tighter leading-none text-foreground">NEURAL<br/>VERIFICATION</h1>
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_91%_50%/var(--mesh-opacity))_0%,_transparent_75%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Visual Centerpiece (Large Circle with Icon) */}
            <motion.div 
               variants={fadeUp}
               className="relative mb-16"
            >
               <div className="w-56 h-56 rounded-full bg-[#050910]/80 border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-2xl backdrop-blur-sm">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                  <UploadCloud className="w-20 h-20 text-primary relative z-10" />
                  {/* Subtle pulse */}
                  <div className="absolute inset-0 border border-primary/30 rounded-full animate-pulse" />
               </div>
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-[#050910] border border-primary/30 rounded-full shadow-2xl glow-primary">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary whitespace-nowrap font-bold">Node: Active</span>
               </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[0.9] mb-8"
            >
              Quantifying
              <br />
              <span className="text-primary italic">Credibility.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground/80 max-w-2xl mb-12 font-light"
            >
              Forensic-grade verification for the modern academic infrastructure.
              AI-driven trust scoring from document analysis to cryptographic proof.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="font-mono text-xs text-muted-foreground/60 mb-10"
            >
              Integrity Hash: <span className="text-primary/80">71c7...b976f</span> | Match:{" "}
              <span className="text-success">99.98%</span>
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-center gap-6 w-full max-w-xl">
              <Link
                to="/upload"
                className="w-full md:flex-1 px-10 py-5 bg-primary text-primary-foreground font-mono text-base uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all glow-primary text-center font-bold"
              >
                Upload Certificate
              </Link>
              
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:flex-1">
                <input 
                  type="file" 
                  id="hero-scan-input" 
                  className="hidden" 
                  accept="application/pdf,image/*"
                  onChange={handleHeroScan}
                />
                <button 
                  onClick={() => document.getElementById('hero-scan-input')?.click()}
                  disabled={scanning}
                  className="w-full md:flex-1 flex items-center justify-center gap-3 px-10 py-5 bg-[#0D6CF2]/10 text-primary font-mono text-base uppercase tracking-widest rounded-xl hover:bg-[#0D6CF2]/20 active:scale-[0.98] transition-all border border-primary/30 font-bold"
                >
                  <ScanLine className={`w-5 h-5 ${scanning ? 'animate-pulse' : ''}`} />
                  {scanning ? 'Decoding...' : 'Quick Check'}
                </button>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Verification Pipeline
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              How CertiTrust Works
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {pipelineSteps.map((step) => (
              <motion.div
                key={step.id}
                variants={fadeUp}
                className="pipeline-node surface-card-hover flex flex-col items-center text-center gap-3 p-6"
              >
                <span className="font-mono text-[10px] text-primary tracking-widest">
                  {step.id} // {step.id === "01" ? "INGEST" : step.id === "06" ? "OUTPUT" : "PROCESS"}
                </span>
                <step.icon className="w-6 h-6 text-accent" />
                <span className="font-display text-sm font-semibold text-foreground">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span>Certificate In</span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>Trust Score + Verified PDF Out</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score Range */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Scoring Model
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Trust Score Classification
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4"
          >
            {[
              { range: "71 – 100", level: "LOW RISK", color: "text-success", border: "border-success/20 bg-success/5" },
              { range: "41 – 70", level: "MEDIUM RISK", color: "text-warning", border: "border-warning/20 bg-warning/5" },
              { range: "0 – 40", level: "HIGH RISK", color: "text-destructive", border: "border-destructive/20 bg-destructive/5" },
            ].map((item) => (
              <motion.div
                key={item.level}
                variants={fadeUp}
                className={`surface-card p-6 border ${item.border} rounded-lg`}
              >
                <span className={`font-display text-4xl font-bold ${item.color}`}>
                  {item.range}
                </span>
                <p className={`font-mono text-xs uppercase tracking-widest mt-2 ${item.color}`}>
                  {item.level}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              System Features
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Verification Modules
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="surface-card surface-card-hover p-6 border border-border/30 rounded-lg"
              >
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Initialize Session
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-4 mb-8">
              Ready for Truth?
            </h2>
            <Link
              to="/upload"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-[0.97] transition-all glow-primary"
            >
              Begin Analysis
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
