"use client"

import { FaArrowRight } from "react-icons/fa6";
import { DM_Serif_Display } from "next/font/google";
import { MdElectricBolt } from "react-icons/md";
import { IoShieldOutline } from "react-icons/io5";
import {BsCurrencyDollar} from "react-icons/bs";
import { useCardAnimation } from "@/hooks/useCardAnimation";

import React from "react";
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import {useRouter} from "next/navigation";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compare AI Model Pricing — OpenAI, Anthropic, Gemini, Groq",
  description:
    "Real-time comparison of AI API pricing. Find the cheapest model for chat, coding, reasoning, embeddings and more. Updated daily from official sources.",
  alternates: {
    canonical: "/",
  },
}

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
});

export default function Home() {

  const router=useRouter();
  const card1 = useCardAnimation();
  const card2 = useCardAnimation();
  const card3 = useCardAnimation();



  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  )

  const handleAudit=()=>{
   router.push("/inputform");
  }


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AI Model Pricing Tracker",
            description:
              "Compare AI model pricing across OpenAI, Anthropic, Google Gemini, Groq, DeepSeek and more.",
            url: "https://ai-pricing-tracker-production.up.railway.app",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Daily updated AI pricing",
              "Compare 9+ providers",
              "Model recommendation engine",
              "Filter by budget and task",
            ],
          }),
        }}
      />
      <div className="w-full min-h-[90vh] flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-sans mt-[10vh]">
        <main className="flex flex-1 w-full min-h-screen flex-col items-center justify-center bg-white dark:bg-black px-6 md:px-15">

          <div className="md:flex-row flex flex-col justify-center items-center w-full min-h-[85vh] gap-10 md:gap-8 mt-[30px]">
            {/* landingpage title container */}
            <div className="flex flex-col justify-center items-start w-[95%] md:w-[50%] text-left animate-dashboardHeading">
              <h1 className="font-bold text-5xl">Are you overpaying for your <span className="text-blue-500">AI</span> <span className="bg-linear-to-r from-[#237fec] from-10% via-80% to-90% to-purple-500 bg-clip-text text-transparent">Stack?</span></h1>
              <p className="mt-8 text-gray-400 text-lg w-[90%]">Enter what you pay for AI tools today. Get an instant audit — where you're overspending, what to switch, and exactly how much you'd save.</p>
              <button className="text-white bg-black dark:text-black dark:bg-white p-3 rounded-2xl font-bold flex items-center gap-2 mt-6" onClick={handleAudit}>Start Free Audit <FaArrowRight /></button>
            </div>

            {/* sample audit container */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 w-[95%] md:w-[50%] dark:bg-white text-black bg-[#e0ecff] rounded-2xl h-fit lg:h-[50%] animate-auditcontainer">
              <div className="flex flex-row justify-between items-center w-[100%]">
                <div className="flex flex-col items-start justify-center">
                  <p className="font-semibold text-xl">Sample audit . 4 tools</p>
                  <p className="text-gray-400 dark:text-gray-500">3-person coding team</p>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <p className={`${dmSerif.className} text-green-500 text-5xl font-bold`}>$91</p>
                  <p className="text-right">saved per month</p>
                </div>
              </div>


              <div className="flex flex-row justify-between items-end w-[100%] mt-4">
                <div className="flex flex-col justify-center items-start w-[60%]">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-blue-950 bg-blue-300 p-2 rounded-xl">Cu</p>
                    <p className="text-black ml-[5px]">Cursor</p>
                  </div>
                  <p className="text-gray-400 dark:text-gray-700 flex flex-row items-center">Pro <FaArrowRight className="mx-2"/> hobby</p>
                </div>
                <div className="flex flex-col justify-center items-end w-[40%]">
                  <p className="text-green-500 font-medium">-$60/mo</p>
                  <p className="text-gray-400 dark:text-gray-700">Downgrade</p>
                </div>
              </div>




              <div className="flex flex-row justify-between items-end w-[100%] mt-4">
                <div className="flex flex-col justify-center items-start w-[80%]">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-gray-950 bg-gray-300 p-2 rounded-xl">GH</p>
                    <p className="text-black ml-[5px]">GitHub Copilot</p>
                  </div>
                  <p className="text-gray-400 dark:text-gray-700 flex flex-row items-center">Business <FaArrowRight className="mx-2"/> Remove</p>
                </div>
                <div className="flex flex-col justify-center items-end w-[20%]">
                  <p className="text-green-500 font-medium">-$57/mo</p>
                  <p className="text-gray-400 dark:text-gray-700">Switch</p>
                </div>
              </div>





              <div className="flex flex-row justify-between items-end w-[100%] mt-4">
                <div className="flex flex-col justify-center items-start w-[60%]">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-orange-600 bg-orange-300 p-2 rounded-xl">Cl</p>
                    <p className="text-black ml-[5px]">Claude</p>
                  </div>
                  <p className="text-gray-400 dark:text-gray-700 flex flex-row items-center min-w-[150%]">Pro (keep)</p>
                </div>
                <div className="flex flex-col justify-center items-end w-[40%]">
                  <p className="text-green-500 font-medium">Optimal <span className="text-green-500">✓</span></p>
                  <p className="text-gray-400 dark:text-gray-700">No change</p>
                </div>
              </div>



              <div className="flex flex-row justify-between items-end w-[100%] mt-4">
                <div className="flex flex-col justify-center items-start w-[60%]">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-green-800 bg-green-100 p-2 rounded-xl">GP</p>
                    <p className="text-black ml-[5px]">ChatGPT</p>
                  </div>
                  <p className="text-gray-400 dark:text-gray-700 flex flex-row items-center min-w-[150%]">Plus <FaArrowRight className="mx-2"/> Free tier</p>
                </div>
                <div className="flex flex-col justify-center items-end w-[40%]">
                  <p className="text-green-500 font-medium">-$20/mo</p>
                  <p className="text-gray-400 dark:text-gray-700">Downgrade</p>
                </div>
              </div>


            </div>
          </div>


          <div className="w-[100vw] px-6 py-8 mt-12 flex flex-col max-md:items-start md:flex-row justify-between items-center bg-[#181818] animate-[glow_2s_ease-in-out_infinite]">
            <p className="text-gray-300 text-lg ml-2"><span className="text-gray-300 mr-2">✓</span>No Login to use the tool</p>
            <p className="text-gray-300 text-lg ml-2"><span className="text-gray-300 mr-2">✓</span>Email captured after value shown</p>
            <p className="text-gray-300 text-lg ml-2"><span className="text-gray-300 mr-2">✓</span>Pricing sourced from official pages</p>
            <p className="text-gray-300 text-lg ml-2"><span className="text-gray-300 mr-2">✓</span>Shareable public link for every audit</p>
          </div>





        
          {/* carousel */}
          <div className="w-full mt-12">

            <Carousel
              opts={{
                loop: true,
                align:"start",
                dragFree:true,
                duration:30,
              }}
              plugins={[
                plugin.current
              ]}
              className="w-full max-w-6xl mx-auto"
            >


              <CarouselContent className="-ml-4 py-2">

                <CarouselItem className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                  <div className="flex flex-col justify-center items-center bg-white rounded-3xl p-8 min-h-[250px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <span className="rounded-full p-2 bg-blue-200"><MdElectricBolt className="text-blue-700 text-3xl"/></span>
                    <p className="font-bold text-black mt-4 mb-2 text-xl">Instant Analysis</p>
                    <p className="text-gray-700">Get results in seconds, not hours</p>
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                  <div className="flex flex-col justify-center items-center bg-white rounded-3xl p-8 min-h-[250px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <span className="rounded-full p-2 bg-green-200"><BsCurrencyDollar className="text-green-700 text-3xl"/></span>
                    <p className="font-bold text-black mt-4 mb-2 text-xl">Real Savings</p>
                    <p className="text-gray-700">Average user saves $50+/month</p>
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                  <div className="flex flex-col justify-center items-center bg-white rounded-3xl p-8 min-h-[250px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <span className="rounded-full p-2 bg-purple-200"><IoShieldOutline className="text-purple-700 text-3xl"/></span>
                    <p className="font-bold text-black mt-4 mb-2 text-xl">100% Private</p>
                    <p className="text-gray-700">Your data stays yours. No selling</p>
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                  <div className="flex flex-col justify-center items-center bg-white rounded-3xl p-8 min-h-[250px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <span className="rounded-full p-2 bg-blue-200"><MdElectricBolt className="text-blue-700 text-3xl"/></span>
                    <p className="font-bold text-black mt-4 mb-2 text-xl">Instant Analysis</p>
                    <p className="text-gray-700">Get results in seconds, not hours</p>
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                  <div className="flex flex-col justify-center items-center bg-white rounded-3xl p-8 min-h-[250px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <span className="rounded-full p-2 bg-green-200"><BsCurrencyDollar className="text-green-700 text-3xl"/></span>
                    <p className="font-bold text-black mt-4 mb-2 text-xl">Real Savings</p>
                    <p className="text-gray-700">Average user saves $50+/month</p>
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                  <div className="flex flex-col justify-center items-center bg-white rounded-3xl p-8 min-h-[250px] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <span className="rounded-full p-2 bg-purple-200"><IoShieldOutline className="text-purple-700 text-3xl"/></span>
                    <p className="font-bold text-black mt-4 mb-2 text-xl">100% Private</p>
                    <p className="text-gray-700">Your data stays yours. No selling</p>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>

          </div>
          


          <h1 className="text-white font-extrabold text-4xl mt-10">How It Works</h1>

          <div className="flex flex-row justify-between items-stretch w-full mt-10 mb-[150px] max-md:flex-col max-md:min-w-[100%] max-md:gap-10">
            <div className={`flex flex-col justify-start items-center bg-white rounded-2xl p-8 w-[30%] max-md:w-[100%] shadow-md ${
      card1.state === "hidden"
          ? "opacity-0 scale-75"
          : ""
          }
          
  ${
      card1.state === "visible"
          ? "animate-popIn"
          : ""
  }

  ${
      card1.state === "leaving"
          ? "animate-popOut"
          : ""
  }`} ref={card1.ref}>
              <span className="bg-blue-700 rounded-full p-5 font-extrabold text-white text-2xl py-[10px] px-[20px] ml-[-8px]">1</span>
              <p className="text-black font-bold mt-4">Input Your Stack</p>
              <p className="text-gray-600 text-center">Tell us which AI tools you use, your AI model plans, and monthly spend</p>
            </div>

            <div className={`flex flex-col justify-start items-center bg-white rounded-2xl p-8 w-[30%] max-md:w-[100%] shadow-md ${
      card2.state === "hidden"
          ? "opacity-0 scale-75"
          : ""
  }

  ${
    card2.state === "visible"
          ? "animate-popIn"
          : ""
  }

  ${
    card2.state === "leaving"
          ? "animate-popOut"
          : ""
  }`} ref={card2.ref}>
              <span className="bg-blue-700 rounded-full p-5 font-extrabold text-white text-2xl py-[10px] px-[20px] ml-[-8px]">2</span>
              <p className="text-black font-bold mt-4">Get Your Audit</p>
              <p className="text-gray-600 text-center">See exactly where you're overspending and what to do about it</p>
            </div>

            <div className={`flex flex-col justify-start items-center bg-white rounded-2xl p-8 w-[30%] max-md:w-[100%] shadow-md ${
      card3.state === "hidden"
          ? "opacity-0 scale-75"
          : ""
          }

  ${
      card3.state === "visible"
      ? "animate-popIn"
      : ""
  }

  ${
      card3.state === "leaving"
          ? "animate-popOut"
          : ""
  }`} ref={card3.ref}>
              <span className="bg-blue-700 rounded-full p-5 font-extrabold text-white text-2xl py-[10px] px-[20px] ml-[-8px]">3</span>
              <p className="text-black font-bold mt-4">Start Saving</p>
              <p className="text-gray-600 text-center">View your report and implement changes immediately</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
