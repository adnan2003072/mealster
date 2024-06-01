"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ChatbotNav from "../components/ChatbotNav";
import ChatInput from "../components/ChatInput";
import LogInFrom from "../components/LogInForm";
import SignInForm from "../components/SignInForm";
import Loader from "../components/Loader";

export default function Chatbot() {
  const {data: session, status} = useSession();
  
  const [loadingData, setLoadingData] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  
  const [user, setUser] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  useEffect(() => {
    async function fetchUser() {
      const email = session.user.email;
      try {
        await axios.get(`/api/chats?email=${email}`).then(response => {
          setUser(response.data);
          setChatHistory(response.data?.chatHistory ? response.data.chatHistory : []);
        });
      } catch (error) {
        console.log(error);
      }
    }
    
    if(status === "authenticated") {
      fetchUser();
    }
  }, [status]);
  
  useEffect(() => {
    if(session) {
      setIsLogInOpen(false);
      setIsSignInOpen(false);
    }
  }, [session]);

  
  const [userInput, setUserInput] = useState("");
  const [loadingApiRes, setLoadingApiRes] = useState(false);
  async function chatWithModel() {
    const newQA = {
      query: userInput,
      answer: ""
    };
    
    setLoadingApiRes(true);

    setChatHistory((prev) => (prev.length > 0 ?[...prev, newQA]: [newQA]));
    
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:5000/ai',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : JSON.stringify({query: userInput, chatHistory})
      };

      // getting response from api
      await axios.request(config).then((response) => {
          console.log(JSON.stringify(response.data));
          setChatHistory((prev) => {
            const updatedChatHistory = [...prev];
            updatedChatHistory[updatedChatHistory.length - 1].answer = response.data.answer;
            return updatedChatHistory;
          });
        }).then(() => {
          // sending new chatHistory to database
          if(session) {
            try {
              const email = session.user.email;
              axios.put('api/chats', {email, newChatHistory: chatHistory});
            } catch (error) {
              console.log("Error while updating chatHistory:", error);
            }
          }
        }).catch((error) => {
          console.log(error);
        });

      setUserInput("");
      setLoadingApiRes(false);
    } catch (error) {
      console.log("Error while getting data from api: ", error);
    }
  }

  async function handleClearChat() {
    setChatHistory([]);
    if(session) {
      try {
        const email = session.user.email;
        setLoadingData(true);
        await axios.put('api/chats', {email, newChatHistory: []});
        setLoadingData(false);
      } catch (error) {
        console.log("Error while updating chatHistory:", error);
      }
    }
  }

  useEffect(() => {
    if(status === "loading") {
      setLoadingData(true);
    } else if(status === "unauthenticated"){
      setLoadingData(false);
    } else if(status === "authenticated") {
      if(!session || !user) {
        setLoadingData(true);
      } else {
        setLoadingData(false);
      }
    }
  }, [status]);

  function createMarkup(text) {
    // Replace newline characters with <br> tags
    let htmlText = text.replace(/\n/g, '<br>');
    
    // Replace **text** with <strong>text</strong>
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return { __html: htmlText };
}


  if(!loadingData) {
    return <div className="flex h-screen overflow-y-hidden bg-white scrollbar lg:justify-end text">
      {!session && <>
        <LogInFrom
          isLogInOpen={isLogInOpen}
          logInClose={() => setIsLogInOpen(false)}
        />

        <SignInForm
          isSignInOpen={isSignInOpen}
          signInClose={() => setIsSignInOpen(false)}
        />
      </>}

      <ChatbotNav
        show={showNav}
        clearChat={handleClearChat}
        setShowNav={setShowNav}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        openLogIn={() => {
          setIsLogInOpen(true);
          setIsSignInOpen(false);
        }}
        openSignIn={() => {
          setIsSignInOpen(true)
          setIsLogInOpen(false);
        }}
      />

      <div className="flex flex-col w-full lg:w-4/5 p-1 md:p-4">
        <h1 className="hidden lg:flex text-[#7B171C] text-2xl font-bold">
          Mealster
        </h1>
        {/* header */}
        <div className="flex lg:hidden justify-center">
          <button
            className="absolute left-1 md:left-4 z-30"
            onClick={() => setShowNav((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div className="flex">
            <h1 className="text-[#7B171C] align-center text-2xl font-bold">
              Mealster
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 mb-14 pr-2 overflow-y-scroll scrollbar">
          {chatHistory && chatHistory.length > 0 && chatHistory.map((qa, index) => <div key={`query-answer-`+index}>
            <div className="flex flex-col bg-gray-100 rounded-2xl">
              <div className="px-3 py-2 h-min text-sm lg:text-base">
                {qa.query}
              </div>
            </div>
            <div className="flex flex-col mt-3">
              <div className="flex gap-1">
                <img src="/logo.png" className="w-8" alt="image not found"/>
                <p className="font-bold mt-auto text-[#7B171C]">Mealster</p>
              </div>
              <div className="px-3 py-2 h-min text-sm lg:text-base text-wrap" dangerouslySetInnerHTML={createMarkup(qa.answer)}>
              </div>
            </div>
          </div>)}
        </div>
      </div>
      <ChatInput userInput={userInput} setUserInput={setUserInput} chatWithModel={chatWithModel} loadingApiRes={loadingApiRes}/>
    </div>
  } else {
    return <Loader />
  }
}