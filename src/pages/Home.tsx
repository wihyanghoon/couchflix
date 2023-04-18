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
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)),
    url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Section = styled.section`
  width: 100%;
  min-height: 400px;
  margin-top: -200px;
  position: relative;
  h2 {
    font-size: 20px;
    font-weight: bold;
  }
`;

export default Home;
