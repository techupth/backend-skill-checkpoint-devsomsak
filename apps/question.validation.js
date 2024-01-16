export const validateData = (req, res, next) => {
  const body = req.body;

  if (body.answer.length > 300) {
    return res.status(400).json({
      message: "Answer must not be over 300 characters",
    });
  }
  // if (body.description.length > 150) {
  //   return res.status(400).json({
  //     message: "Description must not exceed 150 characters",
  //   });
  // }
  // if (!Array.isArray(body.categories) || body.categories.length < 1) {
  //   return res.status(400).json({
  //     message: "Categories must be an array with at least 1 value",
  //   });
  // }
  next();
};
