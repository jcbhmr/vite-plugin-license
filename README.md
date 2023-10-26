# License plugin for Vite

<p align=center>
  <img src="">
</p>

## Installation

```sh
npm install -D vite-plugin-license
```

## Usage

```js
// vite.config.js
import { defineConfig } from "vite";
import license from "vite-plugin-license";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [license("inline")]
})
```

```
dist/
├── assets/
│   ├── index-d4e5f6.css  (with license header)
│   └── index-a1b2c3.js   (with license header)
└── index.html
```

```js
// vite.config.js
import { defineConfig } from "vite";
import license from "vite-plugin-license";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "node20",
    ssr: "index.js",
  },
  ssr: {
    noExternal: /^(?!node:)/,
  },
  plugins: [license("file")]
})
```

```
dist/
├── index.js
└── THIRD_PARTY_LICENSES.txt
```