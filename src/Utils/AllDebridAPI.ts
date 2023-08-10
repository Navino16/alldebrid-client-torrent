import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import { logger } from './Logger';

export interface AllDebridOptions {
  url?: string;
  agent?: string;
}

export interface FileUploadForm {
  files: fs.ReadStream[]
}

export interface StatusEndpointQueryParams {
  id: number;
}

export interface InstantAvailabilityQueryParams {
  magnets: string[];
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

export interface AllDebridLinks {
  link: string;
  filename: string;
  size: number;
  files: any;
}
export interface AllDebridMagnet {
  id: number;
  filename: string;
  size: number;
  status: string;
  statusCode: number;
  downloaded: number;
  uploaded: number;
  seeders: number;
  downloadSpeed: number;
  uploadSpeed: number;
  uploadDate: number;
  completionDate: number;
  links: AllDebridLinks[];
}
export interface FileUploadResult {
  status: string;
  data: {
    files: AllDebridFile[]
  }
}

export interface StatusResult {
  status: string;
  data: {
    magnets: AllDebridMagnet
  }
}

export interface InstantAvailabilityMagnet {
  magnet: string;
  hash: string;
  instant: boolean;
  files: any;
}

export interface InstantAvailabilityResult {
  status: string;
  data: {
    magnets: InstantAvailabilityMagnet[];
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

  private async get(endpoint: string, params: StatusEndpointQueryParams | InstantAvailabilityQueryParams | null = null) {
    const url = this.options.url + endpoint;
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    if (params !== null) {
      axiosConfig.params = params;
    }
    axiosConfig.params.agent = this.options.agent;
    return axios.get(url, axiosConfig);
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

  public async getStatus(allDebridID: number | null = null) {
    try {
      let params = null;
      if (allDebridID !== null) {
        params = { id: allDebridID };
      }
      const res = await this.get('/magnet/status', params);
      return (res.data as StatusResult);
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  public async getInstantAvailability(hash: string) {
    try {
      const params = { magnets: [hash] };
      const res = await this.get('/magnet/instant', params);
      return (res.data as InstantAvailabilityResult);
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
}
