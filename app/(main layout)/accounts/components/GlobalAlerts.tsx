import React from 'react';

import { SuccessMessage, ErrorMessage } from '@/components';

export const GlobalAlerts: React.FC<{
  successMessage?: string | null;
  errorMessage?: string | null;
}> = ({ successMessage, errorMessage }) => {
  return (
    <>
      {successMessage && (
        <div role="status">
          <SuccessMessage message={successMessage} />
        </div>
      )}
      {errorMessage && (
        <div role="alert">
          <ErrorMessage message={errorMessage} />
        </div>
      )}
    </>
  );
};

export default GlobalAlerts;
