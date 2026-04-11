import CustomerProfile from "./Customer_profile";
import FindTailor from "./FindTailor";
import RateAndReview from "./RateAndReview";
import ProfileTailor from "./Tailor_profile";
import Profile_Page from "./Profile_Page";
import Index from "./Index";
import NavBar from "./NavBar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* Index page — standalone, no NavBar */}
      <Route path="/" element={<Index />} />

      {/* Auth page — standalone, no NavBar */}
      <Route path="/ProfilePage" element={<Profile_Page />} />

      {/* App pages — inside NavBar layout */}
      <Route path="/" element={<NavBar />}>
        <Route path="/FindTailor" element={<FindTailor />} />
        <Route path="/RateAndReview" element={<RateAndReview />} />
        <Route path="/CustomerProfile" element={<CustomerProfile />} />
        <Route path="/TailorProfile" element={<ProfileTailor />} />
      </Route>
    </Routes>
  );
}

export default App;
