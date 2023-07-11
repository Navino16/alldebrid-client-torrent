import { Request, Response } from 'express';
import { logger } from '../Utils';

export class AppController {
  public static getWebApiVersion(req: Request, res: Response): Response {
    logger.debug('[Controllers/AppController.ts - GET /api/v2/app/webapiVersion]: Getting Web Api Version');
    return res.status(200).send('4.5.4');
  }

  public static getPreferences(req: Request, res: Response): Response {
    logger.debug('[Controllers/AppController.ts - GET /api/v2/app/preferences]: Getting Preferences');
    return res.status(200).send({
      save_path: '/downloads',
      max_ratio_enabled: false,
      max_ratio: -1,
      max_seeding_time_enabled: false,
      max_seeding_time: -1,
      max_ratio_act: 0,
      queueing_enabled: false,
      dht: true,
    });
  }
}
