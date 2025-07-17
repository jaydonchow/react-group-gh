import { getUserProfile } from "@/api";
import { queryAllCategory, queryAllTodoItems } from "@/api/todo";
import { useContainer } from "@/component/hooks/useContainer";
import useFreshData from "@/component/hooks/useFreshData";
import { calcCountdown } from "@/utils";

function useCategoryStore() {
  return useFreshData(() => {
    return new Promise((resolve, reject) => {
      queryAllCategory().then((res) => {
        const result = res.map((r) => {
          return {
            label: r.label,
            value: r.id,
            id: r.id,
          };
        });
        resolve(result);
      });
    });
  }, "CATEGORY");
}

function useTodoItemStore() {
  return useFreshData(() => {
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
        resolve(result);
      });
    });
  }, "TODO_ITEMS");
}

function useUserDataStore() {
  return useFreshData(() => {
    return new Promise((resolve, reject) => {
      getUserProfile("6829eee2d3496c42467ade3f").then((user) => {
        resolve(user);
      });
    });
  }, "USER_DATA");
}

export { useCategoryStore, useTodoItemStore, useUserDataStore };
