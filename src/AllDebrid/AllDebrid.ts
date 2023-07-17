import { CronJob } from 'cron';
import { logger } from '../Utils';
import { Upload } from './Upload';
import { UpdateTorrentsStatus } from './UpdateTorrentsStatus';

export class AllDebrid {
  public static setupAllJobs() {
    logger.info('[AllDebrid.ts - setupAllJobs]: Setting up AllDebrid jobs');
    AllDebrid.setupUploadTorrentsJob();
    AllDebrid.setupUpdateTorrentsStatusJob();
  }

  private static setupUploadTorrentsJob() {
    const job = new CronJob(
      '*/10 * * * * *',
      Upload.AddAllTorrents,
      null,
      false,
      'Europe/Paris',
    );
    job.start();
  }

  private static setupUpdateTorrentsStatusJob() {
    const job = new CronJob(
      '*/10 * * * * *',
      UpdateTorrentsStatus.updateAllTorrentsStatus,
      null,
      false,
      'Europe/Paris',
    );
    job.start();
  }
}
