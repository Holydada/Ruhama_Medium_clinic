type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  durationMs?: number;
}

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();

export const toast = {
  show(message: string, type: ToastType = 'info', durationMs = 3500) {
    const payload: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      message,
      durationMs,
    };
    listeners.forEach((listener) => listener(payload));
  },
  success(message: string, durationMs?: number) {
    this.show(message, 'success', durationMs);
  },
  error(message: string, durationMs?: number) {
    this.show(message, 'error', durationMs);
  },
  info(message: string, durationMs?: number) {
    this.show(message, 'info', durationMs);
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

