import { useContainer, ACTION_MAP } from "@/component/hooks/useContainer";
import { isEmpty } from "@/utils";
import { useEffect, useState } from "react";

function useFreshData(fetchFn, type) {
  const { dispatch, store } = useContainer();
  const [count, setCount] = useState(0);

  const storeData = store[ACTION_MAP[type]];

  useEffect(() => {
    if (isEmpty(storeData)) {
      fetchFn().then((data) => {
        dispatch({
          type: type,
          payload: data,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      fetchFn().then((data) => {
        dispatch({
          type: type,
          payload: data,
        });
      });
    }
  }, [count]);

  const refresh = (freshData) => {
    if (freshData) {
      dispatch({
        type: type,
        payload: freshData,
      });
    } else {
      setCount(count + 1);
    }
  };

  return [storeData, refresh];
}

export default useFreshData;