"use client";

import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ToolData = {
  id: string;
  tool: string;
  monthly: number;
  seats: number;
};

interface ToolItemProps {
  id: string;
  data: ToolData;
  deleteTool: (id: string) => void;
  onChange: (
    id: string,
    field: keyof Omit<ToolData, "id">,
    value: string | number
  ) => void;
}

export default function ToolItem({id, data,deleteTool,onChange}: ToolItemProps) {

    const handledeleteTool =() =>{
        deleteTool(id);
    }

    return (
      <>
        <div className="max-md:hidden border border-gray-400 rounded-lg p-5 w-[100%] flex flex-row justify-between items-center">
          <div className="flex flex-col justify-center items-start w-[40%]">
            <label htmlFor="tool" className="text-white font-bold">Tool</label>
            <Select value={data.tool} onValueChange={(val)=>onChange(id,"tool",val)} required>
              <SelectTrigger className="w-full bg-gray-100 rounded-md border-white">
                <SelectValue placeholder="Cursor" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="open-ai">Open AI</SelectItem>
                <SelectItem value="anthropic-ai">Anthropic AI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
                <SelectItem value="perplexity-sonar">Perplexity Sonar</SelectItem>
                <SelectItem value="perplexity-pro">Perplexity Pro</SelectItem>
                <SelectItem value="perplexity-sonar-reasoning-pro">Perplexity Sonar Reasoning Pro</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="flex flex-col justify-center items-start w-[20%]">
            <label htmlFor="plan" className="text-white font-bold">Plan</label>
            <Select value={data.plan} onValueChange={(val)=>onChange(id,"plan",val)}>
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
            
          </div> */}


          <div className="flex flex-col justify-center items-start w-[20%]">
            <label htmlFor="monthly-spend" className="text-white font-bold">Monthly Spend ($)</label>
            <input type="number" id="monthly-spend" className="border-gray-300 border rounded-md w-[90%] text-white p-1 focus-visible:ring-1
      focus-visible:ring-gray-400" placeholder="20" min={0} value={data.monthly} onChange={(e)=>onChange(id, "monthly",Number(e.target.value))} required/>
          </div>

          <div className="flex flex-col justify-center items-start w-[20%]">
            <label htmlFor="seats" className="text-white font-bold">Number of Users</label>
            <input type="number" id="seats" className="border-gray-300 border rounded-md w-[90%] text-white p-1 focus-visible:ring-1
      focus-visible:ring-gray-400" placeholder="1" min={1} value={data.seats} onChange={(e)=> onChange(id,"seats",Number(e.target.value))} required/>
          </div>

          <button className="border border-gray-300 p-2 rounded-lg self-end" onClick={()=>deleteTool(id)} title="Remove Tool"><RiDeleteBin5Line className="text-red-500"/></button>
        </div>

        {/* for small screens */}
        <div className="md:hidden border border-gray-400 rounded-lg p-5 w-[100%] flex flex-col justify-between items-center gap-3">
          <button className="border border-gray-300 p-2 rounded-lg self-end" onClick={()=>deleteTool(id)} title="Remove Tool"><RiDeleteBin5Line className="text-red-500"/></button>
          <div className="flex flex-col justify-center items-start w-[100%]">
            <label htmlFor="tool" className="text-white font-bold mb-1">Tool</label>
            <Select value={data.tool} onValueChange={(val)=>onChange(id,"tool",val)} required>
              <SelectTrigger className="w-full bg-gray-100 rounded-md border-white">
                <SelectValue placeholder="Cursor" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="open-ai">Open AI</SelectItem>
                <SelectItem value="anthropic-ai">Anthropic AI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
                <SelectItem value="perplexity-sonar">Perplexity Sonar</SelectItem>
                <SelectItem value="perplexity-pro">Perplexity Pro</SelectItem>
                <SelectItem value="perplexity-sonar-reasoning-pro">Perplexity Sonar Reasoning Pro</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="flex flex-col justify-center items-start w-[20%]">
            <label htmlFor="plan" className="text-white font-bold">Plan</label>
            <Select value={data.plan} onValueChange={(val)=>onChange(id,"plan",val)}>
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
            
          </div> */}


          <div className="flex flex-col justify-center items-start w-[100%]">
            <label htmlFor="monthly-spend" className="text-white font-bold mb-1">Monthly Spend ($)</label>
            <input type="number" id="monthly-spend" className="border-gray-300 border rounded-md w-[100%] text-white p-1 focus-visible:ring-1
      focus-visible:ring-gray-400" placeholder="20" min={0} value={data.monthly} onChange={(e)=>onChange(id, "monthly",Number(e.target.value))} required/>
          </div>

          <div className="flex flex-col justify-center items-start w-[100%]">
            <label htmlFor="seats" className="text-white font-bold mb-1">Number of Users</label>
            <input type="number" id="seats" className="border-gray-300 border rounded-md w-[100%] text-white p-1 focus-visible:ring-1
      focus-visible:ring-gray-400" placeholder="1" min={1} value={data.seats} onChange={(e)=> onChange(id,"seats",Number(e.target.value))} required/>
          </div>

          
        </div>
      </>
    )
}