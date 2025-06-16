import { useState } from "react";
import supabase from "@/utils/supabase/client";

export default function StudentTable({
  students,
  teacherId,
  onRefresh,
  className,
  showAddForm = false,
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
      .update({ name: editData.name })
      .eq("id", editData.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      alert("Student updated");
      setEditData(null);
      onRefresh();
    }
  };

  return (
    <table className="w-full mt-8 text-left overflow-hidden rounded-2xl shadow-lg">
      <thead>
        <tr
          style={{
            background: "linear-gradient(135deg, #00408C 0%, #96ADD6 100%)",
          }}
        >
          <th className="p-4 text-white font-semibold">Name</th>
          <th className="p-4 text-white font-semibold">Class</th>
          {showAddForm && (
            <th className="p-4 text-white font-semibold">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr
            key={student.id}
            className="border-b border-opacity-20 hover:shadow-md transition-all duration-300"
            style={{
              backgroundColor: index % 2 === 0 ? "#F2EEE9" : "#F2D7D3",
              borderColor: "#96ADD6",
            }}
          >
            <td className="p-4" style={{ color: "#00408C" }}>
              {student.name}
            </td>
            <td className="p-4" style={{ color: "#00408C" }}>
              {className}
            </td>
            {showAddForm && (
              <td className="p-4 space-x-3">
                <button
                  onClick={() => handleEdit(student)}
                  className="font-medium hover:underline transition-all duration-200"
                  style={{ color: "#96ADD6" }}
                >
                  Edit
                </button>

                <button
                  className="px-4 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #E85234 0%, #F9B8AF 100%)",
                  }}
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>

      {editData && showAddForm && (
        <tfoot>
          <tr>
            <td
              colSpan="3"
              className="pt-6 pb-4 px-4"
              style={{ backgroundColor: "#F2EEE9" }}
            >
              <div className="flex gap-4 items-center">
                <input
                  className="flex-1 px-4 py-3 rounded-xl border-0 shadow-lg focus:shadow-xl transition-all duration-300 outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    backgroundColor: "white",
                    color: "#00408C",
                    focusRingColor: "#96ADD6",
                  }}
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
                <button
                  onClick={updateStudent}
                  className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #96ADD6 0%, #00408C 100%)",
                  }}
                >
                  Save
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}
