"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { HiOutlinePlusSm } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ToolItem from "@/app/inputform/ToolItem";

type ToolData = {
  id: string;
  tool: string;
  monthly: number;
  seats: number;
};

export default function InputForm() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const [toolslist, setToolsList] = useState<ToolData[]>([
    { id: uuidv4(), tool: "open-ai", monthly: 20, seats: 1 },
  ]);

  const [teamsize, setTeamsize] = useState<number>(1);
  const [usecase, setUsecase] = useState<string>("coding");
  const [hydrated, setHydrated] = useState(false);


  useEffect(() => {
    const savedTools = localStorage.getItem("toolslist");
    const savedTeamsize = localStorage.getItem("teamsize");
    const savedUsecase = localStorage.getItem("usecase");

    if (savedTools) setToolsList(JSON.parse(savedTools));
    if (savedTeamsize) setTeamsize(Number(savedTeamsize));
    if (savedUsecase) setUsecase(savedUsecase);

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("toolslist", JSON.stringify(toolslist));
  }, [toolslist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("teamsize", teamsize.toString());
  }, [teamsize, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("usecase", usecase);
  }, [usecase, hydrated]);
  const [error, setError] = useState("");

  const handleAddTools = () => {
    setToolsList((prev) => [
      ...prev,
      { id: uuidv4(), tool: "cursor", monthly: 20, seats: 1 },
    ]);
  };

  const deleteTool = (id: string) => {
    setToolsList((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToolChange = (
    id: string,
    field: keyof Omit<ToolData, "id">,
    value: string | number,
  ) => {
    setToolsList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleAnalyze = async() => {
     // Prevent duplicate clicks
    if (isAnalyzing) return;

    if (toolslist.length === 0) {
      setError("Please add at least one AI tool before analyzing.");
      return;
    }
    setIsAnalyzing(true);
    try{
       const userData = {
      toolslist,
      teamsize,
      usecase,
    };

    console.log(userData);

    localStorage.setItem("userData", JSON.stringify(userData));
    setError("");




    // await fetch("/api/analyze", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(userData),
    // });




    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });


    if (!response.ok) {
      const error = await response.text();

      console.error(error);

      alert("Failed to generate recommendation.");

      return;
    }

    const data = await response.json();

    // Save recommendation
    localStorage.setItem(
      "recommendation",
       JSON.stringify(data.recommendation)
    );

    console.log("Recommendation saved to localStorage:", data.recommendation);

    router.push("/auditresults");
    } catch (error) {
      console.error("Error during analysis:", error);
      alert("An error occurred during analysis. Please try again.");
    }
    finally {
      setIsAnalyzing(false);
    }
    
  };

  return (
    <div className="w-full min-h-[90vh] flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-sans mt-[10vh] overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-start justify-center w-[85vw] md:mt-[-60px] lg:mt-0 xl:mt-[-60px]">
        <button
          onClick={() => router.push("/")}
          className="text-white py-2 flex items-center self-start mt-[25px]"
        >
          <FaArrowLeft className="mr-3 border-2 border-gray-400 p-[6px] box-content rounded-full" />
          Back to Home
        </button>

        <div className="border border-gray-400 rounded-2xl p-5 w-[100%] min-h-[70vh] mt-[15px]">
          <h1 className="text-white font-bold text-2xl">AI Stack Audit</h1>
          <p className="text-gray-400 mt-2">
            Tell us about your AI tools and we'll find where you can save
          </p>

          <p className="text-white font-bold text-xl my-2 mt-4">
            Team Information
          </p>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col items-start justify-center w-[50%]">
              <label htmlFor="team-size">Team Size</label>
              <input
                type="number"
                id="team-size"
                className="border-gray-300 border rounded-md w-[90%] text-white p-1 focus-visible:ring-1
        focus-visible:ring-gray-400 mt-2"
                placeholder="1"
                min={1}
                value={teamsize}
                onChange={(e) => setTeamsize(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col items-start justify-center w-[50%]">
              <label htmlFor="usecase">Primary Use Case</label>
              <Select onValueChange={setUsecase} value={usecase} required>
                <SelectTrigger id="usecase" className="w-full bg-gray-100 rounded-md mt-2 border-white">
                  <SelectValue placeholder="Coding" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="image-generation">Image Generation</SelectItem>
                  <SelectItem value="video-generation">Video Generation</SelectItem>
                  <SelectItem value="audio-generation">Audio Generation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row justify-between w-[100%] items-center mt-5 mb-5">
            <p className="max-md:text-md md:text-xl font-bold text-white">AI Tools You Pay For</p>
            <button
              className="text-white flex flex-row justify-center items-center font-bold border border-gray-300 rounded-lg p-1 md:p-2 max-md:text-md"
              onClick={handleAddTools}
            >
              <HiOutlinePlusSm className="md:mr-3" />
              Add Tool
            </button>
          </div>

          {/* <div className="border border-gray-400 rounded-lg p-5 w-[100%] flex flex-row justify-between items-center">
            <div className="flex flex-col justify-center items-start w-[20%]">
              <label htmlFor="tool" className="text-white font-bold mb-2">Tool</label>
              <Select onValueChange={setTool} value={tool} id="tool">
                <SelectTrigger className="w-full bg-gray-100 rounded-md">
                  <SelectValue placeholder="Cursor" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cursor">Cursor</SelectItem>
                  <SelectItem value="github-copilot">GitHub Copilot</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="anthropic-ai">Anthropic AI</SelectItem>
                  <SelectItem value="open-ai">Open AI</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="windsurf">WindSurf</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col justify-center items-start w-[20%]">
              <label htmlFor="plan" className="text-white font-bold mb-2">Plan</label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="w-full bg-gray-100 rounded-md">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="hobby">Hobby</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              
            </div>


            <div className="flex flex-col justify-center items-start w-[20%]">
              <label htmlFor="monthly-spend" className="text-white font-bold mb-2">Monthly Spend ($)</label>
              <input type="number" id="monthly-spend" className="border-gray-300 border rounded-md w-[90%] text-white p-1 focus-visible:ring-1
        focus-visible:ring-gray-400" placeholder="20" min={0} value={monthly} onChange={(e)=>setMonthly(Number(e.target.value))}/>
            </div>

            <div className="flex flex-col justify-center items-start w-[20%]">
              <label htmlFor="seats" className="text-white font-bold mb-2">Seats</label>
              <input type="number" id="seats" className="border-gray-300 border rounded-md w-[90%] text-white p-1 focus-visible:ring-1
        focus-visible:ring-gray-400" placeholder="1" min={1} value={seats} onChange={(e)=>setSeats(Number(e.target.value))}/>
            </div>

            <button className="border border-gray-300 p-2 rounded-lg self-end" onClick={()=>deleteTool(id)}><RiDeleteBin5Line className="text-red-500"/></button>
          </div> */}

          {toolslist.length === 0 ? (
            <div className="border border-dashed border-gray-500 rounded-lg p-10 w-[100%] flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg">No tools added yet</p>
              <p className="text-sm mt-1">Click "Add Tool" to get started</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {toolslist.map((eachtool) => (
                <ToolItem
                  key={eachtool.id}
                  id={eachtool.id}
                  data={eachtool}
                  onChange={handleToolChange}
                  deleteTool={deleteTool}
                />
              ))}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center mt-4">{error}</p>
          )}

          <button
            className="w-[100%] font-bold text-md bg-white rounded-lg text-black py-3 mt-4 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze My Spending"}
          </button>
        </div>
      </div>
    </div>
  );
}
