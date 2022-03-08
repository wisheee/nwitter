import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { 
  collection, 
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import styled from "styled-components";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    let isMounted = true;
    const q = query(
      collection(dbService, 'nweets'),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(q, snapshot => {
      const nweetArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (isMounted)
        setNweets(nweetArray);
    });
    return () => isMounted = false;
  }, []);

  return (
    <StyledInner>
      <NweetFactory userObj={userObj} />
      <div>
        {nweets.map(nweet => (
          <Nweet 
            key={nweet.id} 
            nweetObj={nweet} 
            isOwner={nweet.creatorId === userObj.uid} 
          />
        ))}
      </div>
    </StyledInner>
  );
};

const StyledInner = styled.div`
  width: 50rem;
`;

export default Home;