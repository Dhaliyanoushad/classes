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
  const [classStudents, setClassStudents] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classesOther, setClassesOther] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    const { data: session } = await supabase.auth.getSession();
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
    setHasClass(teacherData.classes?.length > 0);

    // ✅ REFETCH STUDENTS IN SELECTED CLASS
    if (selectedClassId) {
      const { data: updatedClassStudents } = await supabase
        .from("students")
        .select("*")
        .eq("class_id", selectedClassId);

      setClassStudents(updatedClassStudents || []);
    }

    // Optional: all students, if still needed
    const { data: allStudents } = await supabase
      .from("students")
      .select("*, classes(name, teacher_id)");

    setStudents(allStudents || []);

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
    if (selectedClassId === classId) {
      // If already selected, toggle off (close)
      setSelectedClassId(null);
      setClassStudents([]);
      return;
    }

    setSelectedClassId(classId);
    setClassStudents([]);

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", classId);

    if (error) {
      console.error("Error fetching class students:", error);
      return alert("Failed to fetch class students: " + error.message);
    }

    setClassStudents(data);
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
        <></>
      ) : (
        <>
          <ClassCard
            title="Your Classes"
            classes={classes}
            teacherId={teacher.id}
            selectedClassId={selectedClassId}
            classStudents={classStudents}
            handleViewClass={handleViewClass}
            onRefresh={fetchData}
            showAddForm={true}
          />
          <ClassCard
            title="Other Classes"
            classes={classesOther}
            teacherId={teacher.id}
            selectedClassId={selectedClassId}
            classStudents={classStudents}
            handleViewClass={handleViewClass}
            onRefresh={fetchData}
          />
        </>
      )}
    </div>
  );
}
