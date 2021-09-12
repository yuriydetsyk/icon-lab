import { Request, Response, Router } from 'express';
import { backgroundRouter } from './background';
import { categoryRouter } from './category';
import { iconRouter } from './icon';
import { tokenRouter } from './token';

const router = Router({
  mergeParams: true,
});

router.get('/', (req: Request, res: Response) => {
  res.send({
    message: `Hello world! Serving from ${process.env.HOST}:${process.env.PORT}.`,
  });
});

router.use('/icons', iconRouter);
router.use('/backgrounds', backgroundRouter);
router.use('/categories', categoryRouter);
router.use('/token', tokenRouter);

export { router as apiRouter };
