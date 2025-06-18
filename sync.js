const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
// 配置参数
const sourcePath = "E:\\Code\\react-group"; // 替换为源目录路径
const targetPath = "E:\\Code\\react-group-gh"; // 替换为目标目录路径
const whiteList = [".git", "node_modules", ".next", ".vscode", "out"]; // 白名单配置（相对路径）
// 创建命令行交互接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// 递归复制函数（支持白名单）
function copyRecursiveSync(src, dest, whiteList, currentRelPath = "") {
  const entries = fs.readdirSync(src);

  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of entries) {
    const entryRelPath = path.join(currentRelPath, entry);

    // 检查是否在白名单中
    if (whiteList.some((pattern) => entryRelPath === pattern || entryRelPath.startsWith(pattern + path.sep))) {
      continue;
    }

    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyRecursiveSync(srcPath, destPath, whiteList, entryRelPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 带超时的异步询问函数
function questionAsync(prompt, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      rl.close();
      reject(new Error("操作超时"));
    }, timeout);

    rl.question(prompt, (answer) => {
      clearTimeout(timer);
      resolve(answer.trim().toLowerCase());
    });
  });
}

function run() {
  (async () => {
    try {
      if (!fs.existsSync(sourcePath)) {
        console.error(`❌ 发生错误: sourcePath 不存在: ${sourcePath}`);
        process.exit(1);
      }
      if (!fs.existsSync(targetPath)) {
        console.error(`❌ 发生错误: targetPath 不存在: ${targetPath}`);
        process.exit(1);
      }

      // 第一阶段：更新源仓库
      console.log("🔄 正在更新源仓库...");
      execSync("git pull", { cwd: sourcePath, stdio: "inherit" });

      // 第二阶段：文件同步
      console.log("🚀 正在同步文件到目标目录...");
      copyRecursiveSync(sourcePath, targetPath, whiteList);
      console.log("✅ 文件同步完成！");

      // 用户确认阶段
      const answer = await questionAsync("➡️ 是否提交更改到目标仓库？【y/n】", 30000);

      if (answer === "y" || answer === "yes") {
        // 第三阶段：目标仓库操作
        console.log("🔨 正在提交目标仓库变更...");
        execSync("git add .", { cwd: targetPath, stdio: "inherit" });

        // try {
        //   execSync('git commit -m "自动同步: 来自源仓库的更新"', { cwd: targetPath, stdio: "inherit" });
        // } catch (commitError) {
        //   console.log("⚠️ 没有需要提交的内容");
        // }

        // console.log("🔄 更新目标仓库...");
        // execSync("git pull --no-rebase", { cwd: targetPath, stdio: "inherit" });

        // 可选：推送变更
        // execSync('git push', { cwd: targetPath, stdio: 'inherit' });
      } else {
        console.log("⏭️ 已跳过提交步骤");
      }

      console.log("✅ 操作完成！");
    } catch (error) {
      console.error("❌ 发生错误:", error);
      process.exit(1);
    } finally {
      rl.close();
    }
  })();
}

run();
