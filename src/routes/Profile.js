import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Nweet from "components/Nweet";
import styled from "styled-components";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [myNweets, setMyNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    navigate('/');
  };
  const getMyNweets = useCallback(async () => {
    const q = query(
      collection(dbService, 'nweets'),
      where('creatorId', '==', userObj.uid),
      orderBy('createdAt', 'desc')
    );
    const dbMyNweets = await getDocs(q);
    dbMyNweets.forEach(doc => {
      const nweet = {
        id: doc.id,
        ...doc.data()
      };
      setMyNweets(prev => [...prev, nweet]);
    });
  }, [userObj.uid]);
  useEffect(() => {
    getMyNweets();
  }, [getMyNweets]);
  const onChange = (event) => {
    const {
      target: { value }
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };

  return (
    <StyledInner>
      <StyledForm onSubmit={onSubmit}>
        <input 
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onChange={onChange}
        />
        <button type="submit">Update Profile</button>
        <button type="button" onClick={onLogOutClick}>Log Out</button>
      </StyledForm>
      <div>
        {myNweets.map(myNweet => (
          <Nweet
            key={myNweet.id}
            nweetObj={myNweet}
            isOwner={true}
          />
        ))}
      </div>
    </StyledInner>
  );
};

const StyledInner = styled.div`
  width: 50rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding-bottom: 5rem;
  border-bottom: 1px solid #fff;
  margin-bottom: 2rem;

  input {
    height: 5rem;
    border: 1px solid #04aaff;
    border-top-right-radius: 3rem;
    border-top-left-radius: 3rem;
    padding-left: 2rem;
    padding-right: 5rem;
    border: none;
    font-size: 1.5rem;
  }

  button {
    height: 5rem;
    color: #fff;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;

    &[type="submit"] {
      border-bottom-right-radius: 3rem;
      border-bottom-left-radius: 3rem;
      background-color: #04aaff;
    }

    &[type="button"] {
      margin-top: 2rem;
      border-radius: 3rem;
      background-color: #fd563d;
    }
  }
`;

export default Profile;