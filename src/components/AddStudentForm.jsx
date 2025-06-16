"use client";

import { useState } from "react";
import supabase from "@/utils/supabase/client";

export default function AddStudentForm({ classId, onRefresh }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      alert("Please enter a student name.");
      return;
    }

    setLoading(true);
    const capitalizedName = name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const { error } = await supabase
      .from("students")
      .insert([{ name: capitalizedName, class_id: classId }]);

    if (error) {
      alert("Insert failed: " + error.message);
    } else {
      setName("");
      onRefresh();
    }

    setLoading(false);
  };

  return (
    <div className="mb-8">
      <h3
        className="font-bold text-xl mb-4 bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent"
        style={{ color: "#00408C" }}
      >
        Add Student
      </h3>
      <div className="flex gap-4 items-center">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student Name"
          className="flex-1 px-4 py-3 rounded-xl border-0 shadow-lg focus:shadow-xl transition-all duration-300 outline-none focus:ring-2 focus:ring-opacity-50"
          style={{
            backgroundColor: "#F2EEE9",
            color: "#00408C",
            focusRingColor: "#96ADD6",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !name.trim()}
          className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          style={{
            background:
              loading || !name.trim()
                ? "#96ADD6"
                : "linear-gradient(135deg, #E85234 0%, #F9B8AF 100%)",
          }}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
