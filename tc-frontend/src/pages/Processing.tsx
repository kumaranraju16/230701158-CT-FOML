import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, RefreshCcw, CheckCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { uploadCertificate } from "@/lib/api";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state?.file as File | undefined;
  
  const [visibleLogs, setVisibleLogs] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [stampedData, setStampedData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialLogs = [
    { time: new Date().toLocaleTimeString(), type: "INIT", msg: "Initializing CertiTrust core validation module...", color: "text-muted-foreground" },
    { time: new Date().toLocaleTimeString(), type: "INFO", msg: "Loading AI trust models version 4.2.1-stable", color: "text-muted-foreground" },
    { time: new Date().toLocaleTimeString(), type: "SUCCESS", msg: `Ingesting source document: ${file?.name || "unnamed_input.pdf"}`, color: "text-success" },
    { time: new Date().toLocaleTimeString(), type: "INFO", msg: "Allocating neural processing pipeline nodes...", color: "text-muted-foreground" },
  ];

  useEffect(() => {
    if (!file) {
      navigate("/upload");
      return;
    }

    let isMounted = true;
    
    const runAnalysis = async (force: boolean = false) => {
      // Add initial logs
      if (!force) {
          for(let i=0; i<initialLogs.length; i++) {
              if(!isMounted) return;
              setVisibleLogs(prev => [...prev, initialLogs[i]]);
              setProgress((i+1) * 10);
              await new Promise(r => setTimeout(r, 800));
          }
      }

      try {
        setVisibleLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "PROCESSING", msg: force ? "Bypassing existing seal. Running forensic OCR..." : "Running forensic OCR and metadata extraction...", color: "text-primary" }]);
        setProgress(50);
        
        const result = await uploadCertificate(file, force);
        
        if(!isMounted) return;

        // --- NEW: Zonal Hunt Intercept (Detect Existing CertiTrust QR) ---
        if (result.status === "already_stamped" && !force) {
            setStampedData(result.cert_data);
            setShowModal(true);
            return; // Pause UI execution loops
        }

        // GAP 5: Backend Intercept Errors
        // If OCR completely fails or the file is garbage, backend returns status: error.
        if (result.status === "error" || result.status === "invalid_qr") {
            setErrorMessage(result.message || "Validation aborted. Document format unsupported.");
            setShowErrorModal(true);
            return; // Exit analysis loop early
        }

        setShowModal(false);

        const resultsLogs: any[] = [
          { time: new Date().toLocaleTimeString(), type: "SUCCESS", msg: "Scanning certificate... OCR Extraction complete.", color: "text-success" },
          { time: new Date().toLocaleTimeString(), type: "INFO", msg: `Detected Institution: ${result.details?.extracted_data?.institution || "Unknown"}`, color: "text-muted-foreground" },
          { time: new Date().toLocaleTimeString(), type: "INFO", msg: "Detecting QR...", color: "text-primary" },
        ];

        if (result.details?.qr_info?.qr_detected) {
            resultsLogs.push({ time: new Date().toLocaleTimeString(), type: "PROCESSING", msg: "Validating NPTEL database...", color: "text-primary" });
            if (result.details?.qr_info?.status === 'VERIFIED') {
                resultsLogs.push({ time: new Date().toLocaleTimeString(), type: "SUCCESS", msg: "Native NPTEL QR Verified.", color: "text-success" });
            } else {
                resultsLogs.push({ time: new Date().toLocaleTimeString(), type: "WARN", msg: "Warning: QR Data Mismatch or Invalid Domain.", color: "text-destructive" });
            }
        } else {
            resultsLogs.push({ time: new Date().toLocaleTimeString(), type: "WARN", msg: "No native QR detected. Proceeding with AI verification...", color: "text-warning" });
        }

        resultsLogs.push(
          { time: new Date().toLocaleTimeString(), type: "PROCESSING", msg: "Executing Graph Trust & ML Modeling...", color: "text-primary" },
          { time: new Date().toLocaleTimeString(), type: "SUCCESS", msg: `Analysis complete. Final Score: ${result.trust_score}%`, color: "text-success" },
          { time: new Date().toLocaleTimeString(), type: "INFO", msg: "Generating final audit report and verification seal...", color: "text-muted-foreground" }
        );

        for(let i=0; i<resultsLogs.length; i++) {
            if(!isMounted) return;
            setVisibleLogs(prev => [...prev, resultsLogs[i]]);
            setProgress(50 + ((i+1) * 10));
            await new Promise(r => setTimeout(r, 600));
        }

        setProgress(100);
        setComplete(true);
        setTimeout(() => {
          if(isMounted) navigate("/results", { state: { result } });
        }, 1500);

      } catch (error: any) {
        if(!isMounted) return;
        setVisibleLogs(prev => [...prev, { 
            time: new Date().toLocaleTimeString(), 
            type: "ERROR", 
            msg: `Process halted: ${error.message || "Critical validation failure."}`, 
            color: "text-destructive" 
        }]);
        setProgress(100);
      }
    };

    // Bind the execution loop to window to easily invoke bypass
    (window as any)._runAnalysisBound = runAnalysis;
    runAnalysis();

    return () => { 
        isMounted = false; 
        delete (window as any)._runAnalysisBound;
    };
  }, [file, navigate]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <div className="min-h-screen bg-background mastery-grid">
      <Navbar />
      <div className="pt-20">
        {/* Header bar */}
        <div className="border-b border-border/50 bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Process Status
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Analyzing Certificate...
              </h1>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Completion
              </span>
              <p className="font-mono text-4xl font-bold text-foreground tabular-nums">
                {progress.toFixed(1)}%
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Terminal */}
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="terminal-window overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                root@certitrust:~/analysis
              </span>
              <div />
            </div>

            <div ref={containerRef} className="p-6 h-[500px] overflow-y-auto">
              {visibleLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`font-mono text-sm leading-7 ${log.type === "CRITICAL_NOTIFICATION" ? "border-l-2 border-primary pl-4 py-2 my-2 text-foreground font-bold" : ""}`}
                >
                  <span className="text-muted-foreground/50">[{log.time}]</span>{" "}
                  <span className={log.type === "SUCCESS" ? "text-success" : log.type === "PROCESSING" ? "text-primary" : log.type === "CRITICAL_NOTIFICATION" ? "text-foreground" : log.type === "WARN" ? "text-warning" : "text-muted-foreground"}>
                    [{log.type}]
                  </span>{" "}
                  <span className={log.type === "STDOUT" ? "text-muted-foreground/60" : log.type === "SUCCESS" ? "text-success" : log.type === "PROCESSING" ? "text-primary" : log.type === "CRITICAL_NOTIFICATION" ? "text-foreground font-bold" : log.type === "WARN" ? "text-warning" : "text-muted-foreground"}>
                    {log.msg}
                  </span>
                </motion.div>
              ))}
              {progress < 100 && !showModal && (
                <span className="font-mono text-sm text-muted-foreground/40">
                  – Waiting for I/O response...<span className="animate-pulse">█</span>
                </span>
              )}
              {complete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 font-mono text-sm text-success"
                >
                  ✓ Analysis complete. Redirecting to results...
                </motion.div>
              )}
            </div>
          </div>

          {/* System stats footer */}
          <div className="flex items-center justify-between mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            <div className="flex gap-6">
              <span>CPU: 42%</span>
              <span>MEM: 1.2GB/16GB</span>
              <span>NET: 450Mbps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wrong/Blank PDF Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card border border-destructive/30 rounded-xl p-8 max-w-lg w-full text-center glow-destructive relative overflow-hidden"
          >
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight mb-2">
              Retrieval Failure
            </h2>
            <p className="text-destructive font-mono text-[10px] uppercase tracking-widest font-bold mb-4">
              Error Code: DOCUMENT_EMPTY_OR_GARBAGE
            </p>
            <p className="text-foreground text-sm font-bold mb-4 px-4 leading-relaxed">
              ITS A BLANK: CAN'T RETRIEVE. GIVE PROPER PDF
            </p>
            <p className="text-muted-foreground text-xs mb-8 px-6 italic">
              System message: {errorMessage}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/upload")}
                className="w-full py-4 bg-destructive text-white font-mono text-sm uppercase tracking-widest rounded-lg hover:brightness-110 flex items-center justify-center gap-2 transition-all shadow-lg font-bold"
              >
                <RefreshCcw className="w-4 h-4" /> Try Again
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="w-full py-2 text-muted-foreground font-mono text-[10px] uppercase tracking-widest hover:text-foreground transition-all"
              >
                Return to Home
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Decision Modal Overlap Zonal Intercept */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card border border-primary/30 rounded-xl p-8 max-w-lg w-full text-center glow-primary relative overflow-hidden"
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight mb-2">
              CertiTrust Seal Detected
            </h2>
            <p className="text-muted-foreground text-sm mb-8 px-4">
              System detected a pre-existing authoritative seal stamped on the Top-Right of this document. 
              Running full OCR may overwrite it. Proceed instantly with Quick Verify?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/quick-verify-result", { state: { status: "success", cert: stampedData } })}
                className="w-full py-4 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:brightness-110 flex items-center justify-center gap-2 transition-all glow-primary"
              >
                <Zap className="w-4 h-4" /> Quick Verify (Instant)
              </button>
              
              <button
                onClick={() => {
                  setShowModal(false);
                  const forceAnalysis = (window as any)._runAnalysisBound;
                  if (forceAnalysis) forceAnalysis(true);
                }}
                className="w-full py-3 border border-border text-foreground font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-muted/50 flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCcw className="w-4 h-4" /> Re-analyze Document
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProcessingPage;
