import fs from "fs";
import path from "path";

// Directory to scan (adjust if your source code is elsewhere)
const scanDir = path.join(process.cwd(), "pages");

// Regex to detect hardcoded localhost URLs
const localhostRegex = /http:\/\/localhost(:\d+)?/g;

function scanFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanFiles(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".jsx") || entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      const content = fs.readFileSync(fullPath, "utf8");
      const matches = content.match(localhostRegex);
      if (matches) {
        console.log(`❌ Found hardcoded localhost in: ${fullPath}`);
        matches.forEach((m) => console.log(`   -> ${m}`));
      }
    }
  }
}

scanFiles(scanDir);
console.log("✅ Scan complete!");
