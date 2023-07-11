import { Request, Response } from 'express';
import { logger } from '../Utils';
import { CategoryEntity, CategoryJSON } from '../Entities';

export class TorrentsController {
  public static async getCategories(req: Request, res: Response): Promise<Response> {
    logger.debug('[Controllers/TorrentsController.ts - GET /api/v2/torrents/categories]: Getting categories');
    const result = {};
    const categories = await CategoryEntity.find();
    categories.forEach((category) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result[category.category] = {
        name: category.category,
        savePath: category.savePath,
      };
    });
    return res.status(200)
      .send(result);
  }

  public static async postCreateCategory(req: Request, res: Response): Promise<Response> {
    logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/createCategory]: Create new category');
    const existing = await CategoryEntity.findOne(
      { where: { category: (req.body as CategoryJSON).category } },
    );
    if (existing) {
      return res.status(409).send();
    }
    const category = CategoryEntity.fromJSON((req.body as CategoryJSON));
    await category.save();
    return res.status(200).send();
  }
}
