import fs from "fs";
import path from "path";

const dist = path.resolve("dist");
const target = path.resolve("..");

if (!fs.existsSync(dist)) {
    console.error("dist-kansiota ei löydy. Aja ensin build.");
    process.exit(1);
}

for (const name of fs.readdirSync(dist)) {
    const from = path.join(dist, name);
    const to = path.join(target, name);
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true });
}

console.log("Kopioitu dist -> ylemmäs onnistuneesti");
