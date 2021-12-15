import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Code from "./components/Code/Code";
import Problems from "./components/Problems/Problems";
import useLocalStorag from "./hooks/useLocalStorage";
import axios from "axios";

function App() {
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useLocalStorag("language", "javascript");
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios
      .get("https://ec2-3-133-13-191.us-east-2.compute.amazonaws.com/problems")
      .then((rsp) => {
        setProblems(
          rsp.data.map((e) => ({
            ...e,
            category: JSON.parse(e.category),
            examples: JSON.parse(e.examples),
          }))
        );
      });
  }, []);

  return (
    <Router>
      <div className="h-screen bg-gray-700 flex flex-col">
        <div className="flex justify-around bg-gray-800 text-white text-xl">
          <Link to="/">Home</Link>
          <Link to="/login">Log In</Link>
        </div>
        <div className="flex-1 bg-zinc-50">
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Problems
                  setProblem={setProblem}
                  problems={problems}
                  setProblems={setProblems}
                />
              }
            ></Route>
            <Route
              exact
              path="/code"
              element={
                <Code
                  problems={problems}
                  problem={problem}
                  language={language}
                  setLanguage={setLanguage}
                  setProblem={setProblem}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
