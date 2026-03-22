import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const mainDir = path.join(fileURLToPath(new URL(".", import.meta.url)), "..");
const gitRootResult = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
});
const gitRoot = gitRootResult.stdout?.trim();
if (!gitRoot || gitRootResult.status !== 0) {
    console.warn("husky-install: no git root, skipping");
    process.exit(0);
}
const huskyBin = path.join(mainDir, "node_modules", "husky", "bin.js");
const install = spawnSync(process.execPath, [huskyBin, "main/.husky"], {
    cwd: gitRoot,
    stdio: "inherit",
});
process.exit(install.status ?? 1);
