import React from "react";
import type { JSX } from "react";

export type TComponentProps<T extends keyof JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T> & { as: T };

export type TFetchingMethods = "PUT" | "PATCH" | "GET" | "POST";

export interface IApiResponseInfo<DataType> {
  message: string;
  data?: DataType;
}

export interface ILoginResponseInfo {
  accessToken: string;
}

export interface ILoginPayload {
  userName: string;
  password: string;
}

export type TBlockPositions =
  | "topCenter"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight"
  | "center"
  | "leftCenter"
  | "rightCenter";

export type TObjectWithPermitives = Record<
  string,
  string | null | undefined | number
>;

export interface ICounts {
  activeStudentsCount: number;
  activeTeachersCount: number;
  inActiveStudentsCount: number;
  studentsCount: number;
  inActiveTeachersCount: number;
  teachersCount: number;
}
