// components/ClassCard.js
"use client";

import AddStudentForm from "./AddStudentForm";
import StudentTable from "./StudentTable";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Plus,
  GraduationCap,
} from "lucide-react";

export default function ClassCard({
  title,
  classes,
  teacherId,
  selectedClassId,
  classStudents,
  handleViewClass,
  onRefresh,
  showAddForm = false,
}) {
  return (
    <div>
      <h3
        className="mb-6 text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent"
        style={{ color: "#00408C" }}
      >
        {title}
      </h3>
      <ul className="space-y-4">
        {classes.map((cls) => (
          <li
            key={cls.id}
            className="p-6 rounded-2xl border-0 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, #F2D7D3 0%, #F9B8AF 100%)",
              border: "1px solid rgba(150, 173, 214, 0.2)",
            }}
          >
            <div
              className="p-5 rounded-xl border-0 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #F2EEE9 0%, rgba(242, 238, 233, 0.8) 100%)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                className="font-semibold text-lg"
                style={{ color: "#00408C" }}
              >
                {cls.name}
              </span>
              <button
                className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #96ADD6 0%, #00408C 100%)",
                }}
                onClick={() => handleViewClass(cls.id)}
              >
                View Class
              </button>
              {showAddForm && (
                <AddStudentForm classId={cls.id} onRefresh={onRefresh} />
              )}
            </div>
            {selectedClassId == cls.id && (
              <div className="mt-6 animate-fadeIn">
                <h4
                  className="font-bold text-lg mb-4"
                  style={{ color: "#00408C" }}
                >
                  Students in Class
                </h4>

                {classStudents.length === 0 ? (
                  <p
                    className="italic text-lg py-8 text-center"
                    style={{ color: "#96ADD6" }}
                  >
                    No students in this class.
                  </p>
                ) : (
                  <StudentTable
                    students={classStudents}
                    teacherId={teacherId}
                    onRefresh={onRefresh}
                    className={cls.name}
                    showAddForm={showAddForm}
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
