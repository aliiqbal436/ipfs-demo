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
import { create } from "ipfs-http-client";
import { ReactComponent as LaptopSvg } from "./assets/laptop.svg";
import ReactJson from "react-json-view";
import CryptoJS from "crypto-js";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";

const cluster = new Cluster("http://localhost:9094");
const client = create(new URL("http://127.0.0.1:5001"));

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
  const [fileToUpload, setFileToUpload] = useState();
  const [peersData, setPeersData] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [openShareModal, setShareModal] = useState(false);
  const [pinStatus, setPinStatus] = useState({});
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const key = "Ali Iqbal And Talha Kayani";
  const addFile = async () => {
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
        "replication-min": 0,
        "replication-max": 0,
      });
      console.log(cid);
      await dycriptFile(cid);
    };
    reader.readAsDataURL(fileToUpload);
  };

  const dycriptFile = async (cid) => {
    const encryptedFile = await axios(
      `http://localhost:8080/api/v0/cat/${cid}`
    );

    // console.log("encryptedFile ===", encryptedFile.data);
    var decryptedFile = CryptoJS.AES.decrypt(encryptedFile.data, key).toString(
      CryptoJS.enc.Latin1
    );
    console.log("decrypted ====", decryptedFile);
    setIpfsFiles([...ipfsFiles, { decryptedFile, cid }]);
  };

  const getPeerList = async () => {
    const peers = await cluster.peerList();
    setPeersData(peers);
    // setOpenStatusModal(true)
    console.log("peers ===", peers);
  };

  const readPin = async () => {
    const file = await client.cat(
      "bafybeiaonkvnfms2ui4blgg24dfehmmfcfoytycwzlpwtt3vrsnp3d3xiu"
    );
    console.log("peers ===", file);
  };

  const getPinStatus = async (cid) => {
    const status = await cluster.status(cid);

    setPinStatus(status);
    setOpenStatusModal(true);
  };

  const unPinFile = async (cid, index) => {
    const response = await cluster.unpin(cid);
    ipfsFiles.splice(index, 1);
    setIpfsFiles([...ipfsFiles]);
    console.log("ipfsFiles ====", ipfsFiles);
  };

  //   useEffect(() => {

  //     if(ipfsFiles.length > 0) localStorage.setItem('files', JSON.stringify(ipfsFiles));
  //     console.log('ipfsFiles ===', ipfsFiles)
  //   }, [ipfsFiles])

  //   useEffect(() => {
  //     const items = JSON.parse(localStorage.getItem('files'));
  //     console.log('items ====', items)
  //     setIpfsFiles(items)
  //   }, [])

  const onShare = (cid, index) => {
    const shareLink = `http://localhost:3000/file/${cid}`;
    setShareLink(shareLink);
    setShareModal(true);
  };

  useEffect(() => {
    // getPeersStat()
    getPeerList();
  }, []);

  return (
    <div className="App">
      <div className="app-design">
        <h3>Connected Nodes</h3>
        {/* {peersData.map((peer) => ( */}
        <Box className="laptop-grid">
          <Box className="laptop-card">
            <LaptopSvg />
            <Button variant="contained" sx={btnStyle}>
              Ali Laptop
            </Button>
          </Box>
          <Box className="laptop-card">
            <LaptopSvg />
            <Button variant="contained" sx={btnStyle}>
              Ali Laptop
            </Button>
          </Box>
        </Box>
        {/* ))} */}
      </div>
      <Modal open={openShareModal} onClose={() => setShareModal(false)}>
        <Box sx={style}>
          <CopyToClipboard text={shareLink} onCopy={() => alert("Copied")}>
            <Button variant="contained">{shareLink}</Button>
          </CopyToClipboard>
        </Box>
      </Modal>
      <div>
        <Modal open={openStatusModal} onClose={() => setOpenStatusModal(false)}>
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
          <Button variant="contained" onClick={() => addFile()} sx={btnStyle}>
            Upload File
          </Button>
        </div>
      </div>
      <ImageList sx={{ width: "100%", minHeight: 450 }} cols={6}>
        {/* {ipfsFiles.map((item, index) => ( */}
        <ImageListItem className="image-card">
          <img
            //   onClick={() => getPinStatus(item.cid)}
            src={
              "https://cdnwpedutorenews.gramedia.net/wp-content/uploads/2022/03/08154702/google.jpg"
            }
          />

          <Button
            variant="contained"
            color="error"
            className="error"
            sx={btnStyle2}
            //   onClick={() => unPinFile(item.cid, index)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            // onClick={() => onShare(item.cid, index)}
            sx={btnStyle2}
          >
            Share
          </Button>
        </ImageListItem>
        {/* ))} */}
      </ImageList>
    </div>
  );
}

export default Home;