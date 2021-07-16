// import jsonp from 'jsonp';
export default function promisify(fn: any) {
  return function(...args: any) {
    return new Promise((resolve, reject) => {
      fn.call(null, ...args, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}
