import { IUserInfo } from "@/types/userModule/types.userModule";
import React, { SetStateAction, useEffect, useState } from "react";
import { useFetch } from "../useFetch/hooks.useFetch";
import { AxiosResponse } from "axios";
import {
  IApiResponseInfo,
  TObjectWithPermitives,
} from "@/types/interfacesAndtypes/interafacesAndtypes";
import { queryParamsGenerator } from "@/library/helpers/library.helpers";

export interface IListUsersApi {
  gradeId?: string;
  sectionId?: string;
}
export interface IUseListUsersApi {
  params: IListUsersApi;
  fetchOnMount?: boolean;
}
export const useListUsersApi = ({
  params,
  fetchOnMount = true,
}: IUseListUsersApi): [
  IUserInfo[],
  React.Dispatch<SetStateAction<IUserInfo[]>>,
  () => Promise<AxiosResponse<IApiResponseInfo<IUserInfo[]>, unknown>>
] => {
  const [data, setData] = useState<IUserInfo[]>([]);

  const { fetchHandler } = useFetch();

  const fetchUsersHandler = () => {
    return fetchHandler<IUserInfo[], undefined>({
      url: `/users${queryParamsGenerator(params as TObjectWithPermitives)}`,
    });
  };

  useEffect(() => {
    if (fetchOnMount)
      fetchUsersHandler().then((res) => setData(res?.data.data ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount]);

  return [data, setData, fetchUsersHandler];
};
