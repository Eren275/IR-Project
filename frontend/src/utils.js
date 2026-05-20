import { useEffect, useState } from "react";
import { apiUrl, apiRequest } from "./api/client.js";

export { apiUrl, apiRequest, parseDaysAhead, api } from "./api/client.js";

export function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setData(null);
      setError(null);
      return undefined;
    }

    let isMounted = true;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    apiRequest(url, { signal: controller.signal })
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch((err) => {
        if (isMounted && err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, tick, ...deps]);

  const refetch = () => setTick((n) => n + 1);

  return { data, loading, error, refetch };
}
