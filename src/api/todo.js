import { Toast } from "@nutui/nutui-react";
import AV from "leancloud-storage";

AV.init({
  appId: "vToPA8oTWcdLHN5foUtAF5Jy-gzGzoHsz",
  appKey: "REOnycCNmfg6J8nhQNH0Tj61",
  serverURL: "https://vtopa8ot.lc-cn-n1-shared.com",
});

export async function updateCategoryItemOrder(data) {
  try {
    const query = new AV.Query("Category");
    query.equalTo("userId", "1");
    const category = await query.find();
    category.forEach((item) => {
      item.set("order", data[item.id]);
    });
    const result = await AV.Object.saveAll(category);
    return result
      .map((n) => {
        return {
          ...n.attributes,
          id: n.id,
        };
      })
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    return [];
  }
}

export async function updateCategoryItem(data) {
  return new Promise(async (resolve, reject) => {
    const category = AV.Object.createWithoutData("Category", data.id);
    if (data.label.trim()) {
      category.set("label", data.label);
    }
    if (data.order) {
      category.set("order", data.order);
    }
    await category.save();
    resolve(true);
  });
}

export function addCategoryItem(data) {
  return new Promise((resolve, reject) => {
    const Category = AV.Object.extend("Category");
    const category = new Category();

    if (!data.label.trim()) {
      return;
    }

    category.set("userId", data.userId || "1");
    // notes.set("title", data.title);
    category.set("label", data.label);
    category.set("order", data.order || 99);

    category.save().then(
      (cate) => {
        console.log(`保存成功。objectId：${cate.id}`);
        resolve({
          ...cate.attributes,
          id: cate.id,
        });
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

export function queryAllCategory() {
  const query = new AV.Query("Category");
  query.equalTo("userId", "1");
  // query.get("68275067d3496c42466ad9c3").then
  return new Promise((resolve, reject) => {
    query
      .find()
      .then((category) => {
        // todo 就是 objectId 为 582570f38ac247004f39c24b 的 Todo 实例
        // const title = todo.get("title");
        // const priority = todo.get("priority");
        // // 获取内置属性
        // const objectId = todo.id;
        // const updatedAt = todo.updatedAt;
        // const createdAt = todo.createdAt;
        resolve(
          category.map((n) => {
            return {
              ...n.attributes,
              id: n.id,
            };
          }).sort((a, b) => a.order - b.order)
        );
      })
      .catch((err) => {
        console.log("error:", err);
      });
  });
}

export function addTodoItem(data) {
  return new Promise((resolve, reject) => {
    const Todo = AV.Object.extend("Todo");
    const todo = new Todo();

    todo.set("userId", data.userId || "1");
    todo.set("icon", data.icon || "~");
    todo.set("desc", data.desc || "");
    todo.set("date", data.date || "");
    todo.set("tagId", data.tagId || "");

    todo.save().then(
      (cate) => {
        console.log(`保存成功。objectId：${cate.id}`);
        resolve({
          ...cate.attributes,
          id: cate.id,
        });
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

export async function updateTodoItem(data) {
  const todo = AV.Object.createWithoutData("Todo", data.id);
  const { userId, icon, desc, date, tagId } = data;
  userId && todo.set("userId", userId);
  icon && todo.set("icon", icon);
  desc && todo.set("desc", desc);
  date && todo.set("date", date);
  tagId && todo.set("tagId", tagId);
  return await todo.save();
}

export function queryAllTodoItems() {
  const query = new AV.Query("Todo");
  query.equalTo("userId", "1");
  // query.get("68275067d3496c42466ad9c3").then
  return new Promise((resolve, reject) => {
    query
      .find()
      .then((item) => {
        // todo 就是 objectId 为 582570f38ac247004f39c24b 的 Todo 实例
        // const title = todo.get("title");
        // const priority = todo.get("priority");
        // // 获取内置属性
        // const objectId = todo.id;
        // const updatedAt = todo.updatedAt;
        // const createdAt = todo.createdAt;
        resolve(
          item.map((n) => {
            return {
              ...n.attributes,
              id: n.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log("error:", err);
      });
  });
}

export async function deleteTodoItem(id) {
  const todo = AV.Object.createWithoutData("Todo", id);
  return await todo.destroy();
}

export async function deleteCategoryAndChildren(id) {
  try {
    const category = AV.Object.createWithoutData("Category", id);
    await category.destroy();
    const query = new AV.Query("Todo");
    query.equalTo("userId", "1").equalTo("tagId", id);
    const todoItems = await query.find();
    return await AV.Object.destroyAll(todoItems);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCategoryAndTransferTo(id, newCateId) {
  try {
    const category = AV.Object.createWithoutData("Category", id);
    await category.destroy();
    const query = new AV.Query("Todo");
    query.equalTo("userId", "1").equalTo("tagId", id);
    const todoItems = await query.find();
    todoItems.forEach((item) => {
      item.set("tagId", newCateId);
    });
    return AV.Object.saveAll(todoItems);
  } catch (error) {
    console.log(error);
  }
}

// -----------------------------------------
export async function updateNoteItem(data) {
  const note = AV.Object.createWithoutData("Notes", data.id);
  // note.set("title", data.title);
  note.set("description", data.description);
  note.set("dateValue", data.dateValue);
  note.set("fileList", data.fileList);
  await note.save();
  Toast.show("修改成功");
}

export async function deleteNoteItem(id) {
  const todo = AV.Object.createWithoutData("Notes", id);
  return await todo.destroy();
}

export function addUser(data) {
  // 声明 class
  const User = AV.Object.extend("Users");
  // 构建对象
  const user = new User();

  // 为属性赋值
  // notes.set("title", data.title);
  user.set("name", data.name || "Jaydon");
  user.set("role", data.role || "");
  user.set("description", data.description || "");
  user.set("avatarUrl", data.avatarUrl || "");
  user.set("account", data.account || "123456");
  user.set("password", data.password || "123456");

  // 将对象保存到云端
  user.save().then(
    (u) => {
      // 成功保存之后，执行其他逻辑
      console.log(`保存成功。objectId：${u.id}`);
    },
    (error) => {
      // 异常处理
      console.log(error);
    }
  );
}

export async function getUserProfile(id) {
  const query = new AV.Query("Users");
  return new Promise((resolve) => {
    query
      .get(id)
      .then((user) => {
        // // 获取内置属性
        // const objectId = todo.id;
        // const updatedAt = todo.updatedAt;
        // const createdAt = todo.createdAt;
        resolve({
          ...user.attributes,
          id: user.id,
        });
      })
      .catch((err) => {
        console.log("error:", err);
      });
  });
}

export async function updateUserProfile(data) {
  const user = AV.Object.createWithoutData("Users", data.id);
  data.name && user.set("name", data.name);
  data.role && user.set("role", data.role);
  data.description && user.set("description", data.description);
  data.avatarUrl && user.set("avatarUrl", data.avatarUrl);
  data.account && user.set("account", data.account);
  data.password && user.set("password", data.password);
  const result = await user.save();
  Toast.show("修改成功");
  return result;
}
