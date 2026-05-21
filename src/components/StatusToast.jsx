import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const toastStyles = {
  success: {
    container: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
    icon: CheckCircle2
  },
  error: {
    container: 'border-red-400/30 bg-red-500/15 text-red-100',
    icon: AlertCircle
  },
  info: {
    container: 'border-blue-400/30 bg-blue-500/15 text-blue-100',
    icon: Info
  }
};

export default function StatusToast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast?.message) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  if (!toast?.message) {
    return null;
  }

  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur transition duration-300 ${
        style.container
      } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      role="status"
      aria-live="polite"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="text-sm font-semibold">{toast.message}</p>
    </div>
  );
}
