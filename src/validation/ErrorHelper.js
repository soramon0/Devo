export const errorRespone = (
  errorName,
  errorMessage,
  res,
  statusCode = 404
) => {
  res.status(statusCode).json({
    error: {
      [errorName]: errorMessage
    }
  })
}
