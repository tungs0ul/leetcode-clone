import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

function Editor({
  code,
  setCode,
  func,
  language,
  setLanguage,
  err,
  output,
  msg,
}) {
  useEffect(() => {
    if (language === "Python") {
      setCode(`\tdef ${func}:
      `);
    } else {
      setCode(`function ${func}{

}`);
    }
  }, [language, func]);
  return (
    <div className="overflow-y-auto editor bg-white">
      <div className="border-2 pl-4">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
        </select>
      </div>
      <CodeMirror
        className="text-xl"
        value={code}
        theme="dark"
        height="calc(100vh - 300px)"
        extensions={
          language === "Python" ? [python()] : [javascript({ jsx: true })]
        }
        onChange={(value) => {
          setCode(value);
        }}
      />
      <div>
        <div className="flex pl-4 pt-2 pb-2 border-y-2 bg-yellow-100">
          {/* <div
            className={`mr-8 ${
              layout == "tests" && "font-semibold"
            } cursor-pointer`}
            onClick={() => {}}
          >
            Test Case
          </div> */}
          <div
            className={`mr-8 font-semibold cursor-pointer`}
            onClick={() => {}}
          >
            Output
          </div>
        </div>
        <div
          className="flex flex-col bg-gray-50 output"
          style={{ witdh: "500px" }}
        >
          <h2
            className={`${err ? "text-red-700" : "text-green-500"} mb-4 pl-4`}
          >
            {msg}
          </h2>
          <div className="pl-4 flex-1">
            <div className="pl-4 break-words">
              {output && output.length ? (
                output.map((e, i) => <div key={i}>{e}</div>)
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
