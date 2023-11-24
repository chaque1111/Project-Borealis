import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer, mimetype: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
        Key: fileName,
        Body: file,
        ContentType: mimetype,
      }),
    );
  }

  async getImages(fileName: string) {
    const getObjectParams = {
      Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
      Key: fileName,
    };
    const command = new GetObjectCommand(getObjectParams);
    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
