import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceDir = path.join(__dirname, "service");

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

const customFetchImport = `import { customFetch } from "@/service/customFetch";\n`;

walkSync(serviceDir, (filePath) => {
  if (filePath.endsWith(".ts") && !filePath.endsWith("customFetch.ts")) {
    let content = fs.readFileSync(filePath, "utf-8");
    if (content.includes("fetch(") || content.includes("fetch ")) {
      // Very basic replace of global fetch
      const origContent = content;
      // Replace fetch( with customFetch(
      content = content.replace(/\bfetch\(/g, "customFetch(");

      // Add import below imports or at top
      if (
        !content.includes(customFetchImport.trim()) &&
        content !== origContent
      ) {
        if (content.includes('"use server";')) {
          content = content.replace(
            '"use server";\n',
            '"use server";\n' + customFetchImport,
          );
        } else if (content.includes("'use server';")) {
          content = content.replace(
            "'use server';\n",
            "'use server';\n" + customFetchImport,
          );
        } else {
          content = customFetchImport + content;
        }
      }
      fs.writeFileSync(filePath, content, "utf-8");
    }
  }
});
