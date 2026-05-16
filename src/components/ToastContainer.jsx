import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type] || Info;

        return (
          <div className={`toast toast-${toast.type || 'info'}`} key={toast.id}>
            <Icon size={19} />
            <p>{toast.message}</p>
            <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
