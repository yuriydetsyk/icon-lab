import { Request, Response, Router } from 'express';

import { IconModel } from '../../db/models/icon';
import { deleteIcon, getIcons, parseRaster, parseSvg, patchIcon, uploadIcons } from '../api/icon';
import { isAdmin } from '../middleware/is-admin';
import { isAuthorized } from '../middleware/is-authorized';

const router = Router({
  mergeParams: true,
});

router.get('/', async (req: Request, res: Response) => {
  try {
    res.send(await getIcons(req));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when getting icons',
    });
  }
});

router.post('/', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    const { processed } = await uploadIcons(req);
    console.log(`Successfully uploaded ${processed} icons`);
    res.status(201).send();
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: 'Error when uploading icons',
    });
  }
});

router.patch('/', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    res.send(await patchIcon(req.body.icon as Partial<IconModel>));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when patching icon',
    });
  }
});

router.delete('/:iconId', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    await deleteIcon(req.params.iconId as string);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when deleting icon',
    });
  }
});

router.post('/parse-svg', async (req: Request, res: Response) => {
  try {
    const stream = parseSvg(`${req.body.fileName}`, req.body.isBackground || false);
    stream
      .on('error', (error) => {
        console.log(error);
        return res.status(500).send({ message: error.message });
      })
      .pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when parsing SVG body',
    });
  }
});

router.post('/parse-raster', async (req: Request, res: Response) => {
  try {
    res.json({ base64: await parseRaster(`${req.body.fileName}`) });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when parsing raster icon',
    });
  }
});

export { router as iconRouter };
