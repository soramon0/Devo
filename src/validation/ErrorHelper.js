export const errorRespone = (errorName, errorMessage, res) => {
  res.status(404).json({
    errors: {
      [errorName]: errorMessage
    }
  })
}
