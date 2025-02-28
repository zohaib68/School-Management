"use client";
import { BACKEND_APP_URL } from "@/constants/constants";
import {
  IApiResponseInfo,
  TFetchingMethods,
} from "@/types/interfacesAndtypes/interafacesAndtypes";

import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from "axios";
import { getCookie } from "../../helpers/library.helpers";

export interface IFetchingArgs<PayloadType> {
  url: string;
  payload?: PayloadType;
  config?: AxiosRequestConfig<unknown>;
  method?: TFetchingMethods;
}

export const apiClient = axios.create({ baseURL: BACKEND_APP_URL });

const pendingRequests = new Map<string, Canceler>();

apiClient.interceptors.request.use((config) => {
  const token = getCookie("token");

  console.log(token, "whatistoken");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

apiClient.interceptors.response.use((res) => {
  console.log(res.status, "statusText");

  // if (token) config.headers.Authorization = `Bearer ${token}`;

  return res;
});

apiClient.interceptors.request.use((config) => {
  const key = `${config.method}:${config.url}`;
  if (pendingRequests.has(key)) {
    const cancel = pendingRequests.get(key);
    cancel?.();
  }

  config.cancelToken = new axios.CancelToken((cancel) => {
    pendingRequests.set(key, cancel);
  });

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const key = `${response.config.method}:${response.config.url}`;
    pendingRequests.delete(key);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useFetch = () => {
  const methods: Record<
    TFetchingMethods,
    <ResponseType, PayloadType>(
      args: IFetchingArgs<PayloadType>
    ) => Promise<AxiosResponse<IApiResponseInfo<ResponseType>>>
  > = {
    GET: <ResponseType, PayloadType>(args: IFetchingArgs<PayloadType>) =>
      apiClient.get<IApiResponseInfo<ResponseType>>(args?.url),
    PATCH: <ResponseType, PayloadType>(args: IFetchingArgs<PayloadType>) =>
      apiClient.patch<IApiResponseInfo<ResponseType>>(
        args.url,
        args.payload,
        args.config
      ),
    POST: <ResponseType, PayloadType>(args: IFetchingArgs<PayloadType>) =>
      apiClient.post<IApiResponseInfo<ResponseType>>(
        args.url,
        args.payload,
        args.config
      ),
    PUT: <ResponseType, PayloadType>(args: IFetchingArgs<PayloadType>) =>
      apiClient.put<IApiResponseInfo<ResponseType>>(
        args.url,
        args.payload,
        args.config
      ),
  };

  const fetchHandler = <ResponseType, PayloadType>({
    method = "GET",
    ...rest
  }: IFetchingArgs<PayloadType>) => {
    return methods[method]<ResponseType, PayloadType>({ ...rest });
  };

  return { fetchHandler };
};
