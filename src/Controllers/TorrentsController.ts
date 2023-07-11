import {NextFunction, Request, Response} from 'express';
import { logger } from '../Utils';
import { CategoryEntity, CategoryJSON } from '../Entities';

export class TorrentsController {
  public static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  public static async postCreateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/createCategory]: Create new category');
      const existing = await CategoryEntity.findOne(
        { where: { category: (req.body as CategoryJSON).category } },
      );
      if (existing) {
        res.status(409).send();
        return;
      }
      const category = CategoryEntity.fromJSON((req.body as CategoryJSON));
      await category.save();
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }

  public static getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/info]: Get all info about torrents');
      res.status(200).send([]);
    } catch (err) {
      next(err);
    }
  }
}
