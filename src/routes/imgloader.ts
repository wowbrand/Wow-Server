import express from "express";
import { tempPost } from "../controller/temp";

import { awsUpload } from "../middlewares/multer";

const router = express.Router();

router.put("/", awsUpload.array("files"), tempPost);

export default router;
