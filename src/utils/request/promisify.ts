// import jsonp from 'jsonp';
import { AxiosResponse } from 'axios';

export default function promisify(fn: any) {
  return function(...args: any) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      fn.call(null, ...args, (err: any, data: AxiosResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}
