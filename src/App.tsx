import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Tv from "./pages/Tv";
import Search from "./pages/Search";
import Header from "./components/Header";
import Helmet from './components/Helmet';
import Footer from "./components/Footer";
//page componets
function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Helmet />
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/movies/:type/:id" element={<Home />}></Route>
          <Route path="/tv" element={<Tv />}></Route>
          <Route path="/tv/:type/:id" element={<Tv />}></Route>
          <Route path="/search" element={<Search />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
