import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => (
  <nav>
    <StyledUl>
      <li>
        <StyledLink to="/">
          <FontAwesomeIcon
            icon={faTwitter}
            color={"#04aaff"}
            size="2x"
          />
        </StyledLink>
      </li>
      <li>
        <StyledLink to="/profile">
          <FontAwesomeIcon
            icon={faUser}
            color={"#04aaff"}
            size="2x"
          />
          <span>{userObj.displayName}의 Profile</span>
        </StyledLink>
      </li>
    </StyledUl>
  </nav>
);

const StyledUl = styled.ul`
  display: flex;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  margin: 0 1em;
  padding: 1em;
  color: #fff;
  font-size: 1.4rem;
  text-decoration: none;

  span {
    margin-top: 0.5em;
  }
`;

export default Navigation;