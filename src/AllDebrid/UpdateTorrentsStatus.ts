import { AllDebridAPI, logger } from '../Utils';
import Constants from '../Constants';
import { TorrentEntity, TorrentState } from '../Entities';

export class UpdateTorrentsStatus {
  public static async updateAllTorrentsStatus() {
    const api = new AllDebridAPI(Constants.ALLDEBRID_API_KEY);
    const torrentList = await TorrentEntity.find({ where: { state: TorrentState.DOWNLOADING } });
    // eslint-disable-next-line no-restricted-syntax
    for (const torrent of torrentList) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await api.getStatus(torrent.allDebridID);
        if (res !== false && res.status !== 'error') {
          if (res.data.magnets.statusCode === 4) {
            torrent.state = TorrentState.STALLED_DL;
            torrent.filename = res.data.magnets.filename;
            torrent.links = [];
            res.data.magnets.links.forEach((link) => {
              torrent.links.push(link.link);
            });
          }
          // eslint-disable-next-line no-await-in-loop
          await torrent.save();
        }
      } catch (err) {
        logger.error(err);
      }
    }
  }
}
