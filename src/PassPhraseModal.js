import React from "react";

const PassPhraseModal = ({ openModal, setKey }) => {
  const [passPhrase, setPassPhrase] = React.useState("");

  const passPhraseAlreadyInLocalStorage =
    window.localStorage.getItem("passPhrase");
  const handlePassphrase = (event) => {
    const { value } = event?.target;
    setPassPhrase(value);
  };

  const handlePassphraseSubmit = () => {
    if (!passPhraseAlreadyInLocalStorage) {
      window.localStorage.setItem("passPhrase", passPhrase);
      setKey(passPhrase);
      return;
    }

    alert("Pass-phrase already added");
  };
  return (
    // <Modal
    //   aria-labelledby="transition-modal-title"
    //   aria-describedby="transition-modal-description"
    //   open={openModal}
    //   //   onClose={handleClose}
    //   //   closeAfterTransition
    //   //   slots={{ backdrop: Backdrop }}
    //   //   slotProps={{
    //   //     backdrop: {
    //   //       timeout: 500,
    //   //     },
    //   //   }}
    // >
    <div>
      <h2 id="modal-title">Enter your pass-phrase</h2>
      <input type={"password"} value={passPhrase} onChange={handlePassphrase} />
      <button onClick={handlePassphraseSubmit}>Submit Pass-Phrase</button>
    </div>

    // </Modal>
  );
};

export default PassPhraseModal;
