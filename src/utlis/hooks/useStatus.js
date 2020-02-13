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

  /**
   * Set status.lading as true.
   */
  const setStatusLoading = () => {
    setStatus(prevStatus => ({ ...prevStatus, loading: true }));
  };

  /**
   * Handle success response from a server. It sets status.loading as false,
   * status.err.statusCode and status.err.message as null.
   * status.success changes listied in types.
   * @param {Object} res response object
   * @param {number} res.status response object
   * @param {string} res.message response object
   * @param {any} res.data response object
   * @return res argument.
   */
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

    return res;
  };

  /**
   * Handle error response from a server. It sets status.loading as false,
   * status.success.statusCode, status.success.message and status.success.data as null.
   * status.err changes listied in types.
   * @param {Object} err response object
   * @param {number} err.status response object
   * @param {string} err.message response object
   * @return Promise.reject(err).
   */
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

    return Promise.reject(err);
  };

  /**
   * Set all status props as null and loading as false.
   */
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
