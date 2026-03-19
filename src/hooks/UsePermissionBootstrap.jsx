"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchModules } from "../redux/modulesSlice";
import { fetchAccess } from "../redux/accessSlice";

export default function usePermissionBootstrap({
  token,
  userUuid,
  modulesLoaded,
  accessLoaded,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    if (!modulesLoaded) {
      dispatch(fetchModules());
    }

    if (userUuid && !accessLoaded) {
      dispatch(fetchAccess(userUuid));
    }
  }, [accessLoaded, dispatch, modulesLoaded, token, userUuid]);
}
