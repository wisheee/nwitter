import React from "react";
import { authService } from "fbase";
import {
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name }
    } = event;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  };

  return (
    <Inner>
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04aaff"}
        size="4x"
      />
      <AuthForm />
      <ButtonWrap>
        <Button name="google" onClick={onSocialClick} color="#ea4335">
          Continue with Google
          <FontAwesomeIcon
            icon={faGoogle}
          />
        </Button>
        <Button name="github" onClick={onSocialClick}>
          Continue with Github
          <FontAwesomeIcon
            icon={faGithub}
          />
        </Button>
      </ButtonWrap>
    </Inner>
  );
};

const Inner = styled.div`
  width: 35rem;
  text-align: center;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5rem;
`;

const Button = styled.button`
  height: 4rem;
  padding: 0 1.4rem;
  background-color: #fff;
  color: ${props => props.color || '#000'};
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  opacity: .8;
  transition: .3s;

  &:hover {
    opacity: 1;
  }

  svg {
    margin-left: 0.5rem;
  }
`;

export default Auth;