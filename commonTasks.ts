import { addArrayProperty, setScripts } from "./helpers";
import { install, json, lines, packageJson } from "mrm-core";

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

export function configurePRTemplate() {
    if(!lines('pull_request_template.md').exists) {
      lines('pull_request_template.md').set([
        '# Feature/Change Description',
        '',
        '_Describe changes made here, link to any issue that is addressed_',
        '',
        '# Developer Checklist',
        '',
        '- [ ] Updated documentation or README.md',
        '- [ ] If adding new feature(s), added and ran unit tests',
        '- [ ] If create new release, bumped version number',
        '- [ ] Ran `npm run style:fix` for code style enforcement',
        '- [ ] Ran `npm run lint:fix` for linting',
        '- [ ] Ran `npm audit` to discover vulnerabilities',
      ]
      )
    }
  }
  
  export function configureInitEnv() {
    install(['init-dev-env'])
  
    if(!lines('example.env').exists()) {
      lines('example.env').set([
        '/* Document required environment variables for .env file here',
        '   Execute npm run init:env to generate a .env file from example',
        '   Ensure .env file is included in .gitignore */',
        'MY_VAR=defaultValue'
      ])
    }
    
    const pkg = packageJson();
    setScripts(pkg, {
      "init:env": "init-dev-env generate-dot-env example.env -f"
    })
  }
  