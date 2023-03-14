/* eslint-disable no-restricted-globals */
// import CryptoJS from "crypto-js";
// require { Cluster } from "@nftstorage/ipfs-cluster";


self.importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
);
// self.importScripts('../../node_module/@nftstorage/ipfs-cluster');
// const CHUNK_SIZE = 1024 * 1024; // 1MB

self.onmessage = ({ data }) => {
  // console.log("self.onmessage ===", self);
  // console.log("data.onmessage ===", data);
  const {fileData, key, filename, index, totalChunks, fileSize} = data;
  const reader = new FileReader();
  let fileChunk = undefined;
  reader.onloadend = async (event) => {
    console.log("event target ====", event.target)
    fileChunk = event.target.result;
    // console.log("fileChunk ---", fileChunk);
    const fileChunkDa = new File([fileChunk], filename);
    console.log("fileChunkDa ---", fileChunkDa);

    // const encrypted = self.CryptoJS.AES.encrypt(fileChunk, key);
    // // console.log("encrypted ===", encrypted);
    // let blob = new Blob([encrypted], {
    //   type: "data:application/octet-stream,",
    // });
    // // console.log("encryypted blob ===", blob);

    // const chunk = new File([blob], filename);
    // // console.log("chunk ===", chunk);
    // self.postMessage({filename: filename, chunk: chunk, index, totalChunks, fileSize})
    // console.log("encryypted file ===", file);
    // const { cid } = await cluster.add(file, {
    //   "cid-version": 1,
    //   name: fileToUpload.name,
    //   local: true,
    //   recursive: true,
    // });
    // console.log("cid ===", cid);
    // self.postMessage({file, index});
  };

  reader.readAsDataURL(fileData);

  // reader.readAsDataURL(fileToUpload);
};
