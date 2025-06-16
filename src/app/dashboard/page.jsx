"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import StudentTable from "@/components/StudentTable";
import AddStudentForm from "@/components/AddStudentForm";
import ClassCard from "@/components/ClassCard";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [className, setClassName] = useState("");
  const [hasClass, setHasClass] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classView, setClassView] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classesOther, setClassesOther] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    const { data: session } = await supabase.auth.getSession();
    console.log(session);

    if (!session?.session?.user) return router.push("/auth");

    const uid = session.session.user.id;

    const { data: teacherData } = await supabase
      .from("teachers")
      .select("*, classes(id, name)")
      .eq("auth_user_id", uid)
      .single();

    if (!teacherData) return;

    setTeacher(teacherData);
    setClasses(teacherData.classes || []);
    console.log(teacherData);

    setHasClass(teacherData.classes?.length > 0);
    const { data: allStudents } = await supabase
      .from("students")
      .select("*, classes(name, teacher_id)");

    setStudents(allStudents || []);
    console.log("All students:", allStudents);
    const { data: otherClasses } = await supabase
      .from("classes")
      .select("*")
      .neq("teacher_id", teacherData.id);
    setClassesOther(otherClasses);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleCreateClass = async () => {
    if (!className) return alert("Class name required");
    const { error } = await supabase.from("classes").insert([
      {
        name: className,
        teacher_id: teacher.id,
      },
    ]);
    console.log("Creating class:", teacher.classes);

    if (error) {
      alert("Class creation failed: " + error.message);
    } else {
      setClassName("");
      fetchData();
    }
  };
  const handleViewClass = async (classId) => {
    setClassView([]);
    setSelectedClassId(classId);
    console.log(classId);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", classId);
    if (error) {
      console.error("Error fetching class students:", error);
      return alert("Failed to fetch class students: " + error.message);
    }
    console.log(data);

    setClassView(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Hi, {teacher?.name}</h2>
        <button onClick={handleLogout} className="text-red-500">
          Logout
        </button>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 font-semibold">Create a Class</h3>
        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class Name"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateClass}
          className="bg-blue-600 text-white px-4 py-1"
        >
          Create
        </button>
      </div>

      {!hasClass ? (
        <div className="mb-6">
          <h3 className="mb-2 font-semibold">Create a Class</h3>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name"
            className="border p-2 mr-2"
          />
          <button
            onClick={handleCreateClass}
            className="bg-blue-600 text-white px-4 py-1"
          >
            Create
          </button>
        </div>
      ) : (
        <>
          <h3 className="mb-4 font-semibold">Your Classes</h3>
          <ul className="space-y-3">
            {classes.map((cls) => (
              <li
                key={cls.id}
                className="bg-blue-100 p-4 rounded border flex flex-col"
              >
                <div className="bg-blue-50 p-4 rounded border flex justify-between items-center">
                  <span className="font-medium">{cls.name}</span>
                  <button
                    className="bg-blue-300 p-2 rounded-2xl"
                    onClick={() => handleViewClass(cls.id)}
                  >
                    View Class
                  </button>
                  <AddStudentForm classId={cls.id} onRefresh={fetchData} />{" "}
                </div>
                {selectedClassId == cls.id && classView.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Students in Class</h4>
                    <StudentTable
                      students={classView}
                      teacherId={teacher.id}
                      onRefresh={fetchData}
                      className={cls.name}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          <ClassCard
            title="Other Classes"
            classes={classesOther}
            teacherId={teacher.id}
            selectedClassId={selectedClassId}
            classView={classView}
            handleViewClass={handleViewClass}
            onRefresh={fetchData}
          />
        </>
      )}
    </div>
  );
}
