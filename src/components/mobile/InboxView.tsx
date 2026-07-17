import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Mail, ChevronDown, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import EmailInbox from "@/components/EmailInbox";
import EmailViewer from "@/components/EmailViewer";
import { EmailMessage } from "@/lib/tempmail-api";

interface InboxViewProps {
  email: string | null;
  messages: EmailMessage[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenMessage: (id: string) => void;
  selectedMessage: EmailMessage | null;
  onBack: () => void;
  onRegenerate: () => void;
}

const InboxView = ({
  email,
  messages,
  isRefreshing,
  onRefresh,
  onOpenMessage,
  selectedMessage,
  onBack,
  onRegenerate,
}: InboxViewProps) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [spinRegen, setSpinRegen] = useState(false);

  const handleCopy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setSpinRegen(true);
    onRegenerate();
    setTimeout(() => setSpinRegen(false), 600);
  };

  if (selectedMessage) {
    return <EmailViewer message={selectedMessage} onBack={onBack} />;
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Email address card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl overflow-hidden glow-card"
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 p-3.5 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
              Your address
            </p>
            <p className="font-mono text-sm text-foreground truncate">
              {email || "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-primary-foreground hover:brightness-110 transition-all active:scale-95"
              aria-label="Copy email"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRegenerate();
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-secondary text-foreground hover:bg-secondary/70 transition-all active:scale-95"
              aria-label="Generate new address"
            >
              <RefreshCcw className={`w-4 h-4 ${spinRegen ? "animate-spin" : ""}`} />
            </button>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="px-4 pb-4 pt-1 border-t border-border/50 space-y-2"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use this address anywhere you need to receive emails. Everything is anonymous
              and auto-deleted after 1 hour.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] text-muted-foreground font-mono">
                Listening for incoming emails
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Inbox list */}
      <EmailInbox
        messages={messages}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        onOpenMessage={onOpenMessage}
        selectedMessage={null}
        onBack={onBack}
      />
    </div>
  );
};

export default InboxView;
