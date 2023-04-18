import React, { useState } from "react";
import { useQuery } from "react-query";
import { getMoviTypes, getMovie } from "../api";
import styled from "styled-components";
import { makImagePath, Types } from "../utills";
import {
  motion,
  AnimatePresence,
  animate,
  useViewportScroll,
} from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";
import Slider from "../components/Slider";

const Home = () => {
  const { data, isLoading } = useQuery<getMoviTypes>(
    ["movie", "nowPlaying"],
    () => getMovie("popular")
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bg={makImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <Section>
            <Slider type={Types.now_playing} />
            <Slider type={Types.popular} />
            <Slider type={Types.top_rated} />
            <Slider type={Types.upcoming} />
          </Section>
         
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bg: string }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1)),
    url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;

  @media screen and (max-width: 1024px){
    padding: 32px;
    min-height: 60vh;
  }
`;

const Title = styled.h2`
  font-size: 4.25rem;
  font-weight: 600;
  margin-bottom: 20px;

  @media screen and (max-width: 768px){
    font-size: 32px;
  }
`;

const Overview = styled.p`
  font-size: 21px;
  font-weight: 300;
  line-height: 1.5;
  width: 50%;

  @media screen and (max-width: 1024px){
    width: 100%;
  }

  @media screen and (max-width: 768px){
    font-size: 16px;
  }
`;

// 비디오 컨테이너
const Section = styled.section`
  width: 100%;
  margin-top: -200px;
  padding: 0px 60px;

  @media screen and (max-width: 1024px){
    padding: 0px 32px;
    margin-top: -50px;
  }
`;

export default Home;
