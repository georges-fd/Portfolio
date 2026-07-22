import init, { WasmApp } from "./wasm_compiler.js";

init().then(() => {
  let textarea = document.getElementById("grammar");
  let app = new WasmApp(textarea.value);

  textarea.addEventListener("input", (_) => {
    app.update_shader(textarea.value);
  });
});
