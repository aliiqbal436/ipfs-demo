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

async function uploadToCluster(chunk, filename) {
  // console.log("uploadToCluster ====", filename);
  return cluster.add(chunk, {
    "cid-version": 1,
    // progress: (bytes) => {
    //   console.log(`Uploaded ${bytes}/${fileSize} bytes`);
    // },
    replicationFactorMax: 5,
    replicationFactorMin: 2,
    // onUploadProgress:(data) => {
    //   // console.log('data =====', data)
    //   var percentCompleted = Math.round((data.loaded * 100) / data.total)
    //   // console.log(`Uploaded ======= ${index}`, percentCompleted)
    //   // console.log(`Uploaded ${data.bytes/fileSize} bytes`);
    // },
    name: filename,
    //   local: true,
    //   recursive: true,
  });
}

function* uploadFile(action) {
  try {
    const { chunk, index, filename, fileSize } = action.payload;
    // console.log("chunk ====", chunk);
    // const userData = yield getApi();
    // console.log(`userData ====`, userData);

    const chunkData = yield uploadToCluster(chunk, filename);

    // console.log(`uploadFile data ====`, chunkData);
    // return data
    // console.log("clusterArray ====", clusterArray);

    // const returnArray = yield clusterArray.map((p) =>
    //   call(fetch, p.file, p.fileName, p.index)
    // );
    // return data;
    // console.log("returnArray ====", returnArray);
  } catch (e) {
    yield put({ type: "UPLOAD_FILE_STATUS", message: e.message });
  }
}

function* fileSaga() {
  yield takeEvery("UPLOAD_FILE", uploadFile);
}

export default fileSaga;
