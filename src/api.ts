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

export const getMovie = () => {
  return fetch(`${BASE}/movie/now_playing?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
};
