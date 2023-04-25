export function prerenderActivity({ cid, doenetId, flags }) {
  let worker = new Worker("/_utils/prerenderWorker.js", { type: "module" });

  // console.log(`Prerendering activity`, cid, doenetId, flags, worker);

  worker.postMessage({
    messageType: "prerenderActivity",
    args: {
      cid,
      doenetId,
      flags,
    },
  });

  worker.onmessage = function (e) {
    if (e.data.messageType === "finished") {
      worker.terminate();
    } else if (e.data.messageType === "error") {
      console.error(e.data.message);
      worker.terminate();
    }
  };

  return worker;
}
