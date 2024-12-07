import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Categories from "./pages/Categories";
import Moves from "./pages/Moves";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={<PrivateRoute element={<Moves />} />}
        />
        <Route
          path="/moves"
          element={<PrivateRoute element={<Moves />} />}
        />
        <Route
          path="/categories"
          element={<PrivateRoute element={<Categories />} />}
        />
        <Route
          path="/analytics"
          element={<PrivateRoute element={<Analytics />} />}
        />
      </Routes>
    </Router>
  );
}
