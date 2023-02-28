import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Cluster } from "@nftstorage/ipfs-cluster";
import {
  Input,
  Button,
  ImageList,
  ImageListItem,
  Modal,
  Box,
  TextField,
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

function Home() {
  const [ipfsFiles, setIpfsFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState();
  const [peersData, setPeersData] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [openShareModal, setShareModal] = useState(false);
  const [pinStatus, setPinStatus] = useState({});
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const passPhrase = window.localStorage.getItem("passPhrase") || "";
  const cidsFromLocal = window.localStorage.getItem("cids")?.split(",") || [];
  const [key, setKey] = React.useState(passPhrase);
  const addFile = async () => {
    setLoading(true);
    const reader = new FileReader();
    let chunk = undefined;
    reader.onloadend = async (event) => {
      chunk = event.target.result;

      const encrypted = CryptoJS.AES.encrypt(chunk, key);
      console.log("encrypted ===", encrypted);
      let blob = new Blob([encrypted], {
        type: "data:application/octet-stream,",
      });
      var file = new File([blob], fileToUpload.name);

      const { cid } = await cluster.add(file, {
        "cid-version": 1,
        name: fileToUpload.name,
        local: true,
        recursive: true,
      });

      window.localStorage.setItem("cids", [...cidsFromLocal, cid]);
      await dycriptFile(cid);
      setLoading(false);
    };
    reader.readAsDataURL(fileToUpload);
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
    const files = [];
    for (const cid of cidsFromLocal) {
      const decryptedFile = await decryptLocalStorageFiles(cid);
      const isFileExist = files.find((f) => f.cid === cid);

      if (!isFileExist) files.push(decryptedFile);
    }
    setIpfsFiles([...ipfsFiles, ...files]);
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
            {ipfsFiles?.length === 0
              ? "Loading files..."
              : ipfsFiles.map((item, index) => (
                  <ImageListItem className="image-card">
                    <img
                      onClick={() => getPinStatus(item.cid)}
                      src={item.decryptedFile}
                    />

                    <Button
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
                    </Button>
                  </ImageListItem>
                ))}
          </ImageList>
        </div>
      )}
    </div>
  );
}

export default Home;
