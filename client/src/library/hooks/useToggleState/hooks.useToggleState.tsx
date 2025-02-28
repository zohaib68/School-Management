"use client";
import React, { useState } from "react";

export const useToggleState = (): [
  {
    openToggleHandler: () => void;
    closeToggleHandler: () => void;
    inverseToggleHandler:()=>void;
  },
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [isToggled, setIsToggled] = useState(false);

  const openToggleHandler = () => setIsToggled(true);

  const closeToggleHandler = () => setIsToggled(false);

  const inverseToggleHandler = () => setIsToggled((prev) => !prev);

  return [
    { openToggleHandler, closeToggleHandler, inverseToggleHandler },
    isToggled,
    setIsToggled,
  ];
};
