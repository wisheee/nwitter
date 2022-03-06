import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [attachment, setAttachment] = useState(null);
  const fileInput = useRef();
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment) {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      await uploadString(attachmentRef, attachment, 'data_url');
      attachmentUrl = await getDownloadURL(attachmentRef);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    };
    if (nweet === '' && attachmentUrl === '')
      return;
    await addDoc(collection(dbService, 'nweets'), nweetObj);
    setNweet('');
    onClearAttachment();
  };
  const onChange = (event) => {
    const {
      target: { value }
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files }
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result }
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };

  return (
    <form onSubmit={onSubmit}>
      <input 
        value={nweet}
        onChange={onChange}
        type="text" 
        placeholder="What's on your mind?" 
        maxLength={120} 
      />
      <input 
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={onFileChange}
      />
      <button>Nweet</button>
      {attachment && (
        <div>
          <img src={attachment} alt="preview" width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;