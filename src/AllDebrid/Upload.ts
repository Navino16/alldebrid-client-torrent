import { TorrentEntity, TorrentState } from '../Entities';
import { AllDebridAPI, logger } from '../Utils';
import Constants from '../Constants';

export class Upload {
  public static async AddAllTorrents() {
    const api = new AllDebridAPI(Constants.ALLDEBRID_API_KEY);
    const torrentList = await TorrentEntity.find({ where: { state: TorrentState.QUEUE_DL } });
    // eslint-disable-next-line no-restricted-syntax
    for (const torrent of torrentList) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await api.uploadFile(torrent.filePath);
        if (res !== false && res.status !== 'error') {
          torrent.allDebridID = res.data.files[0].id;
          torrent.state = TorrentState.DOWNLOADING;
          // eslint-disable-next-line no-await-in-loop
          await torrent.save();
        }
      } catch (err) {
        logger.error(err);
      }
    }
    // console.log(torrentList);
  }
}
