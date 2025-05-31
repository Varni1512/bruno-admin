import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config"; 

interface BlogData {
  coverImage: string | null;
  editorContent: any; 
  metaData: { 
    title: string;
    description: string;
  };
  createdAt: Date;
}

// Function to get all blogs
export const getBlogs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const blogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Blogs retrieved successfully.", blogs);
    return blogs as (BlogData & { id: string })[];
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Function to get a single blog by ID
export const getBlogById = async (id: string) => {
  try {
    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() } as BlogData & { id: string };
    } else {
      console.log("No such document!");
      return null; 
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e; 
  }
};

// Function to edit a blog by ID
export const updateBlog = async (id: string, updatedData: Partial<BlogData>) => {
  try {
    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, updatedData);
    console.log("Document updated successfully with ID: ", id);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e; // Re-throw the error
  }
};

export const deleteBlog = async (id: string) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
    console.log("Document deleted successfully with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const createBlog = async (blogData: Omit<BlogData, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      ...blogData,
      createdAt: new Date(), 
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; 
  }
};