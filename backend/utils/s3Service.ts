// import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
//   region: process.env.AWS_REGION,
// });

// // Function to delete an image from S3
// export const deleteImageFromS3 = async (imageURL: string) => {
//   const key = imageURL.split(".com/")[1]; // Extract the S3 key from the URL
//   const deleteParams = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: key,
//   };

//   try {
//     await s3.send(new DeleteObjectCommand(deleteParams));
//     console.log(`Deleted image from S3: ${key}`);
//   } catch (error) {
//     console.error("Error deleting image from S3:", error);
//     throw error;
//   }
// };
