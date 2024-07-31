import "./App.css";
import Button from "./components/ui/Button";
import { FiArrowUpRight } from "react-icons/fi";

function App() {
  return (
    <div className="overflow-x-hidden p-6">
      <section className="relative z-10 text-left px-8 py-0 ">
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold italic">Sports</h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-br from-purple-600 to-blue-500 bg-clip-text text-transparent">
            QUIZ TEST APPLICATION.
          </h1>
        </div>
        <div className="mt-8">
          <img
            src="/img/img-1.jpeg"
            alt="image"
            width="0"
            height="0"
            sizes="100vw"
            className="h-40 md:h-60 lg:h-80 w-full md:w-[120%] lg:w-[150%] object-cover rounded-lg"
          />
        </div>
        <div className="mt-10 flex w-full justify-between">
          <Button href="/dashboard" className="">
            Take the quiz now
          </Button>
          <FiArrowUpRight className="s-0 w-8 h-8" />
        </div>
      </section>

      <div className="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <div className="absolute top-1/4 left-3/4 w-32 h-32 md:w-32 md:h-32 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full filter blur-3xl opacity-40"></div>
        </div>
      </div>

      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <div className="absolute top-2/4 right-4/5 w-32 h-32 md:w-32 md:h-32 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full filter blur-3xl opacity-40"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
