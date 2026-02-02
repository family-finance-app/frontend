type SuccessHandler = (message: string) => void;
type ErrorHandler = (message: string) => void;

let successHandler: SuccessHandler | null = null;
let errorHandler: ErrorHandler | null = null;

export function registerGlobalAlerts(handlers: {
  onSuccess?: SuccessHandler | null;
  onError?: ErrorHandler | null;
}) {
  successHandler = handlers.onSuccess ?? null;
  errorHandler = handlers.onError ?? null;
}

export function showGlobalSuccess(message: string) {
  if (successHandler) successHandler(message);
}

export function showGlobalError(message: string) {
  if (errorHandler) errorHandler(message);
}

export function clearGlobalAlertsRegistration() {
  successHandler = null;
  errorHandler = null;
}

const globalAlerts = {
  registerGlobalAlerts,
  showGlobalSuccess,
  showGlobalError,
  clearGlobalAlertsRegistration,
};

export default globalAlerts;
