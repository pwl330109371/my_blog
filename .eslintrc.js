/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2020-11-21 11:13:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "indent": ["error", 4],
    "quotes": [
        "error",
        "single",
        {
          "allowTemplateLiterals": true
        }
    ],
    "semi": [
        "error",
        "never"
    ],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "warn"
  }
};
