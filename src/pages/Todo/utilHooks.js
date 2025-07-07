import { queryAllCategory, queryAllTodoItems } from "@/api/todo";
import { calcCountdown } from "@/component/dateHelper";
import { useContainer } from "@/component/hooks/useContainer";
import { useEffect, useState } from "react";

function useCategoryStore() {
  const { dispatch, store } = useContainer();
  const [count, setCount] = useState(0);

  function fetchQueryAllCategory() {
    return new Promise((resolve, reject) => {
      queryAllCategory().then((res) => {
        const result = res.map((r) => {
          return {
            label: r.label,
            value: r.id,
            id: r.id,
          };
        });
        dispatch({
          type: "CATEGORY",
          payload: result,
        });
        resolve(result);
      });
    });
  }

  useEffect(() => {
    if (store.category.length === 0) {
      fetchQueryAllCategory();
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      fetchQueryAllCategory();
    }
  }, [count]);

  const refresh = (freshData) => {
    if (freshData) {
      dispatch({
        type: "CATEGORY",
        payload: freshData,
      });
    } else {
      setCount(count + 1);
    }
  };

  if (store.category) {
    return [store.category, refresh];
  } else {
    return [[], refresh];
  }
}

function useTodoItemStore() {
  const { dispatch, store } = useContainer();
  const [count, setCount] = useState(0);

  function fetchQueryAllTodoItems() {
    return new Promise((resolve, reject) => {
      queryAllTodoItems().then((res) => {
        const result = res
          .map((r) => {
            const { diff, isExpired } = calcCountdown(r.date);
            return {
              icon: r.icon,
              desc: r.desc,
              date: r.date,
              tagId: r.tagId,
              id: r.id,
              diffDay: diff,
              isExpired,
            };
          })
          .sort((a, b) => {
            return a.diffDay - b.diffDay;
          });
        dispatch({
          type: "TODO_ITEMS",
          payload: result,
        });
        resolve(result);
      });
    });
  }

  useEffect(() => {
    if (store.todoItems.length === 0) {
      fetchQueryAllTodoItems();
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      fetchQueryAllTodoItems();
    }
  }, [count]);

  const refresh = () => {
    setCount(count + 1);
  };

  if (store.todoItems) {
    return [store.todoItems, refresh];
  } else {
    return [[], refresh];
  }
}

export { useCategoryStore, useTodoItemStore };
