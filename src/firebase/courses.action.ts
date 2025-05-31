import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc, addDoc } from "firebase/firestore";
import { db } from "./config";

interface CourseData {
  title: string;
  subTitle: string;
  description: string;
  ratings: string; 
  reviews: string; 
  studentsEnrolled: string; 
  price: string;
  currency: string;
  requirements: string;
  coverImage: string | null; 
  createdAt: Date;
}

// Function to create a new course
export const createCourse = async (courseData: Omit<CourseData, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "courses"), {
      ...courseData,
      createdAt: new Date(), 
    });
    console.log("Course document written with ID: ", docRef.id);
    return docRef.id; 
  } catch (e) {
    console.error("Error adding course document: ", e);
    throw e; 
  }
};

// Function to get all courses
export const getCourses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Courses retrieved successfully.", courses);
    return courses as (CourseData & { id: string })[]; // Return array of courses with IDs
  } catch (e) {
    console.error("Error getting course documents: ", e);
    throw e; 
  }
};

// Function to get a single course by ID
export const getCourseById = async (id: string) => {
  try {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Course document data:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() } as CourseData & { id: string };
    } else {
     
      console.log("No such course document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting course document: ", e);
    throw e; 
  }
};

// Function to edit a course by ID
export const updateCourse = async (id: string, updatedData: Partial<CourseData>) => {
  try {
    const courseRef = doc(db, "courses", id);
    await updateDoc(courseRef, updatedData);
    console.log("Course document updated successfully with ID: ", id);
  } catch (e) {
    console.error("Error updating course document: ", e);
    throw e; 
  }
};

// Function to delete a course by ID
export const deleteCourse = async (id: string) => {
  try {
    await deleteDoc(doc(db, "courses", id));
    console.log("Course document deleted successfully with ID: ", id);
  } catch (e) {
    console.error("Error deleting course document: ", e);
    throw e;
  }
};