import { Request, Response, Router } from 'express';

import { deleteToken, getToken, refreshToken, verifyToken } from '../api/token';

const router = Router({
  mergeParams: true,
});

router.post('/', async (req: Request, res: Response) => {
  try {
    res.json({ token: await getToken(req) });
  } catch (error) {
    console.error(error);
    res.status(401).send({
      message: 'Error when getting token',
    });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    await deleteToken(req.headers.authorization.split('Bearer')[1].trim());
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when deleting token',
    });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    res.json({ token: await refreshToken(req.headers.authorization.split('Bearer')[1].trim()) });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when refreshing token',
    });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  try {
    res.json({ token: await verifyToken(req.headers.authorization.split('Bearer')[1].trim()) });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when verifying token',
    });
  }
});

export { router as tokenRouter };
