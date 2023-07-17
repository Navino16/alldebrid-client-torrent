import axios from 'axios';
import fs from 'fs';
import { logger } from './Logger';

export interface AllDebridOptions {
  url?: string;
  agent?: string;
}

export interface FileUploadForm {
  files: fs.ReadStream[]
}

export interface AllDebridFile {
  file: string;
  error?: {
    code: 'MAGNET_INVALID_FILE' | 'MAGNET_MUST_BE_PREMIUM' | 'MAGNET_NO_SERVER' | 'MAGNET_TOO_MANY_ACTIVE' | 'MAGNET_FILE_UPLOAD_FAILED';
    message: string;
  }
  name?: string;
  size?: number;
  hash?: string;
  ready?: boolean;
  id: number;
}
export interface FileUploadResult {
  status: string;
  data: {
    files: AllDebridFile[]
  }
}

export class AllDebridAPI {
  private readonly apiKey: string;

  private options: AllDebridOptions = {};

  constructor(apiKey: string, options: AllDebridOptions = {}) {
    this.apiKey = apiKey;
    this.options.url = options.url || 'https://api.alldebrid.com/v4';
    this.options.agent = options.agent || 'Datsite';
  }

  private async post(endpoint: string, form: FileUploadForm) {
    const url = this.options.url + endpoint;
    return axios.post(url, form, {
      params: {
        agent: this.options.agent,
      },
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public async uploadFile(filePath: string): Promise<FileUploadResult | false> {
    try {
      const res = await this.post('/magnet/upload/file', {
        files: [fs.createReadStream(filePath)],
      });
      return (res.data as FileUploadResult);
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
}
