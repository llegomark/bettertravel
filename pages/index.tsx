import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { BibleType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { useRouter } from "next/router";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

const Home: NextPage = () => {
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [verse, setVerse] = useState("");
  const [bible, setBible] = useState<BibleType>("1");
  const [generatedVerses, setGeneratedVerses] = useState<String>("");

  const router = useRouter();
  useEffect(() => {}, []);

  const prompt = `As a tour guide expert, please create a comprehensive and optimized itinerary for me as a tourist in ${verse} for ${bible} days. The itinerary should include the best tourist attractions, unique cultural experiences, and hidden gems the city has to offer, as well as suggestions for restaurants, cafes, and other must-see places with a focus on efficiency and time management. Please also include information on the related transportation for each itinerary item if necessary only. Label each day clearly using only the numbers, for example "1. Day One:", "2. Day Two:", "3. Day Three:", "4. Day Four:", "5. Day Five:", "6. Day Six:", "7. Day Seven:". ${
    verse.slice(-1) === "." ? "" : "."
  }`;

  switch (bible) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
      break;
    default:
      throw new Error("Invalid Category");
  }

  const generateVerse = async (e: any) => {
    e.preventDefault();
    setGeneratedVerses("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      setResponse({
        status: response.status,
        body: await response.text(),
        headers: {
          "X-Ratelimit-Limit": response.headers.get("X-Ratelimit-Limit"),
          "X-Ratelimit-Remaining": response.headers.get(
            "X-Ratelimit-Remaining"
          ),
          "X-Ratelimit-Reset": response.headers.get("X-Ratelimit-Reset"),
        },
      });
      setLoading(false);
      alert(`Rate limit reached, try again after one minute.`);
      return;
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedVerses((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  const isDisabled = () => {
    const trimmedVerse = verse.trim();
    if (trimmedVerse.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const limitCharacters = (e: any) => {
    if (e.target.value.length > 1500) {
      e.target.value = e.target.value.substr(0, 1500);
      toast.error("You have reached the maximum number of characters.");
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>
          Experience the Best of Every Destination with AI Assistance - Better
          Travel
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="sm:mt-15 mt-12 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h2 className="mx-auto max-w-4xl text-5xl font-bold tracking-normal text-slate-900 sm:text-6xl md:text-7xl">
          Experience the Best of Every Destination: Get Your AI-Generated
          Itinerary Today
        </h2>
        <p className="mx-auto mt-12 max-w-xl text-lg leading-7 text-slate-900 sm:text-base lg:text-lg">
          Get a personalized travel plan in seconds with our Artificial
          Intelligence (AI)-generated itinerary. Say goodbye to stress and
          frustration, and hello to more time for adventure. Whether you're a
          seasoned traveler or a first-timer, our itinerary ensures you make the
          most of your trip.
        </p>
        <div className="max-w-xl w-full px-6">
          <div className="flex mt-10 items-center align-items-center">
            <span className="text-white bg-black rounded-full w-8 h-8 text-center flex items-center justify-center leading-zero p-0">
              1
            </span>
            <p className="ml-3 text-left text-base">
              Type the name of the city and country.
            </p>
          </div>
          <textarea
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            onInput={limitCharacters}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisabled()) {
                e.preventDefault();
                generateVerse(e);
              }
            }}
            rows={4}
            className="w-full mt-5 rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
            placeholder={
              "Be specific and include the country, for example: 'Paris, France'."
            }
          />
          <div className="flex mt-10 items-center align-items-center">
            <span className="text-white bg-black rounded-full w-8 h-8 text-center flex items-center justify-center leading-zero p-0">
              2
            </span>
            <p className="ml-3 text-left text-base">Select number of days.</p>
          </div>
          <div className="block mt-3">
            <DropDown
              bible={bible}
              setBible={(newBible) => setBible(newBible)}
            />
          </div>
          {!loading && (
            <button
              className="bg-black rounded-lg text-white text-base px-4 py-2 mt-10 hover:bg-black/80 w-full"
              onClick={(e) => generateVerse(e)}
              disabled={isDisabled()}
            >
              Generate Itinerary &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-lg text-white text-base px-4 py-2 mt-10 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedVerses && (
                <>
                  <div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mx-auto px-3">
                      Your Personalized Itinerary
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto px-3">
                    {generatedVerses
                      .substring(generatedVerses.indexOf("1") + 3)
                      .split(/[1-7]\./)
                      .map((generatedVerse) => {
                        const trimmedVerse = generatedVerse.trim();
                        return (
                          <div
                            className="bg-sky-200 rounded-xl shadow-md p-4 hover:bg-sky-100 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-copy border"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${trimmedVerse} (generated from https://travel.betterself.app/)`
                              );
                              toast("Generated Itinerary Copied!", {
                                icon: "✂️",
                              });
                            }}
                            key={trimmedVerse}
                          >
                            <p className="text-base leading-tight text-justify">
                              {trimmedVerse}
                            </p>
                          </div>
                        );
                      })}
                    <p className="flex bg-yellow-200 p-3 text-justify text-yellow-800 font-light leading-tight rounded-lg text-xs mt-2">
                      <InformationCircleIcon className="h-20 w-20 mr-2" />
                      <span>
                        Disclaimer: Our AI-generated itinerary is meant to serve
                        as inspiration and a starting point for your travels.
                        The information presented may not always be up-to-date
                        and is subject to change. We highly recommend conducting
                        your own research and confirming the details before
                        making any travel plans. Use of this service is for fun
                        and inspiration only, and by using it, you agree that
                        the itinerary may not be entirely accurate.
                      </span>
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;