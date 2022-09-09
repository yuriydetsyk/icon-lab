import { Router } from 'express';

import { version } from '../../package.json';
import { backgroundRouter } from './background';
import { categoryRouter } from './category';
import { iconRouter } from './icon';
import { tokenRouter } from './token';

const router = Router({
  mergeParams: true,
});

router.get('', (_, res) => res.json({ name: `Icon Lab API (${process.env.ICONLAB_ENV})`, version }));

router.use('/icons', iconRouter);
router.use('/backgrounds', backgroundRouter);
router.use('/categories', categoryRouter);
router.use('/token', tokenRouter);

export { router as apiRouter };
