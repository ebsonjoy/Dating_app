// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import dotenv from "dotenv";

// dotenv.config();

// class S3Service {
//   private s3: S3Client;
//   private bucket: string;

//   constructor() {
//     this.s3 = new S3Client({
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//       },
//       region: process.env.AWS_REGION,
//     });
//     this.bucket = process.env.AWS_BUCKET_NAME!;
//   }

//   async generateSignedUrls(fileTypes: string[]): Promise<Array<{
//     signedUrl: string;
//     fileKey: string;
//     publicUrl: string;
//   }>> {
//     return Promise.all(
//       fileTypes.map(async (fileType) => {
//         const fileKey = `profilePhotos/user_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileType.split('/')[1]}`;
        
//         const putObjectCommand = new PutObjectCommand({
//           Bucket: this.bucket,
//           Key: fileKey,
//           ContentType: fileType,
//         });

//         const signedUrl = await getSignedUrl(this.s3, putObjectCommand, { 
//           expiresIn: 3600,
//           signableHeaders: new Set(['content-type'])
//         });

//         return {
//           signedUrl,
//           fileKey,
//           publicUrl: `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
//         };
//       })
//     );
//   }
// }

// export const s3Service = new S3Service();