import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, FileText, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UploadPage = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleAnalyze = () => {
    if (file) {
      navigate("/processing", { state: { file } });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground mastery-grid">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Certificate Ingestion
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-2">
              Analyze Certificate
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Neural scan enabled for PDF, JPG, and PNG formats. Max 250MB per upload.
            </p>

            {/* Upload Zone */}
            <div
              onDragOver={handleDrag}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDrop={handleDrop}
              className={`surface-card border-2 border-dashed rounded-lg p-16 flex flex-col items-center gap-4 cursor-pointer transition-all ${
                isDragging
                  ? "border-primary glow-primary"
                  : file
                  ? "border-success/50"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              {file ? (
                <>
                  <FileText className="w-12 h-12 text-success" />
                  <span className="font-mono text-sm text-foreground">
                    {file.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Analysis
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <span className="font-display text-sm font-semibold text-foreground">
                    Drop Source Files Here
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Max 250MB per batch upload
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className="px-6 py-3 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-30 disabled:cursor-not-allowed glow-primary"
              >
                Run CertiTrust Analysis
              </button>
              <button
                onClick={() => document.getElementById("file-input")?.click()}
                className="px-6 py-3 border border-border text-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-muted/50 active:scale-[0.97] transition-all"
              >
                Select Files
              </button>
            </div>

            {/* Info */}
            <div className="mt-12 surface-card p-6 border border-border/30 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  Security Protocol
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All uploaded documents are processed within an AES-256 encrypted sandbox.
                Files are not stored beyond the analysis session. SOC2 compliant processing environment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadPage;
