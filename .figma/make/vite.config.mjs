import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const dependencies = {
  "https://unpkg.com/react@18.3.1/umd/react.development.js": {
    route: "/_figma_vendor/react.js",
    file: "react.js",
  },
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js": {
    route: "/_figma_vendor/react-dom.js",
    file: "react-dom.js",
  },
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js": {
    route: "/_figma_vendor/babel.js",
    file: "babel.js",
  },
  "https://unpkg.com/lenis@1.1.18/dist/lenis.min.js": {
    route: "/_figma_vendor/lenis.js",
    file: "lenis.js",
  },
};

const vendorDirectory = resolve(".figma/make/vendor");
const projectDirectory = resolve(".");
const require = createRequire(import.meta.url);
const Babel = require(resolve(vendorDirectory, "babel.js"));
const routes = new Map(
  Object.values(dependencies).map(({ route, file }) => [
    route,
    resolve(vendorDirectory, file),
  ]),
);

export default {
  plugins: [
    {
      name: "figma-local-runtime-dependencies",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return Object.entries(dependencies).reduce(
            (result, [remoteUrl, { route }]) =>
              result.replaceAll(remoteUrl, route),
            html,
          );
        },
      },
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const requestPath = decodeURIComponent(
            (request.url || "").split("?", 1)[0],
          );
          const vendorFile = routes.get(requestPath);
          if (vendorFile) {
            response.statusCode = 200;
            response.setHeader(
              "Content-Type",
              "text/javascript; charset=utf-8",
            );
            response.end(readFileSync(vendorFile));
            return;
          }

          if (requestPath.endsWith(".jsx")) {
            const sourceFile = resolve(`.${requestPath}`);
            if (sourceFile.startsWith(`${projectDirectory}/`)) {
              const compiled = Babel.transform(readFileSync(sourceFile, "utf8"), {
                filename: sourceFile,
                presets: [[Babel.availablePresets.react, { runtime: "classic" }]],
              }).code;

              response.statusCode = 200;
              response.setHeader(
                "Content-Type",
                "text/javascript; charset=utf-8",
              );
              response.end(compiled);
              return;
            }
          }

          next();
        });
      },
    },
  ],
};
