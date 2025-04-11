import { createHeaders, poe2SearchUrl } from "./api";

import { getPoeSessionId } from "../utils/getPoeSessionId";
import { rateLimitWrapper } from "./rateLimitWrapper";

export const fetchItemIds = async (queryData: any) => {
  return rateLimitWrapper(
    async () =>
      await window.electron.api.request({
        url: poe2SearchUrl,
        method: "POST",
        headers: createHeaders(getPoeSessionId()),
        data: queryData,
      })
  );
};
