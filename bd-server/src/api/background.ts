import S3, { PutObjectRequest } from 'aws-sdk/clients/s3';
import { Request } from 'express';
import fs from 'fs';
import { File, Form } from 'multiparty';
import { v4 as uuidv4 } from 'uuid';

import Background from '../../db/models/background';
import { capitalize } from '../helpers/text.helper';

const s3 = new S3();

export async function getBackgrounds() {
  return await Background.findAll();
}

export async function patchBackground(bg: Partial<Background>) {
  return await Background.update(bg, { where: { id: bg.id } });
}

export async function deleteBackground(bgId: string) {
  return await Background.destroy({
    where: { id: bgId },
  });
}

export function uploadBackgrounds(req: Request) {
  const insertions: Promise<void>[] = [];
  let processed = 0;
  const form = new Form();
  const { AWS_IMG_BUCKET, API_ENV } = process.env;

  return new Promise<{ processed: number }>((resolve, reject) => {
    form.parse(req, async (_, __, data) => {
      const files: File[] = data.files || [];
      const uploadParams: PutObjectRequest = { Bucket: AWS_IMG_BUCKET, Key: '', ACL: 'public-read' };

      for (const file of files) {
        const uuid = uuidv4();

        // Configure the file stream and obtain the upload parameters
        const fileStream = fs.createReadStream(file.path);
        fileStream.on('error', (e) => {
          reject(e);
        });
        uploadParams.Body = fileStream;

        const originalFileNameWithExtension = file.originalFilename.split('.').slice(-2);
        const originalFileName = originalFileNameWithExtension[0];
        const fileExtension = originalFileNameWithExtension[1];
        const fileName = `${uuid}.${fileExtension}`;

        uploadParams.Key = `backgrounds/${API_ENV}/${fileName}`;
        uploadParams.ContentType = file.headers['content-type'];

        insertions.push(
          new Promise((res, rej) => {
            s3.upload(uploadParams, async (e, sendData) => {
              if (e) {
                rej(e);
              }

              if (sendData) {
                console.log('Upload Success', sendData.Location);

                try {
                  await Background.create({
                    name: capitalize(originalFileName.replace(/-|_/g, ' '), true),
                    tags: [originalFileName],
                    url: `https://${AWS_IMG_BUCKET}${sendData.Location.split(AWS_IMG_BUCKET)[1]}`,
                  });

                  processed++;
                  res();
                } catch (e) {
                  rej(e);
                }
              }
            });
          })
        );
      }

      try {
        await Promise.all(insertions);
        resolve({ processed });
      } catch (e) {
        reject(e);
      }
    });
  });
}
