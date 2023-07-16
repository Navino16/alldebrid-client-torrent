import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs/promises';
import { logger } from '../Utils';
import {
  CategoryEntity, CategoryJSON, TorrentEntity, TorrentInfoJSON,
} from '../Entities';

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

  public static async getInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.debug('[Controllers/TorrentsController.ts - GET /api/v2/torrents/info]: Get all info about torrents');
      const torrentList = await TorrentEntity.find();
      const result: TorrentInfoJSON[] = [];
      torrentList.forEach((torrent) => {
        result.push({
          hash: torrent.fileHash,
          category: torrent.category,
          name: torrent.originalName,
          size: torrent.fileSize,
          progress: torrent.progress,
          eta: torrent.eta,
        });
      });
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  public static async postAdd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/add]: Adding new torrents');
      // eslint-disable-next-line no-restricted-syntax
      for (const file of (req.files as { [torrents: string]: Express.Multer.File[] }).torrents) {
        const newFilePath = `${file.path}.torrent`;
        // eslint-disable-next-line no-await-in-loop
        await fs.rename(file.path, newFilePath);
        const torrent = TorrentEntity.fromJSON({
          fileHash: file.filename,
          originalName: file.originalname,
          filePath: newFilePath,
        });
        // eslint-disable-next-line no-await-in-loop
        await torrent.save();
      }
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }

  public static async postDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/delete]: Deleting torrent');
      const { deleteFiles, hashes }: { deleteFiles: boolean, hashes: string } = req.body;
      const hashList = hashes.split('|');
      // eslint-disable-next-line no-restricted-syntax
      for (const hash of hashList) {
        // eslint-disable-next-line no-await-in-loop
        const torrent = await TorrentEntity.findOne({ where: { fileHash: hash } });
        if (torrent) {
          // TODO: Remove files if deleteFiles is true
          // eslint-disable-next-line no-await-in-loop
          await torrent.remove();
        }
      }
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
}
