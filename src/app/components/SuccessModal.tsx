import { CheckCircle, X } from 'lucide-react';

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface SuccessModalProps {
  title: string;
  message: string;
  actions?: Action[];
  onClose: () => void;
  icon?: React.ReactNode;
  accentColor?: 'indigo' | 'green' | 'blue';
}

export function SuccessModal({
  title,
  message,
  actions = [],
  onClose,
  icon,
  accentColor = 'green',
}: SuccessModalProps) {
  const ring = {
    indigo: 'bg-indigo-100',
    green: 'bg-green-100',
    blue: 'bg-blue-100',
  }[accentColor];

  const iconColor = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
  }[accentColor];

  const btnPrimary = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
  }[accentColor];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full ${ring} flex items-center justify-center mb-4`}>
            {icon ?? <CheckCircle className={`w-8 h-8 ${iconColor}`} />}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{message}</p>

          {actions.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {actions.map((action, i) => {
                const isFirst = i === 0;
                const v = action.variant ?? (isFirst ? 'primary' : 'secondary');
                return (
                  <button
                    key={i}
                    onClick={action.onClick}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                      v === 'primary'
                        ? `${btnPrimary} text-white`
                        : v === 'secondary'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
