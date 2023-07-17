import {
  BaseEntity, Column, Entity, PrimaryColumn,
} from 'typeorm';
import { logger } from '../Utils';

export interface TorrentJSON {
  fileHash: string;
  category?: string;
  originalName: string;
  filePath: string;
  fileSize?: number;
  progress?: number;
  eta?: number;
  ratio?: number;
  state?: TorrentState;
  addedOn?: Date;
  allDebridID?: number;
}

export interface TorrentInfoJSON {
  hash: string;
  category?: string;
  name: string;
  size?: number;
  progress?: number;
  eta?: number;
  state?: TorrentState;
}

export enum TorrentState {
  ERROR = 'error', // some error occurred, applies to paused torrents, warning so failed download handling isn't triggered
  PAUSE_DL = 'pausedDL', // torrent is paused and has NOT finished downloading
  QUEUE_DL = 'queuedDL', // queuing is enabled and torrent is queued for download
  CHECKING_DL = 'checkingDL', // same as checkingUP, but torrent has NOT finished downloading
  CHECKING_UP = 'checkingUP', // torrent has finished downloading and is being checked. Set when `recheck torrent on completion` is enabled. In the event the check fails we shouldn't treat it as completed.
  CHECKING_RESUME_DATA = 'checkingResumeData', // torrent is checking resume data on load
  PAUSED_UP = 'pausedUP', // torrent is paused and has finished downloading:
  UPLOADING = 'uploading', // torrent is being seeded and data is being transferred
  STALLED_UP = 'stalledUP', // torrent is being seeded, but no connection were made
  QUEUED_UP = 'queuedUP', // queuing is enabled and torrent is queued for upload
  FORCED_UP = 'forcedUP', // torrent has finished downloading and is being forcibly seeded
  STALLED_DL = 'stalledDL', // torrent is being downloaded, but no connection were made
  MISSING_FILE = 'missingFiles', // torrent is missing files
  META_DL = 'metaDL', // torrent magnet is being downloaded
  FORCED_DL = 'forcedDL', // torrent is being downloaded, and was forced started
  FORCED_META_DL = 'forcedMetaDL', // torrent metadata is being forcibly downloaded
  MOVING = 'moving', // torrent is being moved from a folder
  DOWNLOADING = 'downloading', // torrent is being downloaded and data is being transferred
}

@Entity('Torrents')
export class TorrentEntity extends BaseEntity {
  @PrimaryColumn()
  public fileHash!: string;

  @Column({ type: 'text', nullable: true })
  public category!: string | undefined;

  @Column()
  public originalName!: string;

  @Column()
  public filePath!: string;

  @Column({ type: 'integer', nullable: true })
  public fileSize!: number | undefined;

  @Column({ type: 'integer', nullable: true })
  public progress!: number | undefined;

  @Column({ type: 'integer', nullable: true })
  public eta!: number | undefined;

  @Column({ type: 'integer', default: 0 })
  public ratio!: number | undefined;

  @Column({ type: 'text', enum: TorrentState, default: TorrentState.PAUSE_DL })
  public state!: TorrentState | undefined;

  @Column({ type: 'integer', default: () => 'CURRENT_TIMESTAMP' })
  public addedOn!: Date | undefined;

  @Column({ type: 'integer', nullable: true })
  public allDebridID: number | undefined;

  public static fromJSON(json: TorrentJSON) {
    logger.debug('[Entities/TorrentEntity.ts - fromJSON]: Transform JSON object into torrent entity');
    const torrent = new TorrentEntity();

    torrent.fileHash = json.fileHash;
    torrent.category = json.category;
    torrent.originalName = json.originalName;
    torrent.filePath = json.filePath;
    torrent.fileSize = json.fileSize;
    torrent.progress = json.progress;
    torrent.eta = json.eta;
    torrent.ratio = json.ratio;
    torrent.state = json.state;
    torrent.addedOn = json.addedOn;
    torrent.allDebridID = json.allDebridID;

    return torrent;
  }
}
