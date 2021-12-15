import React, { useEffect, useState } from "react";

import Filter from "./Filter";

import { difficultyColor, categoryColor } from "../../utils";

import { Link } from "react-router-dom";

const compareCategory = (problem, categories) => {
  let error = false;
  categories.forEach((e) => {
    if (!problem.includes(e)) {
      error = true;
    }
  });
  return !error;
};

function Problems({ setProblem, problems }) {
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState([]);
  const [sortBy, setSortBy] = useState({ key: "id", order: 1 });
  const [categories, setCategories] = useState([]);

  const [numberPerPage, setnumberPerPage] = useState(
    (window.innerHeight - 150) / 55
  );

  const [totalPages, setTotalPages] = useState(
    Math.ceil(
      filteredProblems.length / Math.floor((window.innerHeight - 150) / 55)
    )
  );

  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    setTotalPages(
      Math.ceil(
        filteredProblems.length / Math.floor((window.innerHeight - 150) / 55)
      )
    );
  }, [filteredProblems]);

  useEffect(() => {
    const handleResize = () => {
      setnumberPerPage(Math.floor((window.innerHeight - 150) / 55));
      setTotalPages(
        Math.ceil(
          filteredProblems.length / Math.floor((window.innerHeight - 150) / 55)
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    const result = [];
    problems.forEach((e) => {
      result.push(...e.category);
    });
    setCategories(Array.from(new Set(result)));
  }, [problems]);

  useEffect(() => {
    if (totalPages < 2) {
      setPage(0);
    }
  }, [totalPages]);

  useEffect(() => {
    let filtered = problems.filter(
      (e) =>
        (difficulty === "All" || e.difficulty === difficulty) &&
        compareCategory(e.category, category)
    );
    filtered.sort((a, b) =>
      a[sortBy.key] > b[sortBy.key] ? sortBy.order : -1 * sortBy.order
    );
    setFilteredProblems(filtered);
  }, [problems, difficulty, sortBy, category]);

  const handleSort = (value) => {
    if (sortBy.key !== value) {
      setSortBy({ key: value, order: 1 });
      return;
    } else if (sortBy.order === 1) {
      setSortBy({ key: value, order: -1 });
      return;
    } else if (sortBy.order === -1) {
      setSortBy({ key: "id", order: 1 });
      return;
    }
  };

  return (
    <div className="w-screen flex flex-col justify-between bg-white box-border shadow problems">
      <div>
        <Filter
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          categories={categories}
          setCategory={setCategory}
        />
        <div className="border-2 shadow-black mt-4 p-4 flex justify-center h-fit">
          <table className="w-full">
            <thead></thead>
            <tbody>
              <tr className="flex justify-evenly mb-4">
                <th
                  onClick={() => handleSort("name")}
                  className="flex-1 cursor-pointer font-bold text-3xl"
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort("difficulty")}
                  className="flex-1 cursor-pointer font-bold text-3xl"
                >
                  Difficulty
                </th>
                <th className="flex-1 font-bold text-3xl">Category</th>
              </tr>
              {filteredProblems
                .slice(
                  numberPerPage * page,
                  numberPerPage * page + numberPerPage
                )
                .map((e, i) => (
                  <tr key={i} className="flex justify-evenly mb-2">
                    <td
                      className="flex-1 flex text-xl justify-center text-center cursor-pointer hover:text-blue-700 font-medium hover:font-bold"
                      onClick={() => {
                        setProblem(e);
                      }}
                    >
                      <Link to="/code">{e.name}</Link>
                    </td>
                    <td
                      className={`flex-1 flex justify-center ${difficultyColor(
                        e.difficulty
                      )}`}
                    >
                      {e.difficulty}
                    </td>
                    <td className="flex-1 flex justify-center">
                      {e?.category?.length &&
                        e.category.map((e, i) => (
                          <div>
                            <span
                              key={i}
                              className={`mr-2 rounded-sm bg-gray-300 p-1 pl-2 pr-2 ${categoryColor(
                                e
                              )}`}
                            >
                              {e}
                            </span>
                          </div>
                        ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mb-4 w-screen">
        <div
          className={`flex justify-between gap-2 ${
            totalPages > 1 ? "opacity-100" : "opacity-0"
          } duration-1000 transform ease-in-out`}
        >
          <div
            className="border p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white flex items-center text-2xl font-semibold cursor-pointer"
            onClick={() => {
              if (page > 0) {
                setPage(page - 1);
              }
            }}
          >
            prev
          </div>
          <div className="border p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white flex items-center text-2xl font-semibold pl-4 pr-4 cursor-pointer">
            {page + 1}
          </div>
          <div
            className="border p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white flex items-center text-2xl font-semibold cursor-pointer"
            onClick={() => {
              if (page < totalPages - 1) {
                setPage(page + 1);
              }
            }}
          >
            next
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problems;
