import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import UserDashboard from "./components/buyer/UserDashboard";
import SellerDashboard from "./components/seller/SellerDashboard";
import CreateListing from "./pages/Seller/CreateListing";
import SellerListings from "./pages/Seller/SellerListings";
import ListingDetails from "./pages/buyer/ListingDetails";
import ListingsPage from "./pages/buyer/ListingPage";
import NearbyListings from "./pages/buyer/NearByListing";
import BuyerRequests from "./pages/buyer/BuyerRequests";
import SellerRequests from "./pages/Seller/SellerRequests";
import Messages from "./pages/Messages";




function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;


  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Agar user seller hai
  if (user.role === "seller") {
    return (
      <Router>
       
        <Routes>
          <Route path="/Sellerdashboard" element={<SellerDashboard />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/profile" element={<Profile />} />
         <Route path="/messages" element={<Messages />} />

          <Route path="/seller/listings" element={<SellerListings />} />
        <Route path="/seller/requests" element={<SellerRequests />} />
          <Route path="*" element={<Navigate to="/Sellerdashboard" />} />
        </Routes>
      </Router>
    );
  }

  // Agar user buyer hai
  if (user.role === "buyer") {
    return (
      <Router>
        <Routes>
          <Route path="/Userdashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/Userdashboard" />} />
           <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/allListing" element={<ListingsPage/>}/>
          <Route path="/nearby" element={<NearbyListings />} />
          <Route path="/requests/buyer" element={<BuyerRequests />} />
          <Route path="/messages" element={<Messages />} />

        </Routes>
      </Router>
    );
  }

  return null;
}

export default App;