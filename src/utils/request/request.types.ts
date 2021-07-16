import { AxiosResponse, AxiosInstance } from 'axios';

export interface RequestParams {
  [key: string]: any
}

export interface IAxiosInstance extends AxiosInstance {
  jsonp?: (url: string, options?: JsonpOptions) => Promise<AxiosResponse>
}

export interface JsonpOptions {
  param?: string | undefined;
  prefix?: string | undefined;
  name?: string | undefined;
  timeout?: number | undefined;
}

// interface options