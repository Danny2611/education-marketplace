import React from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '16px',
          fontSize: '14px',
          minWidth: '320px',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex w-full items-center space-x-3">
              {icon}
              <div className="flex-1">{message}</div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

// Custom toast functions
export const showSuccessToast = (
  message: string,
  options?: { duration?: number },
) => {
  toast.success(message, {
    icon: <CheckCircle className="text-green-500" size={20} />,
    duration: options?.duration || 3000,
    style: {
      border: '1px solid #10b981',
      background: '#f0fdf4',
    },
  });
};

export const showErrorToast = (
  message: string,
  options?: { duration?: number },
) => {
  toast.error(message, {
    icon: <XCircle className="text-red-500" size={20} />,
    duration: options?.duration || 4000,
    style: {
      border: '1px solid #ef4444',
      background: '#fef2f2',
    },
  });
};

export const showWarningToast = (
  message: string,
  options?: { duration?: number },
) => {
  toast(message, {
    icon: <AlertCircle className="text-orange-500" size={20} />,
    duration: options?.duration || 3500,
    style: {
      border: '1px solid #f59e0b',
      background: '#fffbeb',
    },
  });
};

export const showInfoToast = (
  message: string,
  options?: { duration?: number },
) => {
  toast(message, {
    icon: <Info className="text-blue-500" size={20} />,
    duration: options?.duration || 3000,
    style: {
      border: '1px solid #3b82f6',
      background: '#eff6ff',
    },
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    style: {
      border: '1px solid #6b7280',
      background: '#f9fafb',
    },
  });
};

// Toast utility functions
export const toastUtils = {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  loading: showLoadingToast,
};
