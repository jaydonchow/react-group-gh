import { Toast } from "@nutui/nutui-react";
import Compressor from "compressorjs";
import AV from "leancloud-storage";

AV.init({
  appId: "vToPA8oTWcdLHN5foUtAF5Jy-gzGzoHsz",
  appKey: "REOnycCNmfg6J8nhQNH0Tj61",
  serverURL: "https://vtopa8ot.lc-cn-n1-shared.com",
});

export function addNoteItem(data) {
  // 声明 class
  const Notes = AV.Object.extend("Notes");
  // 构建对象
  const notes = new Notes();

  // 为属性赋值
  notes.set("userId", data.userId || "1");
  // notes.set("title", data.title);
  notes.set("description", data.description);
  notes.set("dateValue", data.dateValue);
  notes.set("fileList", data.fileList);

  // 将对象保存到云端
  notes.save().then(
    (note) => {
      // 成功保存之后，执行其他逻辑
      console.log(`保存成功。objectId：${note.id}`);
    },
    (error) => {
      // 异常处理
      console.log(error);
    }
  );
}

export function queryNotesByUserId() {
  const query = new AV.Query("Notes");
  query.equalTo("userId", "1");
  // query.get("68275067d3496c42466ad9c3").then
  return new Promise((resolve, reject) => {
    query
      .descending("dateValue")
      .find()
      .then((notes) => {
        // todo 就是 objectId 为 582570f38ac247004f39c24b 的 Todo 实例
        // const title = todo.get("title");
        // const priority = todo.get("priority");
        // // 获取内置属性
        // const objectId = todo.id;
        // const updatedAt = todo.updatedAt;
        // const createdAt = todo.createdAt;
        resolve(
          notes.map((n) => {
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
  user.set("systemConfig", data.systemConfig || {});

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
  // query.equalTo("userId", "1");

  return new Promise((resolve) => {
    query
      .get(id)
      // .find()
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
  data.systemConfig && user.set("systemConfig", data.systemConfig);
  const result = await user.save();
  // Toast.show("修改成功");
  return result;
}

export async function mockUpload(localFile) {
  return new Promise((resolve, reject) => {
    new Compressor(localFile, {
      quality: 0.2,
      success(result) {
        const finalFile = new File([result], result.name, { type: result.type });
        const file = new AV.File(finalFile.name, finalFile);
        file.save().then(
          (f) => {
            console.log(`文件保存完成`, f.url());
            resolve({
              url: f.url(),
            });
          },
          (error) => {
            // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
            console.log(error);
            reject(error);
          }
        );
      },
      error(err) {
        console.log(err.message);
        reject(err);
      },
    });
  });
}
