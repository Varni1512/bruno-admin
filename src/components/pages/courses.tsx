import { Edit, Loader2, ShieldAlert, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, deleteCourse } from "../../firebase/courses.action";

interface CourseData {
  id: string;
  title: string;
  description: string;
  ratings: string;
  reviews: string;
  studentsEnrolled: string;
  price: string;
  requirements: string;
  coverImage: string | null;
  createdAt: Date;
}

export default function Courses() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        setError('Failed to fetch courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this course?");
    if (!confirm) return;

    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert("Something went wrong while deleting the course.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <span className="animate-spin"><Loader2 size={16} /></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <ShieldAlert size={16} /> {error}
      </div>
    );
  }

  return (
    <main className="overflow-y-scroll no-scrollbar">
      <div className="flex items-center justify-end py-2 px-2 sticky z-10 bg-[#ffffff] dark:bg-[#19001c] top-0 border-pre border rounded-lg">
        <Link to={'/dashboard/create-course'}
          className="py-2 px-12 rounded-3xl bg-purple-950/50 hover:bg-purple-950 text-white"
        >
          Create
        </Link>
      </div>

      <section className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 mt-4">
        {courses.map((course) => (
          <div className="group flex-col rounded-xl border border-pre w-full relative" key={course.id}>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 space-x-2 flex">
              <Link to={`/dashboard/edit-course/${course.id}`} className="p-2 rounded-md bg-purple-400 dark:bg-purple-950 cursor-pointer">
                <Edit className="h-4 w-4 text-white" />
              </Link>
              <button onClick={() => handleDelete(course.id)} className="p-2 rounded-md bg-red-500 dark:bg-red-700 cursor-pointer">
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
            <img className="w-full h-54 object-cover rounded-t-xl" src={course.coverImage!} alt="" />
            <div className="space-y-2 mt-2 px-2 pb-4">
              <p className="text-2xl font-semibold">{course.title}</p>
              <p className="text-base line-clamp-2">{course.description}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
