import { ISectionInfo } from "@/types/sectionsModule/types.sectionsModule";
import React, { SetStateAction, useEffect, useState } from "react";
import { useFetch } from "../useFetch/hooks.useFetch";
import { AxiosResponse } from "axios";
import {
  IApiResponseInfo,
  TObjectWithPermitives,
} from "@/types/interfacesAndtypes/interafacesAndtypes";
import { queryParamsGenerator } from "@/library/helpers/library.helpers";

export interface IListSectionsApi {
  gradeId?: string;
}
export interface IUseListSectionapi {
  params: IListSectionsApi;
  fetchOnMount?: boolean;
}
export const useListSectionApi = ({
  params,
  fetchOnMount = true,
}: IUseListSectionapi): [
  ISectionInfo[],
  React.Dispatch<SetStateAction<ISectionInfo[]>>,
  () => Promise<AxiosResponse<IApiResponseInfo<ISectionInfo[]>, unknown>>
] => {
  const [data, setData] = useState<ISectionInfo[]>([]);

  const { fetchHandler } = useFetch();

  const fetchSectionsHandler = () => {
    console.log(
      params,
      "whatareParams",
      queryParamsGenerator(params as TObjectWithPermitives)
    );
    return fetchHandler<ISectionInfo[], undefined>({
      url: `/sections${queryParamsGenerator(params as TObjectWithPermitives)}`,
    });
  };

  useEffect(() => {
    if (fetchOnMount)
      fetchSectionsHandler().then((res) => setData(res?.data.data ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount]);

  return [data, setData, fetchSectionsHandler];
};
