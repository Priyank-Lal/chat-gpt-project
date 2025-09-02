import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/actions/userAction";
import { useDispatch } from "react-redux";

const Register = () => {
  const { register, handleSubmit, reset } = useForm();
  const [registerError, setRegisterError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="min-h-screen flex bg-[var(--gradient-theme)]">
      {/* Left Side - register Form */}
      <motion.div
        className="flex-1 flex items-center justify-center bg-white p-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Brand */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Nebula</span>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Register</h1>
            <p className="text-gray-600">
              Welcome to Nebula! Please enter your details.
            </p>
          </motion.div>

          {/* Error Message */}
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {registerError}
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(registerHandler)}
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="space-x-4 flex">
              <div className="flex flex-col space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder=""
                  {...register("firstName")}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder=""
                  {...register("lastName")}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="olivia@untitledui.com"
                {...register("email")}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="password"
                {...register("password")}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Chrome className="w-5 h-5" />
                <span>Sign in with Google</span>
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigateTo("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Log In
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Welcome Content */}
      <motion.div
        className="flex-1 bg-[#1e3a8a] p-10 flex flex-col justify-center items-center text-white relative overflow-hidden"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-white opacity-10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-white opacity-10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white opacity-5 rounded-full filter blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-lg text-center space-y-8 z-10 w-full">
          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 px-4"
          >
            <h2 className="text-5xl font-bold">Welcome to Nebula</h2>
            <p className="text-white text-lg leading-relaxed">
              Harness the power of advanced analytics and insights. Streamline
              your workflow, enhance productivity, and create exceptional
              experiences for your users.
            </p>
          </motion.div>

          {/* Chat-style Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 space-y-6 max-w-md mx-auto relative"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-[#1e3a8a]" />
              </div>
              <span className="font-medium text-white">Nebula</span>
            </div>

            <div className="bg-white rounded-xl p-4 text-[#1e3a8a] shadow-sm max-w-[80%] mx-auto">
              Hello, this is Nebula, your intelligent assistant. In today's
              session, we'd like to show you the powerful analytics capabilities
              and insights you'll gain access to.
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-xl p-4 max-w-xs text-white shadow-sm">
                <div className="text-right mb-1 text-xs opacity-75">You</div>
                Yes, I'm ready. Let&apos;s explore!
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
