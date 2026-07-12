import { defineConfig, globalIgnores } from "eslint/config";
import { config as baseConfig } from "@repo/eslint-config/base";

const eslintConfig = defineConfig([
  ...baseConfig,
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "dist/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "generated/**",
    ".turbo/**",
  ]),
]);

export default eslintConfig;
