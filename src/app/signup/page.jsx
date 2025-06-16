"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log(data.user);

    if (error) return alert("Signup failed: " + error.message);

    await supabase.auth.getSession(); // wait for session to be ready
    const { data: currentSession } = await supabase.auth.getUser();
    console.log(currentSession);

    const user = currentSession?.user;

    if (user) {
      const { error: insertError } = await supabase.from("teachers").insert([
        {
          name: name,
          auth_user_id: user.id,
        },
      ]);

      if (insertError) {
        alert(
          "User created but failed to register as teacher: " +
            insertError.message
        );
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Sign Up</h1>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-4 w-full"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        Sign Up
      </button>
    </div>
  );
}
