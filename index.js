#!/usr/bin/env node
import { parseArgs } from "node:util"
import meta from "./package.json" assert { type: "json" }
import { $ } from "execa"
import { writeFile } from "node:fs/promises"

/** @satisfies {import('node:util').ParseArgsConfig['options']} */
const options = {
    help: { type: "boolean" },
    version: { type: "boolean" }
}
const { positionals, values } = parseArgs({ options, allowPositionals: true })

if (values.help) {
  // prettier-ignore
  console.log(`generate-bundle-license ${meta.version}
Generates a LICENSE.md document using your project's LICENSE or existing
LICENSE.md document and all the licenses of 'bundleDependencies'.
${meta.homepage}

USAGE:
  generate-bundle-license
`);
}

const self = JSON.parse((await $`npm view file:. --json`).stdout)
const deps = new Set()
const listAll = JSON.parse((await $`npm list -a --json`).stdout)
console.debug("listAll", listAll)
function crawlListAll(name, value) {
    deps.add(`${name}@${value.version}`)
    for (const [name2, value2] of Object.entries(value.dependencies ?? {})) {
        crawlListAll(name2, value2)
    }
}
for (const [name, value] of Object.entries(listAll.dependencies ?? {})) {
    crawlListAll(name, value)
}
console.debug("deps", deps)

const addIndent = (x, n) => x.split(/\r?\n/g).map(x => " ".repeat(n) + x).join("\n")
const licenseT = (self, deps) => `${selfT(self)}

# Bundled dependency licenses

${deps.map(x => depT(x)).join("\n")}
`
const selfT = (self) => `# ${self.name}

${self.licenseText ? addIndent(self.licenseText, 4) : "_No license text available_"}`
const depT = (dep) => `<details><summary><h4>${dep.name}@${dep.version}</h4>

${dep.licenseText ? addIndent(dep.licenseText) : "_No license text available_"}

</details>`


const licenseMD = licenseT(self, deps)
await writeFile("LICENSE.md", licenseMD)
