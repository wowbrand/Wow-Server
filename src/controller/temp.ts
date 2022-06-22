const tempPost = (req, res: any) => {
  const message = JSON.stringify(req.file);
  res.status(200).json({
    message: message,
  });
};

export { tempPost };
