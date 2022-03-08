import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    <StyledForm onSubmit={onSubmit}>
      <InputContainer>
        <input 
          value={nweet}
          onChange={onChange}
          type="text" 
          placeholder="What's on your mind?" 
          maxLength={120} 
        />
        <button>
          <FontAwesomeIcon
            icon={faArrowRight}
          />
        </button>
      </InputContainer>
      <StyledLabel htmlFor="attach-file">
        Add photos
        <FontAwesomeIcon
          icon={faPlus}
        />
      </StyledLabel>
      <input 
        id="attach-file"
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={onFileChange}
      />
      {attachment && (
        <ImageContainer>
          <figure style={{
            backgroundImage: `url(${attachment})`
          }}></figure>
          <button onClick={onClearAttachment}>
            Remove
            <FontAwesomeIcon
              icon={faTimes}
            />
          </button>
        </ImageContainer>
      )}
    </StyledForm>
  );
};

const StyledForm = styled.form`
  text-align: center;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  width: 50rem;
  height: 5rem;
  border: 1px solid #04aaff;
  border-radius: 3rem;
  
  input {
    padding-left: 2rem;
    padding-right: 5rem;
    width: 100%;
    border: none;
    border-radius: 3rem;
    color: #fff;
    background-color: transparent;
    font-size: 1.5rem;
  }

  button {
    position: absolute;
    top: 0;
    right: -0.1rem;
    width: 5rem;
    height: 100%;
    border: none;
    border-radius: 50%;
    color: #fff;
    background-color: #04aaff;
    cursor: pointer;
  }
`;

const StyledLabel = styled.label`
  display: inline-block;
  padding: 1em;
  font-size: 1.5rem;
  color: #04aaff;
  cursor: pointer;

  svg {
    margin-left: 0.5em;
  }

  & + input {
    display: none;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 8rem;
  
  figure {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 8rem;
    border-radius: 50%;
    overflow: hidden;
  }

  button {
    border: none;
    background-color: transparent;
    color: #04aaff;
    cursor: pointer;

    svg {
      margin-left: 0.5em;
    }
  }
`;

export default NweetFactory;