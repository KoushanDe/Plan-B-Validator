import fs from "fs";
import path from "path";

const componentsDir = "./src/components";
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith(".tsx"));

files.forEach(fileName => {
  const file = path.join(componentsDir, fileName);
  let content = fs.readFileSync(file, "utf8");
  const regex = /([ \t]+)type="number"/g;
  let modified = false;
  content = content.replace(regex, (match, prefix) => {
    modified = true;
    let res = prefix + 'type="number"\n';
    res += prefix + 'onWheel={(e) => (e.target as HTMLElement).blur()}\n';
    res += prefix + 'onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}';
    return res;
  });
  if (modified) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
