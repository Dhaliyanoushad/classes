"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase/client";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // const handleSignup = async () => {
  //   setMessage("Signing up...");
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //   });

  //   if (error) return setMessage("Signup failed: " + error.message);

  //   if (data.user) {
  //     // User will get a confirmation email — don't insert yet
  //     setMessage("Check your email to confirm your account.");
  //   }
  // };

  const handleSignup = async () => {
    setMessage("Signing up...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return setMessage("Signup failed: " + error.message);

    const user = data?.user;
    console.log("User data:", user);

    if (user) {
      // Check if the teacher is already inserted
      const { data: existingTeacher, error: fetchError } = await supabase
        .from("teachers")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching teacher:", fetchError.message);
        return setMessage(
          "Failed to check existing teacher: " + fetchError.message
        );
      }

      if (!existingTeacher) {
        setMessage("Check your email to confirm your account.");
        const capitalizedName = name
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        // Insert only if not already present
        const { error: insertError } = await supabase.from("teachers").insert([
          {
            name: capitalizedName,
            auth_user_id: user.id,
          },
        ]);

        if (insertError) {
          return alert("Failed to add teacher: " + insertError.message);
        }
        // router.push("/dashboard");
      } else {
        setMessage("MailID already exists. Please log in.");
        // If the teacher already exists, we can redirect to login
        // router.push("/auth");
        return;
      }
    }
  };

  const handleLogin = async () => {
    setMessage("Logging in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setMessage("Login failed: " + error.message);

    // const user = data.user;

    // Insert into teachers table only if not already there
    // const { data: existingTeacher } = await supabase
    //   .from("teachers")
    //   .select("*")
    //   .eq("auth_user_id", user.id)
    //   .maybeSingle();

    // if (!existingTeacher) {
    //   const { error: insertError } = await supabase.from("teachers").insert([
    //     {
    //       name,
    //       auth_user_id: user.id,
    //     },
    //   ]);

    //   if (insertError) {
    //     console.warn("Insert failed or already exists:", insertError.message);
    //   }
    // }

    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, #F2EEE9 0%, #F2D7D3 50%, #F9B8AF 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 animate-pulse"
          style={{
            background: `radial-gradient(circle, #00408C 0%, transparent 70%)`,
            top: "10%",
            right: "10%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, #96ADD6 0%, transparent 70%)`,
            bottom: "20%",
            left: "5%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main card */}
        <div
          className="backdrop-blur-sm rounded-3xl p-8 shadow-2xl border transition-all duration-500 hover:shadow-3xl"
          style={{
            backgroundColor: "rgba(242, 238, 233, 0.9)",
            borderColor: "#96ADD6",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
              style={{ backgroundColor: "#00408C" }}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-bold mb-2 transition-all duration-300"
              style={{ color: "#00408C" }}
            >
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-600">
              {isSignup ? "Join us to get started" : "Sign in to continue"}
            </p>
          </div>

          <div className="space-y-6">
            {/* Name field for signup */}
            <div
              className={`transition-all duration-500 ${
                isSignup
                  ? "opacity-100 max-h-20"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                  style={{ color: name ? "#00408C" : "#96ADD6" }}
                />
                <input
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                  style={{
                    backgroundColor: "#F2EEE9",
                    borderColor: name ? "#00408C" : "#96ADD6",
                    color: "#00408C",
                  }}
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email field */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                style={{ color: email ? "#00408C" : "#96ADD6" }}
              />
              <input
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                style={{
                  backgroundColor: "#F2EEE9",
                  borderColor: email ? "#00408C" : "#96ADD6",
                  color: "#00408C",
                }}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                style={{ color: password ? "#00408C" : "#96ADD6" }}
              />
              <input
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                style={{
                  backgroundColor: "#F2EEE9",
                  borderColor: password ? "#00408C" : "#96ADD6",
                  color: "#00408C",
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 hover:scale-110"
                style={{ color: "#96ADD6" }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: isLoading
                  ? `linear-gradient(135deg, #96ADD6 0%, #00408C 100%)`
                  : `linear-gradient(135deg, #E85234 0%, #00408C 100%)`,
              }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Toggle auth mode */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
              className="text-sm font-medium transition-colors duration-300 hover:underline"
              style={{ color: "#00408C" }}
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Create one"}
            </button>
          </div>

          {/* Message display */}
          {message && (
            <div
              className="mt-6 p-4 rounded-2xl border transition-all duration-500 animate-fade-in"
              style={{
                backgroundColor:
                  message.includes("failed") || message.includes("error")
                    ? "#F2D7D3"
                    : "#F9B8AF",
                borderColor:
                  message.includes("failed") || message.includes("error")
                    ? "#E85234"
                    : "#96ADD6",
                color: "#00408C",
              }}
            >
              <p className="text-sm font-medium text-center">{message}</p>
              {message.includes("email") && (
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-3 text-sm font-medium underline transition-colors duration-300"
                  style={{ color: "#E85234" }}
                >
                  Open Gmail →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm opacity-70" style={{ color: "#00408C" }}>
            Secure authentication powered by modern encryption
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
