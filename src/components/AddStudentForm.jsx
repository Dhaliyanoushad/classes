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
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Student</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Student Name"
        className="border p-2 mr-2 rounded"
      />
      <button
        onClick={handleAdd}
        disabled={loading || !name.trim()}
        className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
