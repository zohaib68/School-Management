import { TObjectWithPermitives } from "@/types/interfacesAndtypes/interafacesAndtypes";

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export const checkIfPermitivesExistsInObject = (obj: TObjectWithPermitives) => {
  let objToGiveBack: TObjectWithPermitives = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key]) objToGiveBack = { ...objToGiveBack, [key]: obj[key] };
  });

  return objToGiveBack;
};

export const queryParamsGenerator = (args: TObjectWithPermitives): string => {
  const purifiedObj = checkIfPermitivesExistsInObject(args);

  const keys = Object.keys(purifiedObj);

  let queryArgsStr = "";

  keys.forEach((key, index) => {
    const queryAppendSymbol = !index ? `?` : `&`;

    queryArgsStr = `${queryArgsStr}${queryAppendSymbol}${key}=${purifiedObj[key]}`;
  });

  return queryArgsStr;
};
