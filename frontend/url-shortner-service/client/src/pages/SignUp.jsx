import React, { useState } from "react";
import Loader from "../assets/Loader.svg"
import api from "../assets/Axios";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName:"",
    email: "",
    password: "",
    reType: "",
  });
  const [passwordNotMatch, setPasswordMatch] = useState(false);
  const [loading,setLoading]=useState(false);
   const [error,setError]=useState();
   navigate=useNavigate();
  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };
  const handlefullNameChange = (e) => {
    setFormData({ ...formData, fullName: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
if (formData.password !== formData.reType) {
      alert("The passwords do not match");
      return;
    }

    setLoading(true);

    try {
     
      const response = await api.post("/user/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

   
      console.log("Registered User:", response.data);
      alert("Account created successfully!");
      
    } catch (err) {
      // Axios stores backend error messages in err.response.data
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans min-h-screen p-6 w-full flex justify-center items-center bg-yellow-200">
      <div className="flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl font-extrabold text-yellow-950 tracking-tight leading-tight">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
           <div className="flex flex-col gap-2">
            <label className="text-yellow-950 font-bold ml-1">
              fullname
            </label>
            <input
              type="fullName"
              name="fullName"
              placeholder="alex"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handlefullNameChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-yellow-950 font-bold ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="alex@example.com"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handleEmailChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-yellow-950 font-bold ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handlePasswordChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-yellow-950 font-bold ml-1">
              Re-Type Password
            </label>
            <input
              type="password"
              name="reType"
              placeholder="••••••••"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handlePasswordChange}
            />
          </div>

          {passwordNotMatch && (
            <div className="text-red-500 font-bold font-sans text-xl">
              The passwords do not match
            </div>
          )}

          <button
            type="submit"
            className="mt-4 hover:text-yellow-950 bg-yellow-600 text-white font-bold py-4 rounded-2xl hover:bg-yellow-400 active:scale-95 transition-all shadow-lg text-lg cursor-pointer"
          >

           {loading ? (
              <img src={Loader} alt="loading..." className="w-8 h-8 animate-spin" />
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
