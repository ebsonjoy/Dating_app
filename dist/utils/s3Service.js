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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
// Function to delete an image from S3
const deleteImageFromS3 = (imageURL) => __awaiter(void 0, void 0, void 0, function* () {
    const key = imageURL.split(".com/")[1]; // Extract the S3 key from the URL
    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    try {
        yield s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        console.log(`Deleted image from S3: ${key}`);
    }
    catch (error) {
        console.error("Error deleting image from S3:", error);
        throw error;
    }
});
exports.deleteImageFromS3 = deleteImageFromS3;
