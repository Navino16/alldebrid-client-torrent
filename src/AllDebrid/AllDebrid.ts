import { CronJob } from 'cron';
import { logger } from '../Utils';
import { Upload } from './Upload';

export class AllDebrid {
  public static setupAllJobs() {
    logger.info('[AllDebrid.ts - setupAllJobs]: Setting up AllDebrid jobs');
    AllDebrid.setupUploadTorrentsJob();
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
}
