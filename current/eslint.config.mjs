import eslintJs from "@eslint/js";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslintJs.configs.recommended,
  ...tsEslint.configs.strict,
  ...tsEslint.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "no-throw-literal": ["error"],
      "prefer-promise-reject-errors": ["error"]
    }
  }
);
