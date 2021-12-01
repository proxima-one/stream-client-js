const path = require("path");
const { lstatSync, readdirSync } = require("fs");

const namespace = "@proximaone";
// get listing of packages in mono repo

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      //tsconfig: path.resolve("./tsconfig.json")
    }
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|e2e))\\.[jt]sx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
};

//throw new Error(JSON.stringify(module.exports.moduleNameMapper));
