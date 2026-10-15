import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useToast } from './ToastContext';
import type { ToastItem, ToastVariant } from './Toast.types';

const ToastItemComponent: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);

  const duration = toast.durationMs ?? 5000;

  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, toast.id, onDismiss]);

  const getVariantStyles = (variant: ToastVariant = 'info') => {
    switch (variant) {
      case 'success':
        return {
          icon: CheckCircle2,
          border: 'border-[#10B981]/40',
          accent: 'text-[#10B981]',
          bar: 'bg-[#10B981]',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          border: 'border-[#FF5722]/40',
          accent: 'text-[#FF5722]',
          bar: 'bg-[#FF5722]',
        };
      case 'error':
        return {
          icon: AlertCircle,
          border: 'border-[#EF4444]/40',
          accent: 'text-[#EF4444]',
          bar: 'bg-[#EF4444]',
        };
      default:
        return {
          icon: Info,
          border: 'border-[#3B82F6]/40',
          accent: 'text-[#3B82F6]',
          bar: 'bg-[#3B82F6]',
        };
    }
  };

  const styles = getVariantStyles(toast.variant);
  const Icon = styles.icon;

  return (
    <div
      role="status"
      className={`pointer-events-auto relative overflow-hidden p-4 rounded-xl bg-[#141618] border ${styles.border} shadow-2xl flex flex-col gap-2 transition-all animate-in slide-in-from-bottom-5 duration-200`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.accent}`} />
          <div>
            <h4 className="text-sm font-semibold text-[#F3F4F6]">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1F23] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {toast.action && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#1C1F23] hover:bg-[#25282F] text-xs font-medium text-[#3B82F6] transition-colors"
          >
            {toast.action.label}
          </button>
        </div>
      )}

      {/* Progress countdown indicator */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22252A]">
          <div
            className={`h-full ${styles.bar} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastViewport: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItemComponent key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
