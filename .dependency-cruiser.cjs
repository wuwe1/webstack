/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-unresolvable",
      comment: "A rule cannot protect an import it cannot resolve.",
      severity: "error",
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true, viaOnly: { dependencyTypesNot: ["type-only"] } },
    },
    {
      name: "features-stay-independent",
      comment: "Move shared code down to components or lib.",
      severity: "error",
      from: { path: "^apps/(web|api)/src/features/([^/]+)/" },
      to: {
        path: "^apps/(web|api)/src/features/([^/]+)/",
        pathNot: "^apps/$1/src/features/$2/",
      },
    },
    {
      name: "features-do-not-import-routes",
      severity: "error",
      from: { path: "^apps/(web|api)/src/features/" },
      to: { path: "^apps/(web|api)/src/routes/" },
    },
    {
      name: "components-stay-generic",
      severity: "error",
      from: { path: "^apps/web/src/(components|lib)/" },
      to: { path: "^apps/web/src/(features|routes)/" },
    },
    {
      name: "web-imports-only-api-types",
      severity: "error",
      from: { path: "^apps/web/" },
      to: { path: "^apps/api/", dependencyTypesNot: ["type-only"] },
    },
    {
      name: "api-does-not-import-web",
      severity: "error",
      from: { path: "^apps/api/" },
      to: { path: "^apps/web/" },
    },
    {
      name: "packages-and-tooling-do-not-import-apps",
      severity: "error",
      from: { path: "^(packages|tooling)/" },
      to: { path: "^apps/" },
    },
    {
      name: "apps-and-packages-do-not-import-tooling",
      comment: "tooling/ only checks the repo. Nothing that ships may use it.",
      severity: "error",
      from: { path: "^(apps|packages)/" },
      to: { path: "^tooling/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: {
      path: "(node_modules|dist|fixtures|coverage|playwright-report|test-results|routeTree\\.gen\\.ts|^\\.claude/)",
    },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.depcruise.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["module", "main", "types"],
      extensions: [".ts", ".tsx", ".js", ".mjs", ".d.ts"],
    },
  },
}
