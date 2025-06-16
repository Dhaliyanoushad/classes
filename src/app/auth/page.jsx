"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase/client";
import Link from "next/link";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isSignup ? "Sign Up" : "Log In"}
      </h1>

      {isSignup && (
        <input
          className="border p-2 mb-3 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        className="border p-2 mb-3 w-full"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 mb-4 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={isSignup ? handleSignup : handleLogin}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        {isSignup ? "Sign Up" : "Log In"}
      </button>

      <button
        onClick={() => {
          setIsSignup(!isSignup);
          setMessage("");
        }}
        className="text-sm text-gray-600 mt-4 underline w-full"
      >
        {isSignup
          ? "Already have an account? Log In"
          : "Don't have an account? Sign Up"}
      </button>

      {message && (
        <>
          <p className="mt-4 text-sm text-gray-700">{message}</p>
          <Link
            href="https://mail.google.com"
            className="text-blue-600 underline mt-2 block"
          >
            Go to MAil
          </Link>
        </>
      )}
    </div>
  );
}
