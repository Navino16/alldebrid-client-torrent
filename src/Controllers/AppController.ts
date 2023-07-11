import { Request, Response } from 'express';
import { logger } from '../Utils';

export class AppController {
  public static getWebApiVersion(req: Request, res: Response): Response {
    logger.debug('[Controllers/AppController.ts - GET /app/webapiVersion]: Getting Web Api Version');
    return res.status(200).send('4.5.4');
  }
}
