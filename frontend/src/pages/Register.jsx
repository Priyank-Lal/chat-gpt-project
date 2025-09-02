import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/actions/userAction";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


const Register = () => {
  const { register, handleSubmit, reset } = useForm();
  const [registerError, setRegisterError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const registerHandler = async (userDetails) => {
    setIsLoading(true);
    setRegisterError("");

    const result = await dispatch(registerUser(userDetails));

    if (result?.success) {
      navigateTo("/");
    } else {
      setRegisterError(
        "Registration failed. Please check your details and try again."
      );
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex bg-[#1a1a1a]">
      {/* Left Side - register Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-8">
          {/* Logo and Brand */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-2"
          >
            <img
              src="../../../public/icons8-ai.svg"
              alt="Nebula Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-white">Nebula</span>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-gray-300 text-4xl font-extrabold">Register</h1>
            <p className="text-gray-300">
              Welcome to Nebula! Please enter your details.
            </p>
          </motion.div>

          {/* Error Message */}
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                ></path>
              </svg>
              <span>{registerError}</span>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(registerHandler)}
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="space-x-4 flex">
              <div className="flex flex-col space-y-2 w-1/2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-300"
                >
                  First Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    type="text"
                    placeholder=""
                    {...register("firstName")}
                    className="h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2 w-1/2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-300"
                >
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    type="text"
                    placeholder=""
                    {...register("lastName")}
                    className="h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="olivia@untitledui.com"
                  {...register("email")}
                  className="h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder=""
                  autoComplete="password"
                  {...register("password")}
                  className="h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white"
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-blue-400">
                  {isPasswordVisible ? (
                    <>
                      <EyeClosed
                        size={20}
                        className="cursor-pointer text-gray-400"
                        onClick={() => setIsPasswordVisible(false)}
                      />
                    </>
                  ) : (
                    <>
                      <Eye
                        size={20}
                        className="cursor-pointer text-gray-400"
                        onClick={() => setIsPasswordVisible(true)}
                      />
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 hover:bg-blue-600 bg-blue-500 hover:scale-102 hover:shadow-lg text-white font-medium rounded-xl transition-transform cursor-pointer"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-100 shadow-md hover:scale-102 hover:shadow-lg font-medium rounded-xl flex items-center justify-center space-x-2 cursor-pointer text-gray-700"
              >
                <Chrome className="w-5 h-5" />
                <span>Sign in with Google</span>
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center pt-4">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <button
                onClick={() => navigateTo("/login")}
                className="text-blue-300 hover:text-blue-400 font-medium cursor-pointer"
              >
                Log In
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Welcome Content */}
      <motion.div
        className="flex-1 p-10 flex flex-col justify-center items-center relative overflow-hidden"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-lg text-center space-y-8 z-10 w-full">
          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 px-4"
          >
            <h2 className="text-5xl font-extrabold text-blue-400">
              Welcome to Nebula
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Harness the power of advanced analytics and insights. Streamline
              your workflow, enhance productivity, and create exceptional
              experiences for your users.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
