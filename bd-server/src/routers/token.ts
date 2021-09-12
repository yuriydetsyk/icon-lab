import { Request, Response, Router } from 'express';

import { deleteToken, getToken, refreshToken, verifyToken } from '../api/token';

const router = Router({
  mergeParams: true,
});

router.post('/', async (req: Request, res: Response) => {
  try {
    res.json(await getToken(req));
  } catch (error) {
    console.error(error);
    res.status(401).send({
      message: 'Error when getting token',
    });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    deleteToken(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when deleting token',
    });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    refreshToken(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when refreshing token',
    });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  try {
    res.json(await verifyToken(req));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when verifying token',
    });
  }
});

export { router as tokenRouter };
