import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

import HeroSection from "./HeroSection";
import Navbar from "../common/Navbar";
import MyListings from "../../pages/Seller/showcase";

const SellerDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen ">
      <Navbar user={user} logout={logout} />
      <HeroSection />
      <MyListings/>
    </div>
  );
};

export default SellerDashboard;