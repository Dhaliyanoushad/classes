// components/ClassCard.js
"use client";

import AddStudentForm from "./AddStudentForm";
import StudentTable from "./StudentTable";

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
      <h3 className="mb-4 font-semibold">{title}</h3>
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
              {showAddForm && (
                <AddStudentForm classId={cls.id} onRefresh={onRefresh} />
              )}
            </div>
            {selectedClassId == cls.id && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Students in Class</h4>

                {classStudents.length === 0 ? (
                  <p className="text-gray-600 italic">
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
