export async function snippetA(log: (msg: string) => void) {
  log("A");
  setTimeout(() => log("B"), 0);
  Promise.resolve().then(() => log("C"));
  log("D");
}

export async function snippetB(log: (msg: string) => void) {
  setTimeout(() => log("timeout 1"), 0);
  setTimeout(() => {
    log("timeout 2");
    Promise.resolve().then(() => log("promise inside timeout"));
  }, 0);
  setTimeout(() => log("timeout 3"), 0);
  Promise.resolve()
    .then(() => log("then 1"))
    .then(() => log("then 2"));
}

export async function snippetC(log: (msg: string) => void) {
  async function load() {
    log("load start");
    await null;
    log("load end");
  }
  log("script start");
  load();
  new Promise<void>((resolve) => {
    log("promise executor");
    resolve();
  }).then(() => log("promise then"));
  log("script end");
}
