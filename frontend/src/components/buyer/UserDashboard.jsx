import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import Navbar from "../common/Navbar";

import ShowCase from "../../pages/buyer/Showcase";
import ReviewsPage from "./Review";
import HeroPage from "./HeroPage";


const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4e1dc] via-[#c9ece8] to-white">
      <Navbar user={user} logout={logout} />
      <HeroPage/>
      <ShowCase/>
      <ReviewsPage/>
    </div>
  );
};

export default UserDashboard;