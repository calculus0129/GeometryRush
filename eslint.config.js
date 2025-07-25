import { defineConfig, globalIgnores } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([globalIgnores([
    // "node_modules/**", // ignore node_modules
    ".config/*", // ignore config files.
    includeIgnoreFile(gitignorePath, "Imported .gitignore patterns")
])]);