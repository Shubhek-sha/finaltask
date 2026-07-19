import storybook from "eslint-plugin-storybook";
import baseConfig from "@forge/config/eslint";

export default [...baseConfig, ...storybook.configs["flat/recommended"]];
