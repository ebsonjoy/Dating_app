"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromS3 = exports.multerUploadUserImg = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
exports.multerUploadUserImg = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME || "",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const filename = `profilePhotos/${file.fieldname}_${Date.now()}${path_1.default.extname(file.originalname)}`;
            cb(null, filename);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only images are allowed!"));
        }
    },
});
// delete
const deleteImageFromS3 = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const urlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        const imageKey = imageUrl.replace(urlPrefix, '');
        const deleteParams = {
            Bucket: bucketName,
            Key: imageKey,
        };
        yield s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        console.log(`Image deleted successfully from S3: ${imageKey}`);
    }
    catch (error) {
        console.error("Error deleting image from S3:", error);
    }
});
exports.deleteImageFromS3 = deleteImageFromS3;
