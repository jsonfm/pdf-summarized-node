import multer from "multer";

export const uploadFilesMiddleware = multer({
  storage: multer.memoryStorage(),
});
