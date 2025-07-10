import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Layout from "./hangit/Layout";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Settings from "./pages/Settings";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import WatchedPage from "./pages/watched";
import WatchlistPage from "./pages/watchlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="sign-in/*" element={<SignInPage />} />
        <Route path="sign-up/*" element={<SignUpPage />} />
        <Route path="movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="watched" element={<ProtectedRoute><WatchedPage /></ProtectedRoute>} />
        <Route path="watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;