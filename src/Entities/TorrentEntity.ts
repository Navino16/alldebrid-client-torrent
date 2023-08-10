import {
  BaseEntity, Column, Entity, PrimaryColumn,
} from 'typeorm';
import { logger } from '../Utils';

export interface TorrentJSON {
  fileHash: string;
  category: string;
  originalName: string;
  filePath: string;
  state: TorrentState;
  allDebridID?: number;
}

export enum TorrentState {
  QUEUE_DL = 'queuedDL', // queuing is enabled and torrent is queued for download
  STALLED_DL = 'stalledDL', // torrent is being downloaded, but no connection were made
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

  @Column({ type: 'text', enum: TorrentState, default: TorrentState.QUEUE_DL })
  public state!: TorrentState | undefined;

  @Column({ type: 'integer', nullable: true })
  public allDebridID: number | undefined;

  @Column({ type: 'simple-array', nullable: true })
  public links!: string[];

  @Column({ nullable: true })
  public filename!: string;

  public static fromJSON(json: TorrentJSON) {
    logger.debug('[Entities/TorrentEntity.ts - fromJSON]: Transform JSON object into torrent entity');
    const torrent = new TorrentEntity();

    torrent.fileHash = json.fileHash;
    torrent.category = json.category;
    torrent.originalName = json.originalName;
    torrent.filePath = json.filePath;
    torrent.state = json.state;
    torrent.allDebridID = json.allDebridID;

    return torrent;
  }
}
