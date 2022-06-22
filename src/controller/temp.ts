const tempPost = (req: any, res: any) => {
  const message = JSON.stringify(req.files);
  res.status(200).json({
    message: message,
  });
};

export { tempPost };
