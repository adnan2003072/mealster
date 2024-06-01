import { BarLoader, BeatLoader } from "react-spinners";

export default function Loader() {
  return (<div className="flex h-[100vh] w-full justify-center items-center">
    <BeatLoader color="#7B171C" speedMultiplier={1}/>
  </div>)
}