"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X, ExternalLink } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  txHash?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-terracotta-500 flex-shrink-0" />,
  };

  const bgStyles = {
    success: "bg-cream-50 border-emerald-200 text-forest-900",
    error: "bg-cream-50 border-rose-200 text-rose-950",
    info: "bg-cream-50 border-terracotta-200 text-forest-900",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-card transition-all transform duration-200 ease-out animate-in slide-in-from-bottom-3 ${bgStyles[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs text-warmBrown-700 mt-0.5 leading-relaxed break-words">
            {toast.message}
          </p>
        )}
        {toast.txHash && (
          <a
            href={`https://scan.botchain.ai/tx/${toast.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-terracotta-600 hover:text-terracotta-700 underline font-medium mt-1.5"
          >
            <span>View on Botchain Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-warmBrown-400 hover:text-warmBrown-700 transition-colors p-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

