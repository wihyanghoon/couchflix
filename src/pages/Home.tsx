import React, { useState } from "react";
import { useQuery } from "react-query";
import { getMoviTypes, getMovie } from "../api";
import styled from "styled-components";
import { makImagePath } from "../utills";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { data, isLoading } = useQuery<getMoviTypes>(
    ["movie", "nowPlaying"],
    getMovie
  );
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isplay, setIsplay] = useState(false);

  const offset = 6;

  const next = () => {
    if (data) {
      if (isplay) {
        return;
      }
      toggle();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      console.log(maxIndex);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggle = () => setIsplay((prev) => !prev);
  

  const modalHandler = (id:number) =>{
    navigate(`/movies/${id}`)
  }
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={next}
            bg={makImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggle}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      bg={makImagePath(movie.backdrop_path, "w500")}
                      variants={BoxVariants}
                      whileHover={"hover"}
                      initial={"normal"}
                      transition={{ type: "tween" }}
                      onClick={() => modalHandler(movie.id)}
                    >
                      <Info variants={infoVariants} >
                        
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
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

const Slider = styled.div`
  position: relative;
  top: -200px;
`;

const Row = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  top: 0;
  cursor: pointer;
`;

const Box = styled(motion.div)<{ bg: string }>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  height: 200px;
  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4{
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth,
  },
};

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    transition: {
      delay: 0.5,
      type: "tween",
    },
    opacity: 1,
  },
};

export default Home;
