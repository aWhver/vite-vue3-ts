import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import querystring from 'querystring';
import jsonp from 'jsonp';
import { RequestParams } from './request.types';
import promisify from './promisify';

interface IAxiosInstance extends AxiosInstance {
  jsonp?: () => void
}

const instance: IAxiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
});

instance.jsonp = promisify(jsonp);

class Request {
  protected url: string = '';

  _data: RequestParams = {};

  constructor(url: string, headers?: AxiosRequestConfig["headers"], isJson?: boolean) {
    this.url = url;

    instance.interceptors.request.use((config) => {
      console.log(config);
      config.headers = { ...config.headers, ...headers };
      if (isJson) {
        config.headers['Content-type'] = 'application/json;charset=utf-8';
      }
      return config;
    });

    instance.interceptors.response.use(res => {
      return res;
    }, error => {
      console.log(error);
    });
  }

  data(postData: RequestParams) {
    this._data = postData;
    return this;
  }

  get() {
    let char = this.url.indexOf('?') > -1 ? '&' : '?';
    return instance.get(this.url + char + querystring.stringify(this._data));
  }

  post() {
    return instance.post(this.url, this._data);
  }

  put() {
    return instance.put(this.url, this._data);
  }
}

// requestFactory('').data().get();

function send(method: string, data: RequestParams, header?: AxiosRequestConfig["headers"]) {}

const requestFactory = function(url: string, headers?: AxiosRequestConfig["headers"], isJson?: boolean) {
  return new Request(url, headers || {}, isJson);
};

export default requestFactory;
