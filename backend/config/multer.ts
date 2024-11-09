import { S3Client, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

export const multerUploadUserImg = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME || "",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const filename = `profilePhotos/${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed!"));
      }
    },
  });
  

  // delete
export const deleteImageFromS3 = async (imageUrl: string) => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const urlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const imageKey = imageUrl.replace(urlPrefix, '');

    const deleteParams = {
      Bucket: bucketName,
      Key: imageKey,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`Image deleted successfully from S3: ${imageKey}`);
  } catch (error) {
    console.error("Error deleting image from S3:", error);
  }
};