import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from "./src/pages/dashboard/Dashboard.jsx";
import Confirm from "./src/pages/confirm/Confirm.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:token" element={<Confirm />} />
      </Routes >
    </BrowserRouter>
  );
}

export default App;
