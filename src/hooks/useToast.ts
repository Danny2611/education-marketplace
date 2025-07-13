import { useCallback } from 'react';
import { toastUtils } from '../components/common/Toast/Toast';

export const useToast = () => {
  const showSuccess = useCallback((message: string, duration?: number) => {
    toastUtils.success(message, { duration });
  }, []);

  const showError = useCallback((message: string, duration?: number) => {
    toastUtils.error(message, { duration });
  }, []);

  const showWarning = useCallback((message: string, duration?: number) => {
    toastUtils.warning(message, { duration });
  }, []);

  const showInfo = useCallback((message: string, duration?: number) => {
    toastUtils.info(message, { duration });
  }, []);

  const showLoading = useCallback((message: string) => {
    return toastUtils.loading(message);
  }, []);

  
  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    
  };
};