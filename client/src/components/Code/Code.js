import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Description from "./Description";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";

function Code({ problem, language, setLanguage, problems, setProblem }) {
  let navigate = useNavigate();
  useEffect(() => {
    if (!problem) {
      navigate("/");
    }
  }, [problem]);

  const [showedProblems, setShowedProblems] = useState(false);

  const [code, setCode] = useState("");

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [err, setErr] = useState(false);
  const [output, setOutput] = useState([]);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    if (disabled || loading) {
      return;
    }
    setDisabled(true);
    setLoading(true);
    setErr(false);
    setOutput([]);
    setMsg("");
    axios
      .post(`https://ec2-3-133-13-191.us-east-2.compute.amazonaws.com/code`, {
        test: problem.test,
        language,
        code: code.replaceAll("    ", "\t"),
        function: problem.function,
        parameters: problem.parameters,
      })
      .then((res) => {
        setLoading(false);
        let { error, stdout, stderr } = res.data;
        setOutput(stdout);
        let msg = "Success";
        setMsg(error ? (stderr?.length ? stderr : "Error") : "Success");
        let err = error || !(stderr || stdout);
        if (err) {
          msg = stderr ? stderr : "Error";
        }
        if (stdout.length && stdout[stdout.length - 1] === "Error") {
          err = true;
          stdout = stdout.slice(0, -1);
          msg = "Error";
        }
        setOutput(stdout);
        setMsg(msg);
        setErr(err);
        setTimeout(() => setDisabled(false), 5000);
      });
  };

  if (!problem) {
    return <></>;
  }

  return (
    <div className="h-full w-screen">
      <div className="flex h-full w-full">
        <div className="w-1/3 p-4 bg-white description overflow-auto">
          <Description problem={problem} />
        </div>
        <div className="w-2/3">
          <Editor
            func={`${problem?.function}(${problem?.parameters})`}
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            err={err}
            output={output}
            msg={msg}
          />
        </div>
      </div>
      <div className="fixed bottom-0 bg-white w-screen h-14 flex items-center p-4 float-left justify-between">
        <div
          className="sidenav border-2 p-2 pl-4 pr-4 rounded-sm cursor-pointer hover:bg-red-200"
          onClick={() => setShowedProblems(true)}
        >
          👌Problems
        </div>
        {loading && <div className="animate-spin">😵‍💫</div>}
        <div className="flex justify-around w-1/4">
          {/* <div className="border-solid border-2 p-2 pl-3 pr-3 rounded-sm hover:bg-gray-400 cursor-pointer">
            Run Code
          </div> */}
          <div
            className="bg-gray-400 p-2 pl-3 pr-3 rounded-sm text-white cursor-pointer hover:bg-zinc-500 hover:text-slate-900"
            onClick={handleSubmit}
          >
            👍Submit
          </div>
        </div>
      </div>
      <Sidebar
        setProblem={setProblem}
        setShowedProblems={setShowedProblems}
        showedProblems={showedProblems}
        problems={problems}
      />
    </div>
  );
}

export default Code;
