const STATUS = {
  OK: 200,
  CREATED: 201,
};

function jsonResponse(
  res,
  code,
  status,
  message,
  data = null,
  pagination = null
) {
  const response = {
    meta: {
      code: code,
      status: status,
      message: message,
    },
    data: data,
  };

  if (pagination) {
    response.meta.pagination = pagination;
  }

  return res.status(code).json(response);
}

module.exports = {
  HOME: (res) => {
    return jsonResponse(res, STATUS.OK, "SUCCESS", "Welcome to Healthcare API");
  },
  SUCCESS: (res, message, data = null) => {
    return jsonResponse(res, STATUS.OK, "SUCCESS", message, data);
  },
  CREATED: (res, message, data = null) => {
    return jsonResponse(res, STATUS.CREATED, "SUCCESS", message, data);
  },
  PAGINATED: (res, message, data, pagination) => {
    return jsonResponse(res, STATUS.OK, "SUCCESS", message, data, pagination);
  },
  TOO_MANY_REQUESTS: (res, message) => {
    return jsonResponse(res, 429, "TOO MANY REQUESTS", message);
  },
};
