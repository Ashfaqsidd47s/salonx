import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignupSalon from './pages/signup-salon';
import Home from './pages/Home';
import Explore from './pages/Explore';
import SalonDetails from './pages/SalonDetails';
import Signup from './pages/Signup';
import SignIn from './pages/SignIn';
import SignInSalon from './pages/SignInSalon';
import Dashboard from './pages/Dashboard';
import UserBookings from './pages/UserBookings';
import SalonBookings from './pages/SalonBookings';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:id" element={<SalonDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signin-salon" element={<SignInSalon />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/bookings" element={<UserBookings />} />
          <Route path="/salon/bookings" element={<SalonBookings />} />
          <Route path="/signup-salon" element={<SignupSalon />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;