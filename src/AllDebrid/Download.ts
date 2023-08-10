import axios from 'axios';
import fs from 'fs/promises';
import { AllDebridAPI } from '../Utils';
import Constants from '../Constants';
import { TorrentEntity, TorrentState } from '../Entities';

export class Download {
  public static async downloadAllFilesFromReadyTorrents() {
    const api = new AllDebridAPI(Constants.ALLDEBRID_API_KEY);
    const torrentList = await TorrentEntity.find({ where: { state: TorrentState.STALLED_DL } });
    // eslint-disable-next-line no-restricted-syntax
    for (const torrent of torrentList) {
      // eslint-disable-next-line no-restricted-syntax
      for (const link of torrent.links) {
        // eslint-disable-next-line no-await-in-loop
        const response = await axios.get(link, { responseType: 'arraybuffer' });
        const fileData = Buffer.from(response.data, 'binary');
        // eslint-disable-next-line no-await-in-loop
        await fs.writeFile('./file.pdf', fileData);
      }
    }
  }
}
