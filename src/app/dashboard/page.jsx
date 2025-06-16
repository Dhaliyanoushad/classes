"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import StudentTable from "@/components/StudentTable";
import AddStudentForm from "@/components/AddStudentForm";
import ClassCard from "@/components/ClassCard";
import {
  Plus,
  LogOut,
  Users,
  BookOpen,
  Eye,
  EyeOff,
  Settings,
  GraduationCap,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [className, setClassName] = useState("");
  const [hasClass, setHasClass] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F2EEE9" }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#96ADD6", borderTopColor: "transparent" }}
          />
          <p style={{ color: "#00408C" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EEE9] p-8 flex flex-col gap-8">
      <div
        className="flex justify-between items-center mb-8 p-6 rounded-3xl shadow-lg backdrop-blur-sm border transition-all duration-300"
        style={{
          backgroundColor: "rgba(242, 238, 233, 0.9)",
          borderColor: "#96ADD6",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#00408C" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "#00408C" }}>
              Welcome back, {teacher?.name}!
            </h2>
            <p className="text-sm opacity-70" style={{ color: "#00408C" }}>
              Ready to inspire minds today?
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{
            backgroundColor: "#F2D7D3",
            color: "#E85234",
          }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>

      {/* Create Class Section */}
      <div
        className="p-6 rounded-3xl shadow-lg border transition-all duration-300 mb-8"
        style={{
          backgroundColor: "rgba(150, 173, 214, 0.1)",
          borderColor: "#96ADD6",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#96ADD6" }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold" style={{ color: "#00408C" }}>
            Create New Class
          </h3>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name (e.g., Mathematics 101)"
              className="w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-105"
              style={{
                borderColor: className ? "#00408C" : "#96ADD6",
                backgroundColor: "#F2EEE9",
                color: "#00408C",
              }}
            />
          </div>

          <button
            onClick={handleCreateClass}
            disabled={!className.trim()}
            className="px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, #E85234 0%, #00408C 100%)`,
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Class
          </button>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, #00408C 0%, transparent 70%)`,
            top: "10%",
            right: "10%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, #96ADD6 0%, transparent 70%)`,
            bottom: "20%",
            left: "5%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
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
      `}</style>
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
