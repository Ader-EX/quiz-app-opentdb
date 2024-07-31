import { useState } from "react";
import { useAuth } from "../components/auth/AuthCtx";
import { useNavigate } from "react-router-dom";
import { MdQuiz } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const isLoginCorrect = login(username, password);
    if (!isLoginCorrect) {
      toast.error("Invalid username or password", {
        position: "bottom-right",
        autoClose: 5000,
      });
      return;
    }
    toast.success("Login successful", {
      position: "bottom-right",
      autoClose: 5000,
    });

    navigate("/dashboard");

    console.log("Login submitted", { username, password });
  };

  return (
    <>
      <ToastContainer />{" "}
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-1/2  w-full h-full flex items-center justify-center bg-gray-100">
          <div className="max-w-md w-full p-6">
            <div className="flex flex-col gap-y-2">
              <MdQuiz className="w-6 h-6 s-0 text-blue-500" />
              <h1 className="text-2xl font-bold  ">Sign in to your account</h1>
              <h2 className="mb-6">
                Not a member? <span>Sign up instead</span>
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full  bg-gradient-to-br from-purple-600  to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800  text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>

        <img
          className="md:w-1/2 hidden md:block w-full bg-contain bg-center  h-full md:h-auto"
          src="/img/img-1.jpeg"
          alt="image"
        ></img>
      </div>
    </>
  );
};

export default Login;
