import React from "react";
import ReactHtmlParser from "react-html-parser";

function Description({ problem }) {
  if (!problem) {
    return <></>;
  }
  return (
    <div className="descripton w-full">
      <h2 className="font-medium mb-4">{problem.name}</h2>

      <div className="mb-4 h-auto">{ReactHtmlParser(problem.description)}</div>

      {problem?.examples &&
        problem.examples.map((e, i) => (
          <div key={i}>
            <div>
              <h3 className="font-semibold">Example {i + 1}</h3>
            </div>
            <div className="mb-4 bg-gray-200 p-4 rounded-md">
              <div>
                {
                  <>
                    <strong className="mr-2">Input:</strong>
                    {JSON.stringify(e.input)}
                  </>
                }
              </div>
              <div>
                {
                  <>
                    <strong className="mr-2">Output:</strong>
                    {JSON.stringify(e.output)}
                  </>
                }
              </div>
              <div>
                {e?.explanation ||
                  (e?.explaination && (
                    <>
                      <strong className="mr-2">Explain:</strong>
                      {e.explanation}
                      {e.explaination}
                    </>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Description;
