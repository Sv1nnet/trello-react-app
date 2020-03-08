/**
 * Creates object from failed request
 * @param {object} err object that contains response object
 * @param {object} err.response response from failed request
 * @param {object} err.response.data contains error message
 * @param {string} err.response.data.err error message
 * @param {string} err.response.status response status code
 * @return {object} { message: string, status: number }
 */
const createErrorResponseObject = (err) => {
  const { response } = err;
  const responseData = {
    message: response ? response.data.err : 'No connection with server',
    status: response ? response.status : 503,
  };

  return responseData;
};

export default createErrorResponseObject;
