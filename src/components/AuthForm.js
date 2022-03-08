import React, { useState } from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword
} from "firebase/auth";
import styled from "styled-components";

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth();
  const onChange = (event) => {
    const {
      target: { name, value }
    } = event;

    if (name === 'email')
      setEmail(value);
    else if (name === 'password')
      setPassword(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount(prev => !prev);

  return (
    <>
      <FormContainer onSubmit={onSubmit}>
        <Input 
          name="email"
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={onChange}
        />
        <Input 
          name="password"
          type="password" 
          placeholder="Password" 
          required 
          value={password} 
          onChange={onChange}
        />
        <Button type="submit" backgroundColor="#04aaff" color="#fff">
          {newAccount ? 'Create Account' : 'Sign In'}
        </Button>
        <ErrorContainer>{error}</ErrorContainer>
      </FormContainer>
      <TextButton onClick={toggleAccount} color="#04aaff">
        {newAccount ? 'Sign In' : 'Create Account'}
      </TextButton>
    </>
  );
};

const FormContainer = styled.form`
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 0.8rem;
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  border: none;
`;

const Button = styled.button`
  height: 4rem;
  padding: 0 1.4rem;
  background-color: ${props => props.backgroundColor || '#fff'};
  color: ${props => props.color || '#000'};
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  opacity: .8;
  transition: .3s;

  &:hover {
    opacity: 1;
  }
`;

const TextButton = styled.button`
  text-decoration: underline;
  font-size: 1.4rem;
  border: none;
  background-color: transparent;
  color: ${props => props.color || '#000'};
  cursor: pointer;
  opacity: .8;
  transition: .3s;

  &:hover {
    opacity: 1;
  }
`;

const ErrorContainer = styled.p`
  padding-top: 1em;
  font-size: 1.4rem;
  line-height: 1.2;
  color: #f44336;
`;

export default AuthForm;