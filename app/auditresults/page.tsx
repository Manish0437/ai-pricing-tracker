"use client";

import React, { useEffect, useState } from "react";
import { PiInfo } from "react-icons/pi";

export default function AuditResults() {
  const [result, setResult] = useState<any>(null);
  // const [monthlySpend, setMonthlySpend] = useState<any[]>([]);
  const [monthlySpend, setMonthlySpend] = useState<number>(0);
  useEffect(() => {
    const stored = localStorage.getItem("recommendation");

    if (stored && stored !== "undefined") {
      try {
        setResult(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid recommendation JSON:", err);
        localStorage.removeItem("recommendation");
      }
    }
     // Load tools and calculate monthly spend
    const storedTools = localStorage.getItem("toolslist");

    if (storedTools) {
      const tools = JSON.parse(storedTools);

      const total = tools.reduce(
        (
          sum: number,
          tool: {
            monthly: number;
            seats: number;
          }
        ) => {
          return sum + tool.monthly * tool.seats;
        },
        0
      );
      console.log("Total monthly spend:", total);
      setMonthlySpend(total);
    }
  }, []);

  const calculateSavings = (
    current: number,
    recommended: number
  ) => {
    return Math.max(current - recommended, 0).toFixed(2);
  };

  if (!result) {
    return <p>No recommendation found.</p>;
  }

  return (
    <div className="w-full min-w-[80vw] min-h-[90vh] flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-sans mt-[10vh] overflow-y-auto no-scrollbar">
      <div className="w-[80vw] mx-auto p-6 max-md:p-2 border-white border rounded-lg lg:mt-[20px] xl:mt-[0px] animate-auditcontainer">
        <h1 className="text-3xl font-bold mb-6">
          AI Subscription Recommendation
        </h1>

        <div className="border rounded-lg p-6 shadow">
          <div className="flex flex-row justify-between items-start w-full">
            <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              {result.recommendedModel}
            </h2>

            <p>
              <strong>Provider:</strong>{" "}
              <span className="text-green-500 uppercase max-md:text-[16px] md:text-xl">{result.recommendedProvider}</span>
            </p>
            </div>
            <p className="uppercase text-green-400 bg-[#101712] border border-green-300 rounded-xl p-1 px-5 max-md:w-[200px] max-md:text-[12px] max-md:px-2">optimized choice</p>
            
          </div>
          <div className="max-md:items-start flex flex-col md:flex-row justify-between items-center w-full mt-4">
            <div className="flex flex-col justify-center items-start">
              <p>
                <strong>Current Monthly Cost:</strong>
              </p>
              <p className="font-bold text-3xl mt-3">$
                {monthlySpend}</p>
            </div>
            <div className="flex flex-col justify-center items-start">
                <p>
                <strong>Recommended Monthly Cost:</strong> </p><p className="font-bold mt-3 text-3xl text-green-500">$
                {result.recommendedMonthlyCost}
              </p>
            </div>
            <div className="flex flex-col justify-center items-start">
               <p>
                <strong>Estimated Savings:</strong>
              </p>
              <p className="font-bold mt-3 text-3xl">
                ${calculateSavings(monthlySpend, result.recommendedMonthlyCost)}
              </p>
            </div>
          </div>
          

          <span className="mt-4">
            <strong className="flex items-center gap-2 mt-8 mb-4"><span className="text-green-400"><PiInfo /></span>Recommendation Reason:</strong>
          </span>
          <p>{result.reason}</p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">
              Alternatives
            </h3>

            <ul className="list-disc ml-6 mt-2">
              {result.alternatives?.map(
                (alt: any, index: number) => (
                  <li key={index}>
                    {alt.provider} - {alt.model}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}