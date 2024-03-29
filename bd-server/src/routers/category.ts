import { Request, Response, Router } from 'express';
import { CategoryModel } from '../../db/models/category';
import {
  addCategory,
  addIconCategory,
  deleteCategory,
  deleteIconCategory,
  getCategories,
  patchCategory,
} from '../api/category';
import { isAdmin } from '../middleware/is-admin';
import { isAuthorized } from '../middleware/is-authorized';

const router = Router({
  mergeParams: true,
});

router.get('/', async (req: Request, res: Response) => {
  try {
    res.send(await getCategories());
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when getting categories',
    });
  }
});

router.post('/:categoryId/:iconId', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    await addIconCategory(req.body.iconId, req.params.categoryId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when adding icon category',
    });
  }
});

router.post('/', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    await addCategory(req.body.category);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when adding category',
    });
  }
});

router.patch('/', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    res.send(await patchCategory(req.body.category as Partial<CategoryModel>));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when patching category',
    });
  }
});

router.delete('/:categoryId', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    await deleteCategory(req.params.categoryId as string);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when deleting category',
    });
  }
});

router.delete('/:categoryId/:iconId', isAuthorized, isAdmin, async (req: Request, res: Response) => {
  try {
    await deleteIconCategory(req.params.iconId, req.params.categoryId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when deleting icon category',
    });
  }
});

export { router as categoryRouter };
