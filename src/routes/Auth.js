import React, { useState } from "react";
import { authService } from "fbase";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup
} from "firebase/auth";

const Auth = () => {
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
    <div>
      <form onSubmit={onSubmit}>
        <input 
          name="email"
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={onChange}
        />
        <input 
          name="password"
          type="password" 
          placeholder="Password" 
          required 
          value={password} 
          onChange={onChange}
        />
        <button type="submit">{newAccount ? 'Create Account' : 'Sign In'}</button>
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </span>
      <div>
        <button name="google" onClick={onSocialClick}>Continue with Google</button>
        <button name="github" onClick={onSocialClick}>Continue with Github</button>
      </div>
    </div>
  );
};
export default Auth;