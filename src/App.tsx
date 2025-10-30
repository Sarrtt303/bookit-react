import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
// import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/Home";
import ExperienceDetails from "./pages/ExperienceDetails";
import Checkout from "./pages/Checkout";
import BookingResult from "./pages/BookingResult";
// import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// // import BookingPage from './pages/BookingPage';
// import { Calendar } from "lucide-react";
// import ListingPage from "./pages/ListingPage";
// import BookingPage from "./pages/BookingPage";

// import Listings from "./pages/Listings";
// import Footer from "./components/Footer";


function App() {
  
  return (
    <Router>
      <div>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          
          {/* Booking Flow Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/experience/:id" element={<ExperienceDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/result" element={<BookingResult />} />

          
        </Routes>
        
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
