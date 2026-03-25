import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 bg-background py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-bold text-foreground">CERTITRUST</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2026 CertiTrust AI // End-to-End Encrypted Verification Protocol
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
