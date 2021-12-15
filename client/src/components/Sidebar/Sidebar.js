import React, { useEffect, useState } from "react";

import { difficultyColor } from "../../utils";

import Filter from "./Filter";

function Sidebar({ problems, setProblem, setShowedProblems, showedProblems }) {
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [filter, setFilter] = useState({ difficulty: "All", name: "" });

  const [numberPerPage, setnumberPerPage] = useState(
    (window.innerHeight - 100) / 50
  );

  const [totalPages, setTotalPages] = useState(
    Math.ceil(
      filteredProblems.length / Math.floor((window.innerHeight - 100) / 50)
    )
  );

  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    setTotalPages(
      Math.ceil(
        filteredProblems.length / Math.floor((window.innerHeight - 100) / 50)
      )
    );
  }, [filteredProblems]);

  useEffect(() => {
    const handleResize = () => {
      setnumberPerPage(Math.floor((window.innerHeight - 100) / 50));
      setTotalPages(
        Math.ceil(
          filteredProblems.length / Math.floor((window.innerHeight - 100) / 50)
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.classList.contains("sidenav")) {
        setShowedProblems(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  });

  useEffect(() => {
    let data = [...problems];
    data = data.filter(
      (e) =>
        (e.name.toLowerCase().includes(filter.name.toLowerCase()) ||
          filter.name === "") &&
        (e.difficulty === filter.difficulty || filter.difficulty === "All")
    );
    setFilteredProblems(data);
  }, [problems, filter]);

  return (
    <div
      id="mySidenav"
      className={`mytransition sidenav fixed max-w-lg top-0 left-0 z-20 h-full overflow-x-hidden overflow-y-auto bg-gray-800 ${
        showedProblems ? "w-1/2" : "w-0"
      }`}
    >
      <Filter
        filter={filter}
        setFilter={setFilter}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
      />
      {problems &&
        filteredProblems
          .slice(page * numberPerPage, page * numberPerPage + numberPerPage)
          .map((problem) => (
            <div
              key={problem.id}
              className="sidebar flex justify-between problem p-3 pr-8 hover:bg-gray-500 text- decoration-clone text-gray-300 text-lg hover:text-red-400 cursor-pointer"
              onClick={() => {
                setShowedProblems(false);
                setProblem(problem);
              }}
            >
              <div>{problem?.name}</div>
              <div className={`${difficultyColor(problem?.difficulty)}`}>
                {problem?.difficulty}
              </div>
            </div>
          ))}
    </div>
  );
}

export default Sidebar;
