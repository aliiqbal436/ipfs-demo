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
  const key = window.localStorage.getItem("passPhrase");

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

  // const dycriptFile = async (cid) => {
  //   // console.log("encrypcidtedFile cid ===", cid);
  //   setLoading(true);
  //   const encryptedFile = await axios(
  //     `http://46.101.133.110:8080/api/v0/cat/${cid}`
  //   );

  //   console.log("encryptedFile ====", encryptedFile);

  //   // console.log("encryptedFile ===", encryptedFile.data);
  //   var decryptedFile = CryptoJS.AES.decrypt(encryptedFile.data, key).toString(
  //     CryptoJS.enc.Latin1
  //   );
  //   console.log("decrypted ====", decryptedFile);
  //   setImage(decryptedFile);
  //   setLoading(false);
  // };

  React.useEffect(() => {
    if (hash) {
      // dycriptFile(hash);
    }
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
       <img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACDVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////8nbP8obf8pbf8qbv8rb/8sb/8tcP8ucf8vcf8vcv8xc/8zdP81df81dv82dv83d/84eP85eP86ef87ev89e/8+fP8/fP9Aff9Bfv9Cfv9Df/9EgP9FgP9Ggf9Hgv9Jg/9LhP9Mhf9Nhv9Oh/9Ph/9RiP9Rif9Sif9Ui/9Vi/9WjP9Xjf9Yjf9aj/9dkf9ekf9ilP9jlf9llv9nl/9omP9rmv9sm/9tnP9vnf9wnv9yn/91of92ov93o/94o/98pv9/qP+Bqf+Cqv+Eq/+FrP+Hrf+Irv+Jr/+Kr/+Msf+Nsv+Stf+Ttf+Ttv+Utv+Vt/+WuP+XuP+Zuf+Zuv+hv/+kwf+lwv+mwv+nw/+oxP+pxP+pxf+qxf+rxv+yy/+0zP+1zf+3zv+4z/+60P+70f+90v+/0/+/1P/B1f/D1v/E1//F1//F2P/G2P/H2f/I2v/J2v/K2//L3P/P3v/Q3//R4P/S4P/V4v/V4//W4//X5P/Y5P/b5v/b5//c5//d6P/e6f/f6f/g6v/h6//j7P/k7f/l7f/m7v/q8f/r8f/u8//w9f/x9f/x9v/z9//0+P/2+f/3+f/3+v/4+v/5+//6/P/8/f/9/v/+/v////9uCbVDAAAAFXRSTlMABAU4Ozw9PpSWl5ilp6ip4+Tl/P6nIcp/AAAAAWJLR0SuuWuTpwAAAh5JREFUOMtjYGBgYOcXEl6HAYSF+FgZQICJex1OwMkEVIAi3+Xh1ozM5wKaj8xfpBwcITsbWYSNgR+JtzpJYvU6jbAVSEK8DEIITpOZqnxItISWfgVCTJAB7v4ZXpKRC9uMNCqXJci6TID7hQFMrV2zJE7abTKQFesDJGb7SYTOX7sGLAVWUKCgrGZcDeaDFaxb12alqC6XDlMwTyKnRLJ1HbKCddNEc0skJkAVdEssXatRiKqgVmLlatUqqILVpuaOEnLJy4GsIhONuHlAOldVwtJWcwnMDb2i4dPKdHVKV3uqRCdYqU9psVDOmh0vUQN35FTRhevWLU+V0FeZBdTtpSQRvgAoKtuMqmBdpKxvKYjXJ+o+cx0WBRPFO6ABHuesMheLghIdePiutc7AoqBLchZchVMSFgUr9HTS8sEgL1C0E1XBRNGUeeV6OlFONjbqSjY2Nv7mKjnzMyXqYQrW2OsYS8smLkOE5OpsFSkdQ6PlUAU9EgtXq6MFdZ3EkpVKNVAFc8TKW6QbURVMFK1slOyGuSFdUkLOoQtZwSRXaRmpKLgj1y1eMjdIImguTMHCCAnvGcuXQhIMPMl1O8hnrOy31GtfnaNi3oRIcohEu7ZY20DZK0DGTCV7NVKi5UVK40vDJVatU/dfgCTEw8AsgsSdLx+TKjUdOeMAsycnMr/BzrIcmc8ByrycuDMvByM4f7PyCmLL/gK8LEBJALYsGEdXEyupAAAAAElFTkSuQmCC"} width={500} />
      {message && <h1 style={{ color: "black" }}>{message}</h1>}
    </div>
  );
};

export default FileViewer;
