import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { getTvTypes, getTv } from "../api";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { makImagePath, tvTypes } from "../utills";
import { useRecoilState } from "recoil";
import { offestState } from "../atom";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { BiXCircle } from "react-icons/bi";

const TvSlider = ({ type }: { type: tvTypes }) => {
  // 리액트쿼리
  const { data, isLoading } = useQuery<getTvTypes>(["tv", type], () =>
    getTv(type)
  );

  console.log(data?.results[0]);

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
    document.body.style.overflowY = "hidden";
    navigate(`/tv/${type}/${id}`);
    // 여기로 보내야 카테고리별로 하나만 나옴 지금 현재 홈에서 Silder 자체를 랜더링중임
    // 여기로 가도 어차피 home 이 다시 랜더링 되고 슬라이더도 랜더링됨
    // 그럼 라우터 매치를 하고 id 값이 같을테니 모달창이 랜더링됨
  };

  const close = () => {
    document.body.style.overflowY = "auto";
    navigate("/tv");
  };
  return (
    <>
      <Section>
        <h2>{type.toUpperCase()}</h2>
        <Prev className="btn" onClick={prev}>
        </Prev>
        <Next className="btn" onClick={next}>
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
            />
            <Modal layoutId={type + paramId}>
                <Close onClick={close}/>
              {movieInfo && (
                <>
                  <ModalBg bg={makImagePath(movieInfo.backdrop_path)}></ModalBg>
                  <img src={makImagePath(movieInfo.poster_path)} alt="" />
                  <div>
                    <h4>{movieInfo.name}</h4>
                    <ul>
                      <li>
                        개봉일 | {movieInfo.first_air_date} | 평점 | ⭐️{" "}
                        {movieInfo.vote_average}
                      </li>
                    </ul>
                    <p>{movieInfo.overview}</p>
                  </div>
                </>
              )}
            </Modal>
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
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    .btn {
      opacity: 1;

      &:hover{
        color: black;
      }
    }
  }
`;

const Close = styled(BiXCircle)`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 30px;
  right: 30px;
`

const Prev = styled(GoChevronLeft)`
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 1;
  left: 0;
  top: 50%;
  transform: translate(0, -60%);
`;

const Next = styled(GoChevronRight)`
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 1;
  right: 0;
  top: 50%;
  transform: translate(0, -60%);
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
  aspect-ratio: 16/10;
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
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 99;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 12rem;
  left: 0px;
  right: 0px;
  margin: 0px auto;
  width: 50%;
  height: 75%;
  overflow: auto;
  border-radius: 1.5rem;
  background-color: rgb(47, 47, 47);
  color: rgb(255, 255, 255);
  z-index: 100;
  &::-webkit-scrollbar {
    display: none;
  }

  img {
    display: block;
    max-width: 400px;
    width: 100%;
    margin: -100px auto;
  }

  div {
    text-align: center;
    h4 {
      margin-top: 120px;
      font-size: 28px;
      font-weight: 500;
    }
    ul li {
      display: block;
      margin-top: 16px;
    }

    p {
      width: 50%;
      margin: 0 auto;
      margin-top: 15px;
      font-size: 18px;
      padding: 16px 16px 32px 16px;
    }
  }

  @media screen and (max-width: 1024px) {
    & {
      width: 100%;
      img {
        width: calc(100% - 32px);
      }
      div {
        p {
          width: 100%;
        }
      }
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
