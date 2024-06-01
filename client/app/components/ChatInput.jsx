import { PulseLoader } from "react-spinners"

export default function ChatInput({userInput, setUserInput, chatWithModel, loadingApiRes}) {

  function ResponseLoader() {
    return <PulseLoader color="#7B171C" size={7}/>
  }

  return <footer htmlFor="search-input" className="fixed bottom-0 px-2 md:px-4 pb-4 w-full lg:w-4/5 items-center" >
    <div className="relative flex">
      <input 
        id="search-input" 
        className="border-2 text-lg text-wrap p-1 border-gray-300 rounded-md w-full min-w-0 focus:border-[#7B171C] focus-visible:outline-none m-0 pl-2 pr-8 overflow-scroll"
        type="text"
        value={userInput}
        onChange={(event) => setUserInput(event.target.value)}
      />
      <button 
        className={`absolute right-2 top-1/2 transform -translate-y-1/2`}
        type="button"
        disabled={(loadingApiRes || !userInput) ? true : false}
        onClick={chatWithModel}
      > 
        {loadingApiRes ? <ResponseLoader /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-all ${!userInput ? "text-gray-300": "text-[#7B171C]"}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
        </svg>}
      </button>
    </div>
  </footer>
}