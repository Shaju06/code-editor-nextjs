import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const cachedModule = localforage.createInstance({
  name: "cachedModule",
});

export const unpkgPathPlugin = (inputVal: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        };
      });

      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputVal,
          };
        } else {
          const cachedRes = await cachedModule.getItem<esbuild.OnLoadResult>(
            args.path
          );

          if (cachedRes) {
            return cachedRes;
          }

          const { data, request } = await axios.get(args.path);

          const fileType = args.path.match(/.css$/) ? "css" : "jsx";

          const contents =
            fileType === "css"
              ? `
    const style = document.createElement('style');
    style.innerText = '${data}';
    document.head.appendChild(style) 
    `
              : data;

          console.log(contents);

          const result: esbuild.OnLoadResult = {
            loader: "jsx",
            contents,
            resolveDir: new URL("./", request.responseURL).pathname,
          };

          await cachedModule.setItem(args.path, result);
          return result;
        }
      });
    },
  };
};
