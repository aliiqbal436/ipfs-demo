// const crypto = require('crypto');
import CryptoJS from "crypto-js";

// const algorithm = "aes-256-cbc";

const key = "demo-encryption-files";

// const iv = crypto.randomBytes(16);

function encrypt(passPhrase) {
  console.log(
    "🚀 ~ file: encryption-decryption.js:11 ~ encrypt ~ passPhrase:",
    passPhrase
  );
  return CryptoJS.AES.encrypt(passPhrase, key).toString().replace("/", "-");
  //   let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  //   let encrypted = cipher.update(text);
  //   encrypted = Buffer.concat([encrypted, cipher.final()]);
  //   return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// var encrypted = encrypt("Hello World!");

function decrypt(encryptedPassPhrase) {
  return CryptoJS.AES.decrypt(encryptedPassPhrase, key).toString(
    CryptoJS.enc.Utf8
  );
}

// const decrypted = decrypt(encrypted);
// console.log("Decrypted Text: " + decrypted);
export { encrypt, decrypt };
