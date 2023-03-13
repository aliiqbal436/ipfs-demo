import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import CryptoJS from "crypto-js";
import { Cluster } from "@nftstorage/ipfs-cluster";
import { create } from "ipfs-http-client";
const client = create(new URL("http://46.101.133.110:5001"));

const cluster = new Cluster("http://46.101.133.110:9094");

const apiUrl = `https://jsonplaceholder.typicode.com/users`;
function getApi() {
  return fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
}

function uploadToCluster(file, filename, index) {
  client.add(file, {
    "cid-version": 1,
    progress: (bytes) => {
      console.log(`Uploaded ==== ${index} ${bytes}/${CHUNK_SIZE} bytes`);
    },
    name: filename,
    //   local: true,
    //   recursive: true,
  });
}

const CHUNK_SIZE = 1024 * 1024 * 20; // 1MB
console.log('CHUNK_SIZE ===', CHUNK_SIZE)
function* uploadFile(action) {
  try {
    console.log("action ====", action);
    const clusterArray = [];
    const cidArray = [];
    const { fileToUpload, key } = action.payload;
    let offset = 0;
    let index = 0;

    while (offset < fileToUpload.size) {
      const nextChunk = fileToUpload.slice(offset, offset + CHUNK_SIZE);
      console.log("offset ===", offset);

      //   const {fileData, key, fileName, index} = data;
      const reader = new FileReader();
      let chunk = undefined;
      reader.onload = function* (event) {
        chunk = event.target.result;
        // console.log("chunk ---", chunk);
        const encrypted = CryptoJS.AES.encrypt(chunk, key);
        // console.log("encrypted ===", encrypted);
        let blob = new Blob([encrypted], {
          type: "data:application/octet-stream,",
        });

        // console.log("encryypted blob ===", blob);

        var file = new File([blob], fileToUpload.name);
        console.log('file =====', file)
        // yield call(uploadToCluster, file, fileToUpload.name, index);
        // clusterArray.push({ file, fileName: fileToUpload.name, index });
        // console.log('file ====', file)
        // fork(uploadToCluster, file, fileToUpload.name, index);

        console.log("encryypted file ===", file);

        // self.postMessage({file, index});
      };

      reader.onloadend = reader.readAsDataURL(nextChunk);
      offset += CHUNK_SIZE;
      index++;
    }

    // console.log("clusterArray ====", clusterArray);

    // const returnArray = yield clusterArray.map((p) =>
    //   call(fetch, p.file, p.fileName, p.index)
    // );

    // console.log("returnArray ====", returnArray);
  } catch (e) {
    yield put({ type: "UPLOAD_FILE_STATUS", message: e.message });
  }
}

function* fileSaga() {
  yield takeEvery("UPLOAD_FILE", uploadFile);
}

export default fileSaga;
