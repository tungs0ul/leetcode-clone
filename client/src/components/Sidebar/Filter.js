import React from "react";

import { difficultyColor } from "../../utils";

function Filter({ filter, setFilter, page, setPage, totalPages }) {
  return (
    <div className="flex justify-between p-4 sidenav ">
      <div className="sidenav ">
        <input
          type="text"
          placeholder="Search"
          className="sidenav hover cursor-pointer p-2 rounded-sm"
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
      </div>
      <div className="sidenav">
        <select
          className="sidenav hover p-2 cursor-pointer rounded-sm"
          style={{ width: "100px" }}
          value={filter.difficulty}
          onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
        >
          <option className={`sidenav cursor-pointer `}>All</option>
          {["Easy", "Medium", "Hard"].map((difficulty) => (
            <option
              key={difficulty}
              className={`${difficultyColor(difficulty)}`}
            >
              {difficulty}
            </option>
          ))}
        </select>
      </div>
      <div className="sidenav flex justify-between gap-1 cursor-pointer no">
        <div className="sidenav hover pl-4 pr-4 flex items-center rounded-md">
          {page + 1}
        </div>
        <div
          className="sidenav hover pl-4 pr-4 flex items-center rounded-md"
          onClick={() => page && setPage(page - 1)}
        >
          <div className="sidenav">{"<"}</div>
        </div>
        <div
          className="sidenav hover pl-4 pr-4 items-center flex rounded-md"
          onClick={() => {
            page < totalPages - 1 && setPage(page + 1);
          }}
        >
          <div className="sidenav">{">"}</div>{" "}
        </div>
      </div>
    </div>
  );
}

export default Filter;
