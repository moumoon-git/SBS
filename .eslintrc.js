/*
 * @Author: your name
 * @Date: 2020-12-07 17:52:27
 * @LastEditTime: 2020-12-17 15:29:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SBS\.eslintrc.js
 */
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: 'babel-eslint'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'no-underscore-dangle': 'off',
    'no-lonely-if': 'off',
    "linebreak-style": [0 ,"error", "windows"],
  },
};
