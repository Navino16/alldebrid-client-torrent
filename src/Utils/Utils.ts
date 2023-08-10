import type * as http from 'http';
import * as querystring from 'querystring';

export type BodyParserLikeRequest = http.IncomingMessage & { body: any };
export class Utils {
  public static fixRequestBody<TReq = http.IncomingMessage>(
    proxyReq: http.ClientRequest,
    req: TReq,
  ): void {
    const requestBody = (req as unknown as BodyParserLikeRequest).body;

    if (!requestBody) {
      return;
    }

    const contentType = proxyReq.getHeader('Content-Type') as string;
    const writeBody = (bodyData: string) => {
      // deepcode ignore ContentLengthInCode: bodyParser fix
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    };

    const handlerFormDataBodyData = (type: string, data: any) => {
      console.log(data);
      const boundary = type.replace(/^.*boundary=(.*)$/, '$1');
      let str = '';
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(data)) {
        str += `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
      }
      return str;
    };

    if (contentType && contentType.includes('application/json')) {
      writeBody(JSON.stringify(requestBody));
    }

    if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
      writeBody(querystring.stringify(requestBody));
    }

    if (contentType && contentType.includes('multipart/form-data')) {
      writeBody(handlerFormDataBodyData(contentType, requestBody));
    }
  }
}
