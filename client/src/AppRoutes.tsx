import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import AddMovie from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; 
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={isAuthenticated() ? <Navigate to="/movies" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/create-movie" element={<AddMovie />} />
      <Route path="/edit-movie/:id" element={<EditMovie />} />
    </Routes>
  );
}
