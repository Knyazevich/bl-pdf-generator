import * as https from 'https';

class Request implements IRequest {
  public get(url: URL, params?: object) {
    return new Promise((resolve, reject) => {
      if (params) {
        for (const param in params) {
          if (Object.prototype.hasOwnProperty.call(params, param)) {
            // @ts-ignore
            url.searchParams.append(param, params[param]);
          }
        }
      }

      try {
        https.get(url, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(res.statusMessage));
          }

          res.setEncoding('utf8');
          const buffer: any[] = [];
          res.on('data', (chunk) => buffer.push(chunk));
          res.on('end', () => resolve(buffer.join()));
        });
      } catch (e) {
        reject(new Error(e));
      }
    });
  }
}

export default Request;
