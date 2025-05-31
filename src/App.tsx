import Sidebar from "./components/core/sidebar"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Blogs from "./components/pages/blogs";
import Courses from "./components/pages/courses";
import Settings from "./components/pages/settings";
import EditBlogs from "./components/pages/edit-blogs";
import EditCourse from "./components/pages/edit-course";
import CreateBlog from "./components/pages/create-blog";
import CreateCourse from "./components/pages/create-course";
import SignIn from "./components/pages/sign-in";
import ProtectedRoute from "./components/core/ProtectedRoute";
import { useAuth } from "./lib/auth-context";

function DashboardLayout() {
  return (
    <main className="h-screen overflow-hidden w-full flex p-2">
      <Sidebar />
      <div className="flex flex-col w-full ml-2 rounded-xl border border-pre p-2">
        <Outlet /> 
      </div>
    </main>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/sign-in"
          element={isAuthenticated ? <Navigate to="/dashboard/blogs" replace /> : <SignIn />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="blogs" element={<Blogs />} />
            <Route path="courses" element={<Courses />} />
            <Route path="settings" element={<Settings />} />
            <Route path="create-blog" element={<CreateBlog />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="edit-blog/:blogId" element={<EditBlogs />} />
            <Route path="edit-course/:courseId" element={<EditCourse />} />

            <Route index element={<Navigate to="blogs" replace />} />
          </Route>
        </Route>

        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard/blogs" replace /> : <Navigate to="/sign-in" replace />}
        />

        <Route
          path="*"
          element={isAuthenticated ? <Navigate to="/dashboard/blogs" replace /> : <Navigate to="/sign-in" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
