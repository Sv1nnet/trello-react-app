const createErrorResponseObject = (err) => {
  const { response } = err;
  const responseData = {
    message: response ? response.data.err : 'No connection with server',
    status: response ? response.status : 503,
  };

  return responseData;
};

export default createErrorResponseObject;
