import { Toast } from "antd-mobile";
import Compressor from "compressorjs";
import AV from "leancloud-storage";

AV.init({
  appId: "vToPA8oTWcdLHN5foUtAF5Jy-gzGzoHsz",
  appKey: "REOnycCNmfg6J8nhQNH0Tj61",
  serverURL: "https://vtopa8ot.lc-cn-n1-shared.com",
});

export function addCategoryItem(data) {
  return new Promise((resolve, reject) => {
    const Category = AV.Object.extend("Category");
    const category = new Category();

    category.set("userId", data.userId || "1");
    // notes.set("title", data.title);
    category.set("label", data.label);
    category.set("order", data.order || 1);

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
          })
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
    todo.set("label", data.label);
    todo.set("order", data.order || 1);

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
// -----------------------------------------
export async function updateNoteItem(data) {
  const note = AV.Object.createWithoutData("Notes", data.id);
  // note.set("title", data.title);
  note.set("description", data.description);
  note.set("dateValue", data.dateValue);
  note.set("fileList", data.fileList);
  await note.save();
  Toast.show({
    content: "修改成功",
  });
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
  Toast.show({
    content: "修改成功",
  });
  return result;
}
