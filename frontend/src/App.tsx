import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignupSalon from './pages/signup-salon';
import Home from './pages/Home';
import Explore from './pages/Explore';
import SalonDetails from './pages/SalonDetails';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:id" element={<SalonDetails />} />
          <Route path="/signup-salon" element={<SignupSalon />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;