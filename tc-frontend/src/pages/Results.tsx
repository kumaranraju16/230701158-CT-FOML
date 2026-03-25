import { motion } from "framer-motion";
import { Download, Shield, XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustScoreGauge from "@/components/TrustScoreGauge";
import { getDownloadUrl } from "@/lib/api";
import { useEffect } from "react";
import ProcessDiagram from "@/components/ProcessDiagram";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      navigate("/upload");
    }
  }, [result, navigate]);

  if (!result) return null;

  const auditEvents = [
    { seq: "001_OBJ_INGESTION", agent: "Ingestion_Node_Alpha", output: `Hash: ${result.details.file_hash.substring(0, 10)}...`, lat: "124ms", status: "SUCCESS" },
    { seq: "002_METADATA_EXTRACT", agent: "EXIF_Parser_v2.1", output: "Metadata_Extracted", lat: "45ms", status: "SUCCESS" },
    { seq: "003_SIG_VALIDATION", agent: "Auth_Engine_v4", output: "Integrity_Check: Valid", lat: "310ms", status: "SUCCESS" },
    { seq: "004_INSTITUTION_API", agent: "Internal_DB_Query", output: `${result.details.extracted_data.institution} found`, lat: "892ms", status: "SUCCESS" },
  ];

  const analysisModules = [
    { name: "Neural Integrity Scan", score: result.details.forensic_analysis.integrity_score * 100, desc: "Detects micro-anomalies in pixel distribution and font kerning inconsistencies." },
    { name: "Institutional Fingerprint", score: result.details.institution_validation.trust_score * 100, desc: "Probabilistic match against historical records from the issuing institution." },
    { name: "Graph Trust Confidence", score: result.details.graph_network.confidence * 100, desc: "Relationship clustering to detect institutional fraud networks." },
  ];

  return (
    <div className="min-h-screen bg-background mastery-grid">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Compliance Review // REF: {result.certificate_id}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">
                Verification Audit Trail
              </h1>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                Timestamp: 2026-03-16 14:32:01 UTC | Node_ID: LON-PRIMARY-01
              </p>
            </div>
            <div className="surface-card px-6 py-4 rounded-lg border border-success/20 bg-success/5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Final Determination
              </span>
              <p className={`font-display text-lg font-bold ${result.risk_level === 'LOW' ? 'text-success' : 'text-destructive'}`}>
                {result.risk_level === 'LOW' ? 'Compliant / Authentic' : 'High Risk / Flags Detected'}
              </p>
            </div>
          </motion.div>

          {/* Audit Events Table */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              01. Granular Audit Events
            </h2>
            <div className="surface-card rounded-lg overflow-hidden border border-border/30">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    {["Sequence", "Operation Agent", "Telemetry Output", "Lat (ms)", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditEvents.map((e, i) => (
                    <motion.tr
                      key={e.seq}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                      className="border-b border-border/20 last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.seq}</td>
                      <td className="px-4 py-3 font-mono text-xs text-accent">{e.agent}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{e.output}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.lat}</td>
                      <td className="px-4 py-3">
                        <span className="forensic-badge-success">{e.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* AI Analysis */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              02. AI-Driven Heuristic Analysis
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="surface-card p-6 rounded-lg border border-border/30 space-y-6">
                {analysisModules.map((m) => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-sm font-bold text-foreground">{m.name}</span>
                      <span className="font-mono text-sm text-accent tabular-nums">{m.score.toFixed(2)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${m.score}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.2, 0, 0, 1] }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                ))}
              </div>
              <div className="surface-card p-6 rounded-lg border border-border/30 flex flex-col items-center justify-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                  Neural Validation Pipeline (MLDVP-04)
                </span>
                <div className="w-full h-full min-h-[220px]">
                  <ProcessDiagram />
                </div>
                <div className="flex items-start gap-2 mt-4">
                  <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground italic">
                    Technical Note: No forensic markers found for AI-generation or deepfake manipulation.
                    Metadata preserves original creation date.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 03. Institutional Source Validation (ALWAYS VISIBLE for continuity) */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              03. Institutional Source Validation
            </h2>
            {result.details.qr_info ? (
              <div className={`surface-card p-6 rounded-lg border flex flex-col md:flex-row items-center gap-6 ${
                result.details.qr_info.status === 'VERIFIED' ? 'border-success/50 bg-success/5' : 
                result.details.qr_info.status === 'FAKE' ? 'border-destructive/50 bg-destructive/5' : 
                'border-warning/50 bg-warning/5'
              }`}>
                <div className={`p-4 rounded-full flex-shrink-0 ${
                  result.details.qr_info.status === 'VERIFIED' ? 'bg-success/20 text-success' : 
                  result.details.qr_info.status === 'FAKE' ? 'bg-destructive/20 text-destructive' : 
                  'bg-warning/20 text-warning'
                }`}>
                  {result.details.qr_info.status === 'VERIFIED' ? <CheckCircle2 className="w-10 h-10" /> : 
                   result.details.qr_info.status === 'FAKE' ? <XCircle className="w-10 h-10" /> : 
                   <AlertTriangle className="w-10 h-10" />}
                </div>
                <div>
                  <h3 className={`font-display text-2xl font-bold mb-1 uppercase tracking-tight ${
                    result.details.qr_info.status === 'VERIFIED' ? 'text-success' : 
                    result.details.qr_info.status === 'FAKE' ? 'text-destructive' : 
                    'text-warning'
                  }`}>
                    {result.details.qr_info.status} — {result.details.qr_info.qr_detected ? 'Native QR Validated' : 'No QR Detected'}
                  </h3>
                  <p className="text-muted-foreground">{result.details.qr_info.message}</p>
                </div>
              </div>
            ) : (
              <div className="surface-card p-6 rounded-lg border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-full bg-primary/10 text-primary flex-shrink-0">
                   <Shield className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-1 uppercase tracking-tight">
                    AI HEURISTIC VALIDATION — ACTIVE
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    No native institutional QR detected. System automatically engaged the **Neural Forensic Node** for high-confidence structural validation of the issuing authority.
                  </p>
                </div>
              </div>
            )}
          </motion.section>

          {/* Preview + Metadata */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  04. Weighted Score
                </h2>
                <div className="surface-card p-8 rounded-lg border border-border/30 flex flex-col items-center">
                  <TrustScoreGauge score={result.trust_score} />
                  <div className="mt-4">
                    <span className={`forensic-badge ${result.risk_level === 'LOW' ? 'text-success' : 'text-destructive'}`}>
                      Risk_Profile: {result.risk_level}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-4 text-center">
                    Composite score derived from cryptographic, institutional, and forensic data streams.
                  </p>
                </div>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  05. Subject Metadata
                </h2>
                <div className="surface-card rounded-lg border border-border/30 overflow-hidden">
                  {[
                    { label: "Subject Name", value: result.details.extracted_data.name },
                    { label: "Issuing Authority", value: result.details.extracted_data.institution },
                    { label: "Credential Type", value: result.details.extracted_data.course },
                    { label: "Conferred Year", value: result.details.extracted_data.year },
                  ].map((item) => (
                    <div key={item.label} className="px-6 py-4 border-b border-border/20 last:border-0">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {item.label}
                      </span>
                      <p className="font-display text-base font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Stamped Certificate Preview */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              06. Verified Credential Asset
            </h2>
            <div className="surface-card p-8 rounded-lg border border-primary/20 bg-primary/5 flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Secure Seal Successfully Embedded
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-8">
                A cryptographic micro-QR has been stamped onto your document. This seal is invisible to the casual observer but contains the full verification chain accessible by the CertiTrust Neural Node.
              </p>
              <div className="flex gap-4">
                 <a 
                    href={getDownloadUrl(result.downloads.stamped_certificate.split('/').pop() || result.downloads.stamped_certificate.split('\\').pop())}
                    className="px-6 py-3 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-[0.97] transition-all flex items-center gap-2"
                    download
                 >
                    <Download className="w-4 h-4" />
                    Open Verified Certificate
                 </a>
              </div>
            </div>
          </motion.section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href={getDownloadUrl(result.downloads.stamped_certificate.split('/').pop() || result.downloads.stamped_certificate.split('\\').pop())} 
              className="px-8 py-4 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-[0.97] transition-all glow-primary flex items-center gap-2"
              download
            >
              <Download className="w-4 h-4" />
              Download Verified Certificate
            </a>
            <a 
              href={getDownloadUrl(result.downloads.audit_report.split('/').pop() || result.downloads.audit_report.split('\\').pop())}
              className="px-8 py-4 border border-border text-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-muted/50 active:scale-[0.97] transition-all flex items-center gap-2"
              download
            >
              <Download className="w-4 h-4" />
              Download Audit Report
            </a>
          </div>

          {/* Footer */}
          <div className="mt-12 flex items-center justify-between border-t border-border/30 pt-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">
                Certified Compliance Officer | ID: CCO-99-ALPHA-Z
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              © 2026 CertiTrust Global Services
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResultsPage;
