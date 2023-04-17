import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Tv from "./pages/Tv";
import Search from "./pages/Search";
import Header from "./components/Header";
//page componets
function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/movies/:id" element={<Home />}></Route>
          <Route path="/tv" element={<Tv />}></Route>
          <Route path="/search" element={<Search />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
