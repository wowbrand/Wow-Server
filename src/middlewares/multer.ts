import multer from "multer";
import path from "path";

import multerS3 from "multer-s3";
import aws from "aws-sdk";

let s3: any = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const awsUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "bikeroutesberlin",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      console.log(ext, file.originalname);
      cb(null, {
        fieldName: `${file.fieldname}_${Date.now().toString()}.${ext}`,
      });
    },

    key: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      cb(null, `${file.originalname}_${Date.now().toString()}${ext}`);
    },
  }),
});

// const filename = "the-file-name";
// const fileContent = fs.readFileSync(
//   "/Users/svendudink/Documents/webdeveloper course/Berlin-bikeroutes.de-server/files/ana.jpg"
// );

// const params = {
//   Bucket: process.env.AWS_BUCKET_NAME,
//   Key: `${filename}.jpg`,
//   Body: fileContent,
// };

// s3.upload(params, (err, data) => {
//   if (err) {
//     reject(err);
//   }
//   resolve(data.Location);
// });

const multerUploads = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, next) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      next(new Error("File type is not supported"), false);
      return;
    }
    next(null, true);
  },
});

// const multerFiles = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, next) => {
//     let ext = path.extname(file.originalname);
//     if (ext !== ".zip" && ext !== ".jpg" && ext !== ".kml" && ext !== ".kmz") {
//       next(new Error("File type is not supported"), false);
//       return;
//     }
//     next(null, true);
//   },
// });

export { awsUpload };
