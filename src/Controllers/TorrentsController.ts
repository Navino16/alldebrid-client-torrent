import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs/promises';
import { createReadStream } from 'fs';
import parseTorrent from 'parse-torrent';
import * as ParseTorrentFile from 'parse-torrent-file';
import axios from 'axios';
import { AllDebridAPI, logger } from '../Utils';
import { TorrentEntity, TorrentState } from '../Entities';
import Constants from '../Constants';

export class TorrentsController {
  public static async postAdd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/add]: Adding new torrents');
      Constants.QBITTORRENT_COOKIES = req.headers.cookie ?? '';
      const api = new AllDebridAPI(Constants.ALLDEBRID_API_KEY);
      // eslint-disable-next-line no-restricted-syntax
      for (const file of (req.files as { [torrents: string]: Express.Multer.File[] }).torrents) {
        const newFilePath = `${file.path}.torrent`;
        // eslint-disable-next-line no-await-in-loop
        await fs.rename(file.path, newFilePath);
        // eslint-disable-next-line no-await-in-loop
        const torrentInfo = (parseTorrent(await fs.readFile(newFilePath)) as ParseTorrentFile.Instance);
        // eslint-disable-next-line no-await-in-loop
        const available = await api.getInstantAvailability(torrentInfo.infoHash ?? '');
        if (available && available.data.magnets[0].instant) {
          logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/add]: Torrent is available on AllDebrid');
          const torrent = TorrentEntity.fromJSON({
            fileHash: torrentInfo.infoHash ?? file.filename,
            category: req.body.category,
            originalName: file.originalname,
            filePath: newFilePath,
            state: TorrentState.QUEUE_DL,
          });
          // eslint-disable-next-line no-await-in-loop
          await torrent.save();
          res.status(200).send();
        } else {
          logger.debug('[Controllers/TorrentsController.ts - POST /api/v2/torrents/add]: Torrent is not available on AllDebrid, sending it to qBittorrent');
          // eslint-disable-next-line no-await-in-loop
          const result = await axios.post(`${Constants.QBITTORRENT_URL}/api/v2/torrents/add`, {
            torrents: [createReadStream(newFilePath)],
            category: req.body.category,
            paused: req.body.paused,
          }, {
            headers: {
              Cookie: Constants.QBITTORRENT_COOKIES,
              'Content-Type': 'multipart/form-data',
            },
          });
          res.status(result.status).send();
        }
      }
    } catch (err) {
      next(err);
    }
  }
}
