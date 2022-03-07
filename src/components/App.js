import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { updateProfile } from "firebase/auth";
import styled from "styled-components";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if (user) {
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          updateProfile: (args) => updateProfile(authService.currentUser, args)
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      updateProfile: (args) => updateProfile(user, args)
    });
  };

  return (
    <RootContainer>
      {init ? <AppRouter 
                refreshUser={refreshUser} 
                isLoggedIn={Boolean(userObj)} 
                userObj={userObj} 
              /> : 'Initializing...'}
      <Footer>&copy; {new Date().getFullYear()} Nwitter</Footer>
    </RootContainer>
  );
}

const RootContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Footer = styled.footer`
  margin-top: 2em;
  font-size: 1.3rem;
  color: #717883;
`;

export default App;
