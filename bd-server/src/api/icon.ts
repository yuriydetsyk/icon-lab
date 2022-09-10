import S3, { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import { Request } from 'express';
import fs from 'fs';
import imageToBase64 from 'image-to-base64';
import { File, Form } from 'multiparty';
import path from 'path';
import { Op, QueryTypes } from 'sequelize';
import svg2img from 'svg2img';
import tmp from 'tmp';
import { v4 as uuidv4 } from 'uuid';

import { CategoryModel } from '../../db/models/category';
import { IconModel } from '../../db/models/icon';
import { config } from '../config';
import { Database } from '../database';
import { capitalize, convertToDashes } from '../helpers/text.helper';
import { IconType } from '../models/enums/icon-type';
import { RequestWithUser } from '../models/interfaces/request';
import { appRoot } from '../utils/path';
import { addIconCategory } from './category';

const watermark = require('jimp-watermark');
const s3 = new S3();

export async function getIcons(req: Request) {
  const { keyword, categoryId } = req.query;
  const columns = Object.keys(IconModel.getAttributes()).map((key) => `i.${convertToDashes(key)}`);
  const columnsWithAliases = Object.keys(IconModel.getAttributes()).map((key) => `i.${convertToDashes(key)} as "${key}"`);
  const catColumnsWithAliases = Object.keys(CategoryModel.getAttributes()).map((key) => `'${key}', c.${convertToDashes(key)}`);
  let query = `SELECT ${columnsWithAliases}, COALESCE(json_agg(json_build_object(${catColumnsWithAliases})) FILTER (WHERE c.id IS NOT NULL), '[]') as categories FROM icon i`;
  let joinQuery = 'LEFT JOIN icon_category ic ON ic.icon_id = i.id';
  joinQuery += ' LEFT JOIN category c ON c.id = ic.category_id';
  let whereClause: string;
  let groupClause = `GROUP BY ${columns}`;

  const user = (req as RequestWithUser).user;
  const renderPremiumIcons = !!user?.isAdmin; // TODO: configure premium access
  if (renderPremiumIcons) {
    whereClause = 'WHERE i.is_premium = true OR i.original_id IS NULL';
  } else {
    whereClause = 'WHERE i.is_premium = false';
  }

  if (categoryId) {
    whereClause += ` AND ic.category_id = :categoryId`;
  }
  if (keyword) {
    joinQuery += ` CROSS JOIN unnest(i.tags) t`;
    whereClause += ` AND (i.name ILIKE :keyword OR t ILIKE :keyword)`;
  }

  return await Database.sequelize.query<IconModel>(`${query} ${joinQuery} ${whereClause} ${groupClause}`, {
    type: QueryTypes.SELECT,
    replacements: { categoryId: categoryId ?? null, keyword: `%${keyword}%` ?? null },
  });
}

export async function patchIcon(icon: Partial<IconModel>) {
  await IconModel.update(icon, { where: { id: icon.id } });
  const updatedIcon = await IconModel.findOne({ where: { id: icon.id }, include: CategoryModel });

  // if the icon becomes Premium, create its preview icon with a watermark
  if (icon.isPremium === true) {
    const [fileName, filePath] = await generateWatermarkImage(updatedIcon.url);

    await uploadIcon({
      fPath: filePath,
      fName: fileName,
      contentType: 'image/png',
      categoryId: updatedIcon.categories?.length ? updatedIcon.categories[0].id : null,
      overrideValues: {
        isPremium: false,
        originalId: updatedIcon.id,
        name: updatedIcon.name,
        tags: updatedIcon.tags,
      },
    });

    fs.unlinkSync(filePath);
  } else {
    // if the icon becomes Basic, delete its preview icon
    // TODO: also remove the image from AWS S3
    await IconModel.destroy({ where: { originalId: icon.id } });
  }

  // if the icon becomes Basic, remove its preview icon
  return await IconModel.update(icon, { where: { id: icon.id } });
}

export async function deleteIcon(iconId: string) {
  // If the icon has a generated preview icon - delete also the preview
  // TODO: include AWS S3 deleting?
  // const generatedIcon = await IconModel.findAll({
  //   where: {
  //     originalId: iconId,
  //   },
  // });

  // if (generatedIcon) {
  //   const { ICONLAB_AWS_IMG_BUCKET, ICONLAB_ENV } = process.env;
  //   const fileName = generatedIcon.url.split('/').slice(-1);
  //   const deleteParams: DeleteObjectRequest = { Bucket: ICONLAB_AWS_IMG_BUCKET, Key: `icons/${ICONLAB_ENV}/${fileName}` };
  //   await new Promise<void>((resolve, reject) => {
  //     try {
  //       s3.deleteObject(deleteParams, (e) => {
  //         if (e) {
  //           throw e;
  //         }

  //         resolve();
  //       });
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }

  return await IconModel.destroy({
    where: {
      [Op.or]: {
        id: iconId,
        originalId: iconId,
      },
    },
  });
}

