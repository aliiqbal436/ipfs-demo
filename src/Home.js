import React, { useEffect, useState, useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Cluster } from "@nftstorage/ipfs-cluster";
import { useWorker, WORKER_STATUS } from "@koale/useworker";
// import MyWorker from "./fileWorker";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "./actions";

import {
  Input,
  Button,
  ImageList,
  ImageListItem,
  Modal,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { create } from "ipfs-http-client";
import { ReactComponent as LaptopSvg } from "./assets/laptop.svg";
import ReactJson from "react-json-view";
import CryptoJS from "crypto-js";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PassPhraseModal from "./PassPhraseModal";

const cluster = new Cluster("http://46.101.133.110:9094");
const client = create(new URL("http://46.101.133.110:5001"));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const btnStyle = {
  backgroundColor: "#088DCD",
  color: "white",
  boxShadow: 24,
  margin: "10px",
  mt: "40px",
  fontFamily: "Poppins",
  padding: "12px 24px",
  boxShadow: "none",
  "&:hover": { backgroundColor: "#1E6F9B", boxShadow: "none" },
};
const btnStyle2 = {
  backgroundColor: "#088DCD",
  color: "white",
  boxShadow: 24,
  mt: "10px",
  fontFamily: "Poppins",
  padding: "8px 16px",
  boxShadow: "none",
  "&:hover": { backgroundColor: "#1E6F9B", boxShadow: "none" },
  "&.error": {
    backgroundColor: "#ffc4c5",
    color: "#ba181b",
    boxShadow: "none",
  },
};

const addFileToIpfs = async (chunk, fileToUpload, key) => {
  console.log("cid ===", fileToUpload);

  return "cid";
};

// const numbers = [...Array(5000000)].map((e) => ~~(Math.random() * 1000000));
// const sortNumbers = (nums) => nums.sort();

const CHUNK_SIZE = (1024 * 1024) * 10; // 1MB


export function uploadFileSaga() {
  return {
    type: "UPLOAD_FILE",
  }
}

function Home() {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.fileReducers);

  const [ipfsFiles, setIpfsFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState();
  const [peersData, setPeersData] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [openShareModal, setShareModal] = useState(false);
  const [pinStatus, setPinStatus] = useState({});
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [fileArray, setFileArray] = useState([])
  // const [addFileIpfs] = useWorker(addFileToIpfs);

  const passPhrase = window.localStorage.getItem("passPhrase") || "";
  const cidsFromLocal = window.localStorage.getItem("cids")?.split(",") || [];
  const [key, setKey] = React.useState(passPhrase);
  const fileWorker = useMemo(
    () => new Worker(new URL("file.worker.js", import.meta.url)),
    []
  );

  useEffect(() => {
    // if (window.Worker) {
    fileWorker.onmessage = (e) => {
      console.log("fileWorker === onmessage", e.data);
      
    };
    // }
  }, [fileWorker]);

  const addFile = async () => {
    // 
    // if (window.Worker) {
    // fileWorker.postMessage({fileToUpload, key});

    // const { fileToUpload, key } = data;

    let offset = 0;
    let index = 0


    while (offset < fileToUpload.size) {
      const nextChunk = fileToUpload.slice(offset, offset + CHUNK_SIZE);
      console.log("offset ===", offset);
      fileWorker.postMessage({
        fileData: nextChunk,
        key,
        fileName: fileToUpload.name,
        index,
      });
      offset += CHUNK_SIZE;
      index++
    }

    // }

    // setLoading(true);

    //   addFileWorker(chunk, key, fileToUpload.name, CryptoJS).then((data) => console.log("data====", data))

    //   // console.log('cid ===', cid)

    //   // window.localStorage.setItem("cids", [...cidsFromLocal, cid]);
    //   // await dycriptFile(cid);
    //   // setLoading(false);
  };

  const dycriptFile = async (cid) => {
    const encryptedFile = await axios(
      `http://46.101.133.110:8080/api/v0/cat/${cid}`
    );

    // console.log("encryptedFile ===", encryptedFile.data);
    var decryptedFile = CryptoJS.AES.decrypt(encryptedFile.data, key).toString(
      CryptoJS.enc.Latin1
    );
    console.log("ipfsFiles testing--- ====", ipfsFiles);
    const isFileExist = ipfsFiles.find((f) => f.cid === cid);
    console.log("isFileExist testing--- ===", isFileExist, !isFileExist);
    if (!isFileExist) setIpfsFiles([...ipfsFiles, { decryptedFile, cid }]);
  };

  const decryptLocalStorageFiles = async (cid) => {
    const encryptedFile = await axios(
      `http://46.101.133.110:8080/api/v0/cat/${cid}`
    );

    var decryptedFile = CryptoJS.AES.decrypt(encryptedFile.data, key).toString(
      CryptoJS.enc.Latin1
    );
    return { decryptedFile, cid };
  };

  const getPeerList = async () => {
    const peers = await cluster.peerList();
    console.log("peers ====", peers);
    setPeersData(peers);
    // setOpenStatusModal(true)
    console.log("peers ===", peers);
  };

  // const readPin = async (cid) => {
  //   const file = await client.cat(cid);
  //   console.log("peers ===", file);
  // };

  const getPinStatus = async (cid) => {
    const status = await cluster.status(cid);

    setPinStatus(status);
    setOpenStatusModal(true);
  };

  const unPinFile = async (cid, index) => {
    const response = await cluster.unpin(cid);
    ipfsFiles.splice(index, 1);
    setIpfsFiles([...ipfsFiles]);
    cidsFromLocal.splice(index, 1);
    window.localStorage.setItem("cids", cidsFromLocal);
    console.log("ipfsFiles ====", ipfsFiles);
  };

  const onShare = (cid, index) => {
    const shareLink = `http://localhost:3000/file/${cid}`;
    setShareLink(shareLink);
    setShareModal(true);
  };

  const getAlreadyUploadedFiles = async () => {
    setImageLoading(true);
    const files = [];
    for (const cid of cidsFromLocal) {
      const decryptedFile = await decryptLocalStorageFiles(cid);
      const isFileExist = files.find((f) => f.cid === cid);

      if (!isFileExist) files.push(decryptedFile);
    }
    setIpfsFiles([...ipfsFiles, ...files]);
    setImageLoading(false);
  };

  useEffect(() => {
    getAlreadyUploadedFiles();
    getPeerList();
  }, []);

  return (
    <div className="App">
      {!passPhrase && !key ? (
        <PassPhraseModal openModal={true} setKey={setKey} />
      ) : (
        <div>
          <div className="app-design">
            <h3>Connected Nodes</h3>
            <Box className="laptop-grid">
              {peersData.map((peer) => (
                <Box className="laptop-card">
                  <LaptopSvg />
                  <Button variant="contained" sx={btnStyle}>
                    {peer.peerName}
                  </Button>
                </Box>
              ))}
            </Box>
          </div>
          <Modal open={openShareModal} onClose={() => setShareModal(false)}>
            <Box sx={style}>
              <CopyToClipboard text={shareLink} onCopy={() => alert("Copied")}>
                <Button variant="contained">{shareLink}</Button>
              </CopyToClipboard>
            </Box>
          </Modal>
          <div>
            <Modal
              open={openStatusModal}
              onClose={() => setOpenStatusModal(false)}
            >
              <Box sx={style}>{pinStatus && <ReactJson src={pinStatus} />}</Box>
            </Modal>
            <div className="upload-card">
              <Input
                type="file"
                onChange={(e) => {
                  console.log("files====", e.target.files);
                  setFileToUpload(e.target.files[0]);
                }}
              />
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              ></Box>
              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={() => addFile()}
                sx={btnStyle}
              >
                Upload File
              </LoadingButton>
            </div>
          </div>
          <ImageList sx={{ width: "100%", minHeight: 450 }} cols={6}>
            {/* {imageLoading && <h6>Loading Images...</h6>} */}
            {/* {ipfsFiles.map((item, index) => ( */}
            <ImageListItem className="image-card">
              {/* <img
                  onClick={() => getPinStatus(item.cid)}
                  src={item.decryptedFile}
                /> */}
              <img
                src={
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACDVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////8nbP8obf8pbf8qbv8rb/8sb/8tcP8ucf8vcf8vcv8xc/8zdP81df81dv82dv83d/84eP85eP86ef87ev89e/8+fP8/fP9Aff9Bfv9Cfv9Df/9EgP9FgP9Ggf9Hgv9Jg/9LhP9Mhf9Nhv9Oh/9Ph/9RiP9Rif9Sif9Ui/9Vi/9WjP9Xjf9Yjf9aj/9dkf9ekf9ilP9jlf9llv9nl/9omP9rmv9sm/9tnP9vnf9wnv9yn/91of92ov93o/94o/98pv9/qP+Bqf+Cqv+Eq/+FrP+Hrf+Irv+Jr/+Kr/+Msf+Nsv+Stf+Ttf+Ttv+Utv+Vt/+WuP+XuP+Zuf+Zuv+hv/+kwf+lwv+mwv+nw/+oxP+pxP+pxf+qxf+rxv+yy/+0zP+1zf+3zv+4z/+60P+70f+90v+/0/+/1P/B1f/D1v/E1//F1//F2P/G2P/H2f/I2v/J2v/K2//L3P/P3v/Q3//R4P/S4P/V4v/V4//W4//X5P/Y5P/b5v/b5//c5//d6P/e6f/f6f/g6v/h6//j7P/k7f/l7f/m7v/q8f/r8f/u8//w9f/x9f/x9v/z9//0+P/2+f/3+f/3+v/4+v/5+//6/P/8/f/9/v/+/v////9uCbVDAAAAFXRSTlMABAU4Ozw9PpSWl5ilp6ip4+Tl/P6nIcp/AAAAAWJLR0SuuWuTpwAAAh5JREFUOMtjYGBgYOcXEl6HAYSF+FgZQICJex1OwMkEVIAi3+Xh1ozM5wKaj8xfpBwcITsbWYSNgR+JtzpJYvU6jbAVSEK8DEIITpOZqnxItISWfgVCTJAB7v4ZXpKRC9uMNCqXJci6TID7hQFMrV2zJE7abTKQFesDJGb7SYTOX7sGLAVWUKCgrGZcDeaDFaxb12alqC6XDlMwTyKnRLJ1HbKCddNEc0skJkAVdEssXatRiKqgVmLlatUqqILVpuaOEnLJy4GsIhONuHlAOldVwtJWcwnMDb2i4dPKdHVKV3uqRCdYqU9psVDOmh0vUQN35FTRhevWLU+V0FeZBdTtpSQRvgAoKtuMqmBdpKxvKYjXJ+o+cx0WBRPFO6ABHuesMheLghIdePiutc7AoqBLchZchVMSFgUr9HTS8sEgL1C0E1XBRNGUeeV6OlFONjbqSjY2Nv7mKjnzMyXqYQrW2OsYS8smLkOE5OpsFSkdQ6PlUAU9EgtXq6MFdZ3EkpVKNVAFc8TKW6QbURVMFK1slOyGuSFdUkLOoQtZwSRXaRmpKLgj1y1eMjdIImguTMHCCAnvGcuXQhIMPMl1O8hnrOy31GtfnaNi3oRIcohEu7ZY20DZK0DGTCV7NVKi5UVK40vDJVatU/dfgCTEw8AsgsSdLx+TKjUdOeMAsycnMr/BzrIcmc8ByrycuDMvByM4f7PyCmLL/gK8LEBJALYsGEdXEyupAAAAAElFTkSuQmCC"
                }
                width={500}
              />

              {/* <Button
                  variant="contained"
                  color="error"
                  className="error"
                  sx={btnStyle2}
                  onClick={() => unPinFile(item.cid, index)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onShare(item.cid, index)}
                  sx={btnStyle2}
                >
                  Share
                </Button> */}
            </ImageListItem>
            {/* ))} */}
          </ImageList>
        </div>
      )}
    </div>
  );
}

export default Home;
