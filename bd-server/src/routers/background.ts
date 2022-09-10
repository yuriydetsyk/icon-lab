import { Request, Response, Router } from 'express';
import { BackgroundModel } from '../../db/models/background';

import { deleteBackground, getBackgrounds, patchBackground, uploadBackgrounds } from '../api/background';
import { isAdmin } from '../middleware/is-admin';
import { isAuthorized } from '../middleware/is-authorized';

const router = Router({
  mergeParams: true,
});

router.get('/', async (_: Request, res: Response) => {
  try {
    res.send(await getBackgrounds());
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when getting backgrounds',
    });
  }
});

router.post('/', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    const { processed } = await uploadBackgrounds(req);
    console.log(`Successfully uploaded ${processed} backgrounds`);
    res.status(201).send();
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: 'Error when uploading backgrounds',
    });
  }
});

router.patch('/', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    res.send(await patchBackground(req.body.bg as Partial<BackgroundModel>));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when patching background',
    });
  }
});

router.delete('/:backgroundId', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    await deleteBackground(req.params.backgroundId as string);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when deleting background',
    });
  }
});

export { router as backgroundRouter };
