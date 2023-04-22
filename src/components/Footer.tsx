import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <Wrap>
      <Logo2>
        <img src={`${process.env.PUBLIC_URL}/logo2.png`} alt="" />
      </Logo2>
      <p>
        {new Date().getFullYear()} &copy; provide by wi hyang hoon Movie info
        Web Application
      </p>
    </Wrap>
  );
};

const Wrap = styled.footer`
  background-color: #000;
  text-align: center;
  padding: 50px;
`;

const Logo2 = styled.h1`
  margin-right: 50px;
  width: 95px;
  margin: 0 auto 50px auto;
  img {
    display: block;
    width: 100%;
  }
`;

export default Footer;
