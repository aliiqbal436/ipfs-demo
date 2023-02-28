import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import { decryptFileViewerHash } from "../../helpers/helper";
import CryptoJS from "crypto-js";

const FileViewer = () => {
  const params = useParams();
  const { hash } = params;
  const [loading, setLoading] = React.useState(true);
  const [image, setImage] = React.useState(null);
  const [message, setMessage] = React.useState(null);

  const [fileDetails, setFileDetails] = React.useState({});
  const key = "Ali Iqbal And Talha Kayani";

  // const fetchFileDetails = async () => {
  //   try {
  //     setLoading(true);
  //     const fileDetailsResponse = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/fileShare/getFileShareByHash?sharedHash=${hash}`
  //     );

  //     const decryptedFileInformation = decryptFileViewerHash(
  //       fileDetailsResponse?.data?.fileInformation
  //     );

  //     if (decryptedFileInformation?.status !== "active") {
  //       setMessage("Access Denied");
  //       throw new Error("Authentication Failed! Access Denied");
  //     }
  //     setFileDetails(decryptedFileInformation);
  //   } catch (err) {
  //     console.error(
  //       "🚀 ~ file: fileViewer.js:23 ~ fetchFileDetails ~ err",
  //       err
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   var decrypted = CryptoJS.AES.decrypt(e.target.result, key).toString(
  //     CryptoJS.enc.Latin1
  //   );

  // const fileReaderFromIPFS = async () => {
  //   try {
  //     const ipfsFileResponse = await axios.get(fileDetails?.fileId?.url);

  //     const fileCipherText = ipfsFileResponse.data;

  //     const decryptedFile = CryptoJS.AES.decrypt(
  //       fileCipherText,
  //       fileDetails?.fileId?.passphrase
  //     ).toString(CryptoJS.enc.Latin1);

  //     setImage(decryptedFile);
  //   } catch (err) {
  //     console.log(
  //       "🚀 ~ file: fileViewer.js:47 ~ fileReaderFromIPFS ~ err",
  //       err
  //     );
  //   }
  // };


  const dycriptFile = async (cid) => {
    // console.log("encrypcidtedFile cid ===", cid);
    setLoading(true)
    const encryptedFile = await axios(
      `http://46.101.133.110:8080/api/v0/cat/${cid}`
    );

    console.log('encryptedFile ====', encryptedFile)

    // console.log("encryptedFile ===", encryptedFile.data);
    var decryptedFile = CryptoJS.AES.decrypt(encryptedFile.data, key).toString(
      CryptoJS.enc.Latin1
    );
    console.log("decrypted ====", decryptedFile);
    setImage(decryptedFile)
    setLoading(false)

  };

  React.useEffect(() => {
    if(hash) {
      dycriptFile(hash)
    };
  }, [hash]);

  // React.useEffect(() => {
  //   if (fileDetails?.fileId?.url) {
  //     fileReaderFromIPFS();
  //   }
  // }, [fileDetails]);


  return (
    <div>
      {loading && (
        <h3 style={{ color: "black" }}>
          please wait file is being processed...
        </h3>
      )}
      {image && <img src={image} width={500} />}
      {message && <h1 style={{ color: "black" }}>{message}</h1>}
    </div>
  );
};

export default FileViewer;
