import { Request, Response, Router } from 'express';
import Category from '../../db/models/category';
import {
  addCategory,
  addIconCategory,
  deleteCategory,
  deleteIconCategory,
  getCategories,
  patchCategory,
} from '../api/category';
import { isAdmin } from '../middleware/is-admin';

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

router.post('/:categoryId/:iconId', isAdmin, async (req: Request, res: Response) => {
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

router.post('/', isAdmin, async (req: Request, res: Response) => {
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

router.patch('/', isAdmin, async (req: Request, res: Response) => {
  try {
    res.send(await patchCategory(req.body.category as Partial<Category>));
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Error when patching category',
    });
  }
});

router.delete('/:categoryId', isAdmin, async (req: Request, res: Response) => {
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

router.delete('/:categoryId/:iconId', isAdmin, async (req: Request, res: Response) => {
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