export function parseSvg(fileName: string, isBackground = false) {
  const folderName = !isBackground ? 'icons' : 'backgrounds';
  const getParams: GetObjectRequest = {
    Bucket: config.aws.imgBucket,
    Key: `${folderName}/${config.server.env}/${fileName}`,
  };
  return s3.getObject(getParams).createReadStream();
}

export async function parseRaster(fileName: string, includePrefix = true) {
  const base64 = await imageToBase64(`https://${config.aws.imgBucket}/icons/${config.server.env}/${fileName}`);
  return `${includePrefix ? 'data:image/png;base64,' : ''}${base64}`;
}

export function uploadIcons(req: Request) {
  const iconInsertions: Promise<void>[] = [];
  const form = new Form();
  let processed = 0;

  return new Promise<{ processed: number }>((resolve, reject) => {
    form.parse(req, async (_, __, data) => {
      const files: File[] = data.files || [];

      try {
        for (const file of files) {
          await uploadIcon({
            fPath: file.path,
            fName: file.originalFilename,
            contentType: file.headers['content-type'],
            overrideValues: { isPremium: false },
          });

          processed++;
        }

        await Promise.all(iconInsertions);
        resolve({ processed: iconInsertions.length });
      } catch (e) {
        reject(e);
      }
    });
  });
}

async function generateWatermarkImage(originalImageUrl: string) {
  return new Promise<[string, string]>((resolve, reject) => {
    svg2img(originalImageUrl, async (e, data: Buffer) => {
      if (e) {
        reject(e);
      }

      const file = tmp.fileSync();
      fs.appendFileSync(file.name, data);

      const previewFileName = `${uuidv4()}.png`;
      const watermarkOptions = {
        ratio: 1,
        opacity: 1,
        dstPath: path.join(appRoot, 'previews', previewFileName),
      };
      await watermark.addWatermark(file.name, path.join(appRoot, 'assets', 'img', 'watermark.png'), watermarkOptions);

      resolve([previewFileName, watermarkOptions.dstPath]);
    });
  });
}

async function uploadIcon({
  fPath,
  fName,
  contentType,
  categoryId,
  overrideValues,
}: {
  fPath: string;
  fName: string;
  contentType?: string;
  categoryId?: string;
  overrideValues: Partial<IconModel>;
}) {
  const imagesBucket = config.aws.imgBucket;
  const sendData = await uploadIconToS3({
    fPath: fPath,
    fName: fName,
    contentType: contentType,
  });
  const originalFileNameWithExtension = fName.split('.').slice(-2);
  const originalFileName = originalFileNameWithExtension[0];
  const fileExtension = originalFileNameWithExtension[1];
  const iconType = fileExtension === 'svg' ? IconType.Vector : IconType.Raster;

  const icon = await IconModel.create({
    name: capitalize(originalFileName.replace(/-|_/g, ' '), true),
    tags: [originalFileName],
    url: `https://${imagesBucket}${sendData.Location.split(imagesBucket)[1]}`,
    type: iconType,
    ...overrideValues,
  });

  // TODO: pass and use real category
  if (categoryId) {
    await addIconCategory(icon.id, categoryId);
  } else {
    const сategory = await CategoryModel.findOne({ where: { name: 'Raster' } });
    await addIconCategory(icon.id, сategory.id);
  }
}

function uploadIconToS3({ fPath, fName, contentType }: { fPath: string; fName: string; contentType?: string }) {
  const uploadParams: PutObjectRequest = { Bucket: config.aws.imgBucket, Key: '', ACL: 'public-read' };
  const uuid = uuidv4();

  // Configure the file stream and obtain the upload parameters
  const fileStream = fs.createReadStream(fPath);
  fileStream.on('error', (e) => {
    throw e;
  });
  uploadParams.Body = fileStream;

  const originalFileNameWithExtension = fName.split('.').slice(-2);
  const fileExtension = originalFileNameWithExtension[1];
  const fileName = `${uuid}.${fileExtension}`;

  uploadParams.Key = `icons/${config.server.env}/${fileName}`;
  if (contentType) {
    uploadParams.ContentType = contentType;
  }

  return new Promise<S3.ManagedUpload.SendData>((resolve, reject) => {
    s3.upload(uploadParams, async (e, sendData) => {
      if (e) {
        reject(e);
      }

      if (sendData) {
        console.log('Upload Success', sendData.Location);

        try {
          resolve(sendData);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
