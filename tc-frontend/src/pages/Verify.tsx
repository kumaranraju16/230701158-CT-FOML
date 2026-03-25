import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, XCircle, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustScoreGauge from "@/components/TrustScoreGauge";
import { useState, useEffect } from "react";
import { getCertificate } from "@/lib/api";

const VerifyPage = () => {
  const { certId } = useParams();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCert = async () => {
      if (!certId) return;
      try {
        setLoading(true);
        const data = await getCertificate(certId);
        if (data.error) {
          setError(data.error);
        } else {
          setCert(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch certificate verification");
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [certId]);

  const statusConfig = cert
    ? cert.risk_level === "LOW"
      ? { icon: CheckCircle, label: "VERIFIED AUTHENTIC", color: "text-success", bg: "bg-success/5 border-success/20", glow: "glow-accent" }
      : cert.risk_level === "HIGH"
      ? { icon: AlertTriangle, label: "HIGH RISK FLAGS", color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", glow: "glow-destructive" }
      : { icon: CheckCircle, label: "PENDING REVIEW", color: "text-accent", bg: "bg-accent/5 border-accent/20", glow: "" }
    : { icon: XCircle, label: error === "Certificate not found" ? "RECORD NOT FOUND" : "SCAN FAIL", color: "text-muted-foreground", bg: "bg-muted/50 border-border", glow: "" };


  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-background mastery-grid">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              QR Verification Portal
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Certificate Verification
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className={`surface-card rounded-lg border ${statusConfig.bg} p-8 ${statusConfig.glow}`}
          >
            <div className="flex flex-col items-center gap-6">
              {loading ? (
                <Search className="w-16 h-16 text-primary animate-pulse" />
              ) : (
                <StatusIcon className={`w-16 h-16 ${statusConfig.color}`} />
              )}
              <div className="text-center">
                <p className={`font-display text-2xl font-bold ${statusConfig.color}`}>
                  {loading ? "SCANNING NEURAL NETWORK..." : statusConfig.label}
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                   Certificate ID: {certId ? `${certId.substring(0, 4)}****` : "N/A"}
                </p>
              </div>

              {cert && (
                <div className="w-full space-y-6">
                  <div className="w-full border-t border-border/30 pt-6 space-y-3">
                    {[
                      { label: "Subject Name", value: cert.name || "N/A" },
                      { label: "Institution", value: cert.institution },
                      { label: "Course Name", value: cert.course || "N/A" },
                      { label: "Final Score", value: cert.marks ? `${cert.marks}/100` : "N/A" },
                      { label: "Trust Score", value: `${cert.trust_score}/100` },
                      { label: "Risk Level", value: cert.risk_level },
                      { label: "Verification Date", value: new Date(cert.timestamp).toLocaleDateString() },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="font-mono text-sm text-foreground uppercase">{item.value}</span>
                      </div>
                    ))}
                    {/* Forensic hash hidden for system integrity */}
                  </div>

                  <div className="w-full border-t border-border/30 pt-4">
                    <div className="flex items-center gap-2 justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Verified by CertiTrust AI Engine v4.0
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!cert && !loading && (
                <p className="text-sm text-muted-foreground text-center">
                  This certificate ID is not registered in the CertiTrust database.
                  The document may not have been verified or may be fraudulent.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyPage;
