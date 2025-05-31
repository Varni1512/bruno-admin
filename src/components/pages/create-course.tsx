import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import Editor from "../shared/editor";
import { isEmptyHtml } from "../../lib/utils";
import { createCourse } from "../../firebase/courses.action";
import { useNavigate } from "react-router-dom";
import CurrencyDropdown from "../shared/currency-dropdown";
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
}
export default function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    description: '',
    ratings: '',
    reviews: '',
    studentsEnrolled: '',
    price: '',
    requirements: '<p>Initial content goes here!</p>',
    currency: 'USD'
  });
  const [coverImage, setCoverImage] = useState<any>("");

  const imgRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  const handleCurrencyChange = (newCurrency: string) => {
    setFormData(prev => ({ ...prev, currency: newCurrency }));
  };

  const handleContentChange = (html: string) => {
    setFormData(prev => ({ ...prev, requirements: html }));
    console.log('Editor content changed:', html);
  };
  const handleImage = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "burno_s");
    formData.append("folder", "courses");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/db44hbcwp/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCoverImage(data.secure_url); 
      console.log("Uploaded image URL:", data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const isDisabled = !coverImage || !formData?.requirements || isEmptyHtml(formData?.requirements) || !formData?.title || !formData?.description || !formData?.ratings || !formData?.reviews || !formData?.studentsEnrolled || !formData?.price || !formData?.currency || !formData?.subTitle;

  const handleCourseSubmit = async () => {
    if (!coverImage) {
      console.error("Cover image is required.");
      return;
    }

    const courseData: Omit<CourseData, 'createdAt'> = {
      ...formData,
      coverImage: coverImage,
    };

    try {
      const courseId = await createCourse(courseData);
      console.log('Course created with ID:', courseId);
      if (courseId) {
        navigate(`/dashboard/courses`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };


  return (
    <>
      <div className="h-16 flex justify-between px-4 items-center  text-xl w-full border border-pre rounded-xl">
        <p>Create Course</p>
        <button
          disabled={isDisabled}
          onClick={handleCourseSubmit}
          className={`
        h-fit  rounded-3xl  flex items-center  justify-center px-8 py-2 text-white font-semibold
        ${isDisabled ? 'bg-gray-500 cursor-none' : "bg-purple-950/50 hover:bg-purple-950 cursor-pointer"}
        `}>
          Save
        </button>
      </div>
      <section className="flex h-full w-full gap-2">
        <section className="flex-1">
          <div className="space-y-4 flex-1 p-4">
            <div className="flex flex-col items-start">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="border border-pre w-full rounded-lg p-2 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="title">Sub Title</label>
              <textarea
                rows={2}
                id="subTitle"
                value={formData.subTitle}
                onChange={handleInputChange}
                className="border border-pre w-full rounded-lg p-2 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
              />
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="description">Description</label>
              <textarea
                rows={5}
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border border-pre w-full rounded-lg p-2 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
              />
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="ratings">Ratings</label>
              <input
                max={5}
                type="number"
                id="ratings"
                value={formData.ratings}
                onChange={handleInputChange}
                className="border border-pre w-full rounded-lg p-2 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
              />
            </div>

            <article className="flex gap-4">
              <div className="flex-1 flex flex-col items-start">
                <label htmlFor="reviews">Reviews</label>
                <input
                  type="number"
                  id="reviews"
                  value={formData.reviews}
                  onChange={handleInputChange}
                  className="border border-pre w-full rounded-lg p-2 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col items-start">
                <label htmlFor="studentsEnrolled">Students Enrolled</label>
                <input
                  type="number"
                  id="studentsEnrolled"
                  value={formData.studentsEnrolled}
                  onChange={handleInputChange}
                  className="border border-pre w-full rounded-lg p-2 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
                />
              </div>
            </article>
            <div className="flex gap-4">
              <div className="flex-[2] flex flex-col items-start">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="border border-pre w-full rounded-lg p-2 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
                />
              </div>
              <CurrencyDropdown
              selected={formData.currency}
              onChange={handleCurrencyChange}
              />

            </div>

          </div>
        </section>

        <section className="flex-1 p-2">
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="h-fit max-h-80 relative flex flex-col gap-2 pointer-events-auto">


            <label htmlFor="imgUrl">Cover Image</label>


            {coverImage ? (
              <div className="flex-col group h-72 flex relative">
                {
                  coverImage && (
                    <button
                      onClick={() => setCoverImage("")}
                      className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-1 z-[999] right-1 rounded-full bg-purple-400 dark:bg-[#19001C] p-2"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  )
                }
                <img src={coverImage} alt="Cover" className="h-72 object-cover rounded-xl" />
              </div>
            ) : (
              <div
                className="flex-col relative h-72 min-h-72 flex items-center justify-center rounded-xl border border-pre cursor-pointer px-2 py-1 hover:dark:bg-[#19001C] transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  imgRef.current?.click();
                }}
              >

                <Plus size={20} />
                <p className="text-xs text-neutral-400">Click to insert image</p>
                <input
                  ref={imgRef}
                  type="file"
                  id="imgUrl"
                  className="hidden"
                  onChange={handleImage}
                />
              </div>
            )}
          </div>

          <div className="mt-[28px]">
            <p className="pb-0.5">Requirements</p>
            <Editor
              max={240}
              initialValue={formData.requirements}
              onChange={handleContentChange}
            />
          </div>
        </section>
      </section>
    </>
  );
}
