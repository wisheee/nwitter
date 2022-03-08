import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');
    if (ok) {
      await deleteDoc(doc(dbService, 'nweets', nweetObj.id));
      if (nweetObj.attachmentUrl !== '')
        await deleteObject(ref(storageService, nweetObj.attachmentUrl));
    }
  };
  const toggleEditing = () => setEditing(prev => !prev);
  const onChange = (event) => {
    const {
      target: { value }
    } = event;
    setNewNweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, 'nweets', nweetObj.id), {
      text: newNweet
    });
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <form onSubmit={onSubmit}>
          <InputContainer>
            <input 
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={onChange}
            />
            <button>
              <FontAwesomeIcon
                icon={faPencilAlt}
              />
            </button>
          </InputContainer>
        </form>
      ) : (
        <StyledNweet>
          {nweetObj.attachmentUrl && (
            <figure style={{
              backgroundImage: `url(${nweetObj.attachmentUrl})`
            }}></figure>
          )}
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <ButtonContainer>
              <button onClick={onDeleteClick}>
                <FontAwesomeIcon
                  icon={faTrash}
                />
              </button>
              <button onClick={toggleEditing}>
                <FontAwesomeIcon
                  icon={faPencilAlt}
                />
              </button>
            </ButtonContainer>
          )}
        </StyledNweet>
      )}
    </div>
  );
};

const InputContainer = styled.div`
  position: relative;
  display: flex;
  margin-top: 1.5rem;
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

const StyledNweet = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 1em;
  padding: 2em 1.5em;
  border-radius: 1em;
  font-size: 1.5rem;
  background-color: #fff;
  color: #000;

  figure {
    flex-shrink: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 5em;
    height: 5em;
    margin-right: 1em;
    border-radius: 50%;
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
    overflow: hidden;

    & + h4 {
      width: 80%;
    }
  }

  h4 {
    width: 100%;
    word-break: keep-all;
    word-wrap: break-word;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding-top: 0.5em;
  padding-right: 1em;

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 1.3rem;
    padding: 0.5em;
  }
`;

export default Nweet;