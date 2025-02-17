import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Categories from "./pages/Categories";
import Accounts from "./pages/Accounts";
import Moves from "./pages/Moves";
import Projects from "./pages/Projects";
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
          path="/accounts"
          element={<PrivateRoute element={<Accounts />} />}
        />
        <Route
          path="/projects"
          element={<PrivateRoute element={<Projects />} />}
        />
        <Route
          path="/analytics"
          element={<PrivateRoute element={<Analytics />} />}
        />
      </Routes>
    </Router>
  );
}
