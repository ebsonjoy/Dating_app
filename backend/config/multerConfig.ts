import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express"; 


const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "backend/public/UserProfileImages");
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});



const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
  
    cb(null, true);
  } else {
  
    cb(new Error("Only images are allowed!"));
  }
};


export const multerUploadUserProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
});
