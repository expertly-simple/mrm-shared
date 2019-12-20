import { install, json, lines, packageJson } from "mrm-core";

import { addArrayProperty } from "./helpers";

export function configureCommonNpmPackages() {
  const commonNpm = ["cross-conf-env", "npm-run-all", "dev-norms", "rimraf"];
  install(commonNpm);
}

export function configureImportSort() {
  const importSortPackages = [
    "import-sort",
    "import-sort-cli",
    "import-sort-parser-typescript",
    "import-sort-style-module"
  ];

  install(importSortPackages);

  const pkg = packageJson();

  pkg
    .set("importSort", {
      ".ts, .tsx": {
        parser: "typescript",
        style: "module",
        options: {}
      }
    })
    .save();
}

export function configureTsLint() {
  const tslintPackages = ["tslint", "tslint-etc"];
  install(tslintPackages);

  addArrayProperty("tslint.json", "extends", "tslint-etc");

  json("tslint.json")
    .set("rules.no-unused-declaration", true)
    .set("rules.max-line-length", [false, 90])
    .set("rules.quotemark", [true, "single", "avoid-escape"])
    .set("rules.semicolon", [true, "never"])
    .save();
}

export function configurePrettier() {
  const prettierPackages = ["prettier"];
  install(prettierPackages);

  lines(".prettierignore", ["**/*.html"]).save();

  json(".prettierrc")
    .merge({
      tabWidth: 2,
      useTabs: false,
      printWidth: 90,
      semi: false,
      singleQuote: true,
      trailingComma: "es5",
      jsxBracketSameLine: true
    })
    .save();

  const pkg = packageJson();

  if (pkg.get("devDependencies.tslint")) {
    const prettierTslintPackages = [
      "tslint-config-prettier",
      "tslint-plugin-prettier"
    ];
    install(prettierTslintPackages);

    addArrayProperty("tslint.json", "extends", "tslint-config-prettier");
    addArrayProperty("tslint.json", "extends", "tslint-plugin-prettier");

    json("tslint.json")
      .set("rules.prettier", true)
      .save();
  }
}
