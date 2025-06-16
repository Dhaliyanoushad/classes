import { useState } from "react";
import supabase from "@/utils/supabase/client";

export default function StudentTable({
  students,
  teacherId,
  onRefresh,
  className,
}) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (student) => {
    setEditData(student); // show form with student info
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    setLoading(true);
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) alert("Delete failed: " + error.message);
    onRefresh();
    setLoading(false);
  };

  const updateStudent = async () => {
    const { error } = await supabase
      .from("students")
      .update({ name: editData.name }) // add more fields if needed
      .eq("id", editData.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      alert("Student updated");
      setEditData(null); // hide form
      onRefresh(); // refresh the student list
    }
  };

  return (
    <table className="w-full border mt-6 text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Name</th>
          <th className="p-2">Class</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="border-b">
            <td>{student.name}</td>
            <td>{className}</td>
            <td className="p-2">
              <button
                onClick={() => handleEdit(student)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-1 m-1"
                onClick={() => handleDelete(student.id)}
              >
                delete
              </button>
            </td>
          </tr>
        ))}
        {editData && (
          <div className="mt-4">
            <input
              className="border p-2"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
            <button
              onClick={updateStudent}
              className="ml-2 bg-green-500 text-white px-3 py-1"
            >
              Save
            </button>
          </div>
        )}
      </tbody>
    </table>
  );
}
