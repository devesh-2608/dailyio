import React from "react";
import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import Home from "./home";
import Dashboard from "./dashboard";
import Login from "./login";
import Signup from "./signup";
import Navbar from "./components/navbar";
import AboutUs from "./aboutus";
import Todo from "./todo";
import Games from "./games";
import Weather from "./weather";
import Stock from "./stock";
import News from "./news";
import CurrencyConverter from "./currencyconverter";
import UnitConverter from "./unitconverter";

const NavbarWrapper = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="with-navbar">
        {children}
      </main>
    </>
  );
};
const NoNavbarWrapper = ({ children }) => {
  return <main>{children}</main>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without navbar */}
        <Route path="/" element={<NoNavbarWrapper><Home /></NoNavbarWrapper>} />
        <Route path="/login" element={<NoNavbarWrapper><Login /></NoNavbarWrapper>} />
        <Route path="/signup" element={<NoNavbarWrapper><Signup /></NoNavbarWrapper>} />
        {/* Routes with navbar */}
        <Route path="/dashboard" element={<NavbarWrapper><Dashboard /></NavbarWrapper>} />
        <Route path="/todo" element={<NavbarWrapper><Todo /></NavbarWrapper>} />
        <Route path="/aboutus" element={<NavbarWrapper><AboutUs /></NavbarWrapper>} />
        <Route path="/games/*" element={<NavbarWrapper><Games /></NavbarWrapper>} />
        <Route path="/weather" element={<NavbarWrapper><Weather /></NavbarWrapper>} /> 
        <Route path="/stock" element={<NavbarWrapper><Stock /></NavbarWrapper>} />
        <Route path="/news" element={<NavbarWrapper><News /></NavbarWrapper>} />
        <Route path="/currencyconverter" element={<NavbarWrapper><CurrencyConverter /></NavbarWrapper>} />
        <Route path="/unitconverter" element={<NavbarWrapper><UnitConverter /></NavbarWrapper>} />
        
      </Routes>
    </Router>
  );
}

export default App;