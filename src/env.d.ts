/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "monaco-editor/esm/vs/editor/editor.main.js";

declare interface Window {
  client_id: string;
  client_secret: string;
}
declare module "vm-browserify" {
  const runInNewContext: (code: string) => EChartsOption;
}
