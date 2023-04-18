const API_KEY = "382ab35a2cb8992429165e61055a7bd9";
const BASE = "https://api.themoviedb.org/3";

export type movieType = {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
};

export type getMoviTypes = {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: movieType[];
  total_pages: number;
  total_results: number;
};

export type TvTypes = {
  backdrop_path: string
  first_air_date: string
  genre_ids: number[];
  id: number;
  name: string
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string
  popularity: number
  poster_path: string
  vote_average: number
  vote_count: number
};

export type getTvTypes = {
  page: number;
  results: TvTypes[];
  total_pages: number;
  total_results: number;
}

export const getMovie = (type: string) => {
  return fetch(`${BASE}/movie/${type}?api_key=${API_KEY}&language=ko-KO`).then(
    (res) => res.json()
  );
};

export const getTv = (type: string) => {
  return fetch(
    `${BASE}/tv/${type}?api_key=${API_KEY}&language=en-US&page=1`
  ).then((res) => res.json());
};
