import { useEffect, useState } from "react";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbDd5Dn1t90hUkNOA031";
const SHOW_AFTER_MS = 15000; // 15s, within the requested 15-20s window
const DISMISS_KEY = "wa_popup_dismissed_at";
const DISMISS_COOLDOWN_MS = 1000 * 60 * 60 * 12; // don't re-nag for 12 hours after a dismiss

export default function WhatsAppPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissedAt = null;
    try {
      dismissedAt = Number(localStorage.getItem(DISMISS_KEY)) || null;
    } catch {
      // localStorage unavailable (private mode etc.) — just show it every time.
    }
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS) return;

    const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  const join = () => {
    dismiss();
    window.open(WHATSAPP_CHANNEL_URL, "_blank", "noopener,noreferrer");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-label="Join our WhatsApp channel"
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-md2 animate-in"
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-light hover:text-muted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.9 7.9 0 0 0-6.83 11.87L4 20l4.24-1.11a7.9 7.9 0 0 0 3.8.97h.01A7.9 7.9 0 0 0 20 12.02a7.85 7.85 0 0 0-2.4-5.7Z"
                stroke="#25D366"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9.6 8.4c.15-.34.31-.35.46-.35h.36c.12 0 .28-.05.44.33.16.4.55 1.36.6 1.46.05.1.08.22.02.35-.06.14-.1.22-.19.34-.1.12-.2.27-.29.36-.1.1-.2.2-.09.4.11.2.5.86 1.09 1.4.75.68 1.38.9 1.58 1 .2.1.31.08.43-.05.12-.13.5-.58.63-.78.13-.2.26-.16.44-.1.18.07 1.16.55 1.36.65.2.1.33.15.38.24.05.09.05.5-.11.98-.16.48-.94.93-1.29.98-.35.06-.63.1-1.66-.35-1.4-.6-2.31-2.02-2.38-2.11-.07-.1-.57-.76-.57-1.45 0-.7.36-1.03.49-1.17Z"
                fill="#25D366"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-center text-lg font-bold">Never miss a job update</h3>
        <p className="mt-2 text-center text-sm text-muted">
          Join our WhatsApp channel for fresh job, internship and fresher openings delivered straight to your phone.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={join}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1da851] transition-colors"
          >
            Join WhatsApp Channel →
          </button>
          <button
            onClick={dismiss}
            className="text-xs font-medium text-muted hover:text-ink"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}