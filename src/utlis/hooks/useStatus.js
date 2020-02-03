import { useState } from 'react';

const defaultStatus = {
  loading: false,
  err: {
    statusCode: null,
    message: null,
  },
  success: {
    statusCode: null,
    message: null,
    data: null,
  },
};

const useStatus = (initialStatus = defaultStatus) => {
  const [status, setStatus] = useState(initialStatus);

  const setStatusLoading = () => {
    setStatus(prevStatus => ({ ...prevStatus, loading: true }));
  };

  const handleSuccess = (res) => {
    setStatus({
      loading: false,
      err: {
        statusCode: null,
        message: null,
      },
      success: {
        statusCode: res.status,
        message: res.data.message,
        data: res.data,
      },
    });
  };

  const handleError = (err) => {
    setStatus({
      loading: false,
      err: {
        statusCode: err.status,
        message: err.message,
      },
      success: {
        statusCode: null,
        message: null,
        data: null,
      },
    });
  };

  const resetStatus = () => {
    setStatus({
      loading: false,
      err: {
        statusCode: null,
        message: null,
      },
      success: {
        statusCode: null,
        message: null,
        data: null,
      },
    });
  };

  return {
    status,
    setStatus,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  };
};

export default useStatus;
