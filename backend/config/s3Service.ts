import { S3Client, PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_BUCKET_NAME!;
  }

  async generateSignedUrls(fileTypes: string[]): Promise<Array<{
    signedUrl: string;
    fileKey: string;
    publicUrl: string;
  }>> {
    return Promise.all(
      fileTypes.map(async (fileType) => {
        const fileKey = `profilePhotos/user_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileType.split('/')[1]}`;
        
        const putObjectCommand = new PutObjectCommand({
          Bucket: this.bucket,
          Key: fileKey,
          ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(this.s3, putObjectCommand, { 
          expiresIn: 3600,
          signableHeaders: new Set(['content-type'])
        });
        return {
          signedUrl,
          fileKey,
          publicUrl: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${this.bucket}/${fileKey}`
        };
      })
    );
  }
  async deleteImageFromS3Bucket(publicUrl: string): Promise<boolean> {
    try {
      const fileKey = publicUrl.split(`${this.bucket}/`)[1];

      if (!fileKey) {
        console.error("Invalid file URL:", publicUrl);
        return false;
      }

      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      await this.s3.send(deleteObjectCommand);
      console.log(`Deleted image: ${fileKey}`);
      return true;
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      return false;
    }
  }
}

export const s3Service = new S3Service();