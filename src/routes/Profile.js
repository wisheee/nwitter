import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Nweet from "components/Nweet";

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
    <>
      <form onSubmit={onSubmit}>
        <input 
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onChange={onChange}
        />
        <button>Update Profile</button>
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      <div>
        {myNweets.map(myNweet => (
          <Nweet
            key={myNweet.id}
            nweetObj={myNweet}
            isOwner={true}
          />
        ))}
      </div>
    </>
  );
};
export default Profile;