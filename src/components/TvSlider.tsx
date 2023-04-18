import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { getTvTypes, getTv } from "../api";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { makImagePath, tvTypes } from "../utills";
import { useRecoilState } from "recoil";
import { offestState } from "../atom";

const TvSlider = ({ type }: { type: tvTypes }) => {
  // 리액트쿼리
  const { data, isLoading } = useQuery<getTvTypes>(["tv", type], () =>
    getTv(type)
  );

  console.log(data?.results[0].name);

  // 리액트라우터
  const moviePathMatch = useMatch(`/tv/${type}/:id`);

  // 리코일 아톰
  const [offset, setOffset] = useRecoilState(offestState);

  useEffect(() => {
    const responsive = () => {
      if (window.innerWidth <= 768) {
        setOffset(2);
      } else if (window.innerWidth <= 1024) {
        setOffset(3);
      } else {
        setOffset(6);
      }
    };

    window.addEventListener("resize", responsive);

    return () => {
      window.removeEventListener("resize", responsive);
    };
  }, [setOffset, window]);

  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [isplay, setIsplay] = useState(false);
  const [isRight, setIstRight] = useState(0);
  const { id: paramId } = useParams();

  const movieInfo =
    paramId && data?.results.find((movie) => String(movie.id) === paramId);

  // 슬라이드 핸들러
  const next = () => {
    if (data) {
      if (isplay) return;
      setIstRight(1);
      toggle();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      console.log(maxIndex);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const prev = () => {
    if (data) {
      if (isplay) {
        return;
      }
      setIstRight(-1);
      toggle();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggle = () => setIsplay((prev) => !prev);

  const modalHandler = (id: number) => {
    navigate(`/tv/${type}/${id}`);
    // 여기로 보내야 카테고리별로 하나만 나옴 지금 현재 홈에서 Silder 자체를 랜더링중임
    // 여기로 가도 어차피 home 이 다시 랜더링 되고 슬라이더도 랜더링됨
    // 그럼 라우터 매치를 하고 id 값이 같을테니 모달창이 랜더링됨
  };

  const close = () => {
    navigate("/tv");
  };
  return (
    <>
      <Section>
        <h2>{type.toUpperCase()}</h2>
        <Prev className="btn" onClick={prev}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
          </svg>
        </Prev>
        <Next className="btn" onClick={next}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
          </svg>
        </Next>
        <TvSliders>
          <AnimatePresence
            initial={false}
            onExitComplete={toggle}
            custom={isRight}
          >
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              className={index + type}
              key={index + type}
              custom={isRight}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    layoutId={type + movie.id}
                    key={type + movie.id}
                    bg={makImagePath(movie.backdrop_path)}
                    variants={BoxVariants}
                    whileHover={"hover"}
                    initial={"normal"}
                    transition={{ type: "tween" }}
                    onClick={() => modalHandler(movie.id)}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </TvSliders>
      </Section>
      <AnimatePresence>
        {moviePathMatch ? (
          <>
            <Ovaray
              onClick={close}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Modal
                style={{ transform: "translate(-50%, -50%)" }}
                layoutId={type + paramId}
              >
                {movieInfo && (
                  <div>
                    <ModalBg
                      bg={makImagePath(movieInfo.backdrop_path)}
                    ></ModalBg>
                    <img src={makImagePath(movieInfo.poster_path)} alt="" />
                    <div>
                      <h4>{movieInfo.name}</h4>
                      <p>{movieInfo.overview}</p>
                    </div>
                  </div>
                )}
              </Modal>
            </Ovaray>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

const Section = styled.section`
  width: 100%;
  height: auto;
  position: relative;
  margin-bottom: 40px;
  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  .btn {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover {
    .btn {
      opacity: 1;
    }
  }
`;

const Prev = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 1;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
`;

const Next = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 1;
  right: 0;
`;

const TvSliders = styled.div`
  position: relative;
  min-height: 200px;
`;

const Row = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  top: 0;
  cursor: pointer;

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Box = styled(motion.div)<{ bg: string }>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  height: 200px;
  border-radius: 10px;
  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
  border-radius: 0px 0px 10px 10px;
`;

const Ovaray = styled(motion.div)`
  width: 100%;
  min-height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled(motion.div)`
  max-width: 950px;
  min-height: 500px;
  background-color: #2c2c2c;
  border-radius: 20px;
  overflow: hidden;
  padding: 25px;
  > div {
    > div {
      h4 {
        font-size: 31px;
      }

      p {
        font-size: 24px;
        margin-top: 20px;
      }
    }
    img {
      width: 50%;
      display: block;
      margin-top: -30%;
    }
  }
`;

const ModalBg = styled.div<{ bg: string }>`
  width: 100%;
  background: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  aspect-ratio: 16/9;
`;

const rowVariants = {
  hidden: (isRight: number) => {
    return {
      x: isRight === 1 ? window.innerWidth + 5 : -window.innerWidth - 5,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (isRight: number) => {
    return {
      x: isRight === 1 ? -window.innerWidth - 5 : window.innerWidth + 5,
    };
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

export default TvSlider;
