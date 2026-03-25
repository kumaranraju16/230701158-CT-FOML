import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, XCircle, AlertTriangle, ArrowRight, UploadCloud } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const QuickVerifyResult = () => {
    const location = useLocation();
    const { status, message, cert } = location.state || {};

    const isSuccess = status === "success";
    const isNoQr = status === "no_qr";
    const isTampered = status === "tampered";
    const isFaked = status === "invalid_qr" || status === "invalid";

    return (
        <div className="min-h-screen bg-background text-foreground mastery-grid">
            <Navbar />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="surface-card rounded-lg border border-border/30 p-10 text-center relative overflow-hidden"
                    >
                        {isSuccess && (
                            <div className="relative z-10">
                                <Shield className="w-20 h-20 text-success mx-auto mb-6 glow-accent" />
                                <h1 className="font-display text-3xl font-bold text-success mb-2 uppercase tracking-tight">
                                    Identity Verified
                                </h1>
                                <p className="text-muted-foreground mb-8">
                                    CertiTrust forensic nodes have confirmed this credential's integrity.
                                </p>

                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Certified Subject</span>
                                        <span className="font-display font-bold text-foreground text-lg">{cert?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Institution</span>
                                        <span className="font-mono text-sm text-foreground">{cert?.institution}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Trust Score</span>
                                        <span className="font-mono text-sm text-success font-bold">{cert?.trust_score}/100</span>
                                    </div>

                                <Link
                                    to={`/verify/${cert?.certificate_id}`}
                                    className="mt-10 w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-mono text-sm uppercase tracking-widest rounded-lg hover:brightness-110 transition-all glow-primary"
                                >
                                    Open Full Audit Trail <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {isNoQr && (
                            <div className="relative z-10">
                                <AlertTriangle className="w-20 h-20 text-warning mx-auto mb-6" />
                                <h1 className="font-display text-3xl font-bold text-warning mb-2 uppercase tracking-tight">
                                    No Seal Detected
                                </h1>
                                <p className="text-muted-foreground mb-8">
                                    This document does not contain a CertiTrust verification seal.
                                </p>
                                <Link
                                    to="/upload"
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-mono text-sm uppercase tracking-widest rounded-lg hover:brightness-110 transition-all glow-primary"
                                >
                                    Begin Full Analysis <UploadCloud className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {isTampered && (
                            <div className="relative z-10">
                                <AlertTriangle className="w-20 h-20 text-destructive mx-auto mb-6 glow-destructive animate-pulse" />
                                <h1 className="font-display text-3xl font-bold text-destructive mb-2 uppercase tracking-tight">
                                    SECURITY ALERT: TAMPERED
                                </h1>
                                <p className="text-destructive font-bold mb-4 uppercase tracking-widest text-xs">
                                    Forensic Hash Mismatch Detected
                                </p>
                                <p className="text-muted-foreground mb-8">
                                    {message || "This document has been modified after it was officially verified by CertiTrust. The current content does not match the blockchain-backed record."}
                                </p>
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-8 text-left">
                                    <p className="font-mono text-[10px] text-destructive uppercase font-bold mb-1">Original Record Found</p>
                                    <p className="text-xs text-muted-foreground">Subject: {cert?.name}</p>
                                    <p className="text-xs text-muted-foreground">ID: {cert?.certificate_id}</p>
                                </div>
                                <Link
                                    to="/"
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-secondary/80 transition-all font-bold"
                                >
                                    Report Forgery
                                </Link>
                            </div>
                        )}

                        {isFaked && (
                            <div className="relative z-10">
                                <XCircle className="w-20 h-20 text-destructive mx-auto mb-6 glow-destructive" />
                                <h1 className="font-display text-3xl font-bold text-destructive mb-2 uppercase tracking-tight">
                                    Verification Failed
                                </h1>
                                <p className="text-destructive font-bold mb-4 uppercase tracking-widest text-xs">
                                    Security Alert: Faked or External Seal
                                </p>
                                <p className="text-muted-foreground mb-8">
                                    {message || "The detected seal is not a valid CertiTrust record. This document may be fraudulent."}
                                </p>
                                <Link
                                    to="/"
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-secondary/80 transition-all"
                                >
                                    Return to Safety
                                </Link>
                            </div>
                        )}

                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-32 h-32" />
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default QuickVerifyResult;
