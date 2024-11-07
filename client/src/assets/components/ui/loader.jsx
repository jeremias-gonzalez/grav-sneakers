import LogoLoader from "./LogoLoader";
import "./loader.css"

export default function Loader() {
  return (
    <div className="flex flex-col justify-center my-20"> 
  <div className="items-center ml-[-4.5rem] mb-[1rem] md:ml-[-5rem]">
  <LogoLoader/>
  </div> 
    <div className="loader"></div>
  </div>
  );
}