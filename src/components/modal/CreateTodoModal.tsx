"use client";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodo } from "@/services/todos";
import { toast } from "sonner";
import { todoCreateSchema } from "@/schemas/todo.schema";

type TodoForm = z.infer<typeof todoCreateSchema>;

export default function CreasteTodoModal() {
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoForm>({
    resolver: zodResolver(todoCreateSchema),
  });

  const onSubmit = async (data: TodoForm) => {
    console.log("Form Data:", data);
    if (!data?.priority) {
      toast.error("Priority required");
      return;
    }

    const formdata = new FormData();
    formdata.append("title", data?.title);
    formdata.append("description", data?.description);
    formdata.append("todo_date", data?.date);
    formdata.append("priority", data?.priority);
    try {
      const result = await createTodo(formdata);
      console.log({ result });

      if (result?.id) {
        toast.success("Todo created successfully");
        setOpenModal(false);
        reset();
      } else {
        throw new Error(result?.detail);
      }
    } catch (error: any) {
      toast.error(error?.message);
      console.log({ error });
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="bg-[#5272FF] cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
      >
        <FiPlus /> New Task
      </button>

      <div
        onClick={() => setOpenModal(false)}
        className={`fixed z-50 w-screen ${
          openModal ? "visible opacity-100" : "invisible opacity-0"
        } inset-0 grid place-items-center bg-black/20 backdrop-blur-xs duration-100 dark:bg-transparent`}
      >
        <div
          onClick={(e_) => e_.stopPropagation()}
          className={`absolute max-w-xl w-full rounded-lg bg-white p-6 drop-shadow-lg  ${
            openModal
              ? "opacity-100 duration-300"
              : "scale-110  opacity-0 duration-150"
          }`}
        >
          {/* Close Button */}
          <svg
            onClick={() => setOpenModal(false)}
            className="absolute right-3 top-3 w-6 cursor-pointer fill-zinc-600 dark:fill-white"
            viewBox="0 0 24 24"
          >
            <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"></path>
          </svg>

          <div className="flex justify-between items-center mb-6  pb-2">
            <h2
              id="modal-title"
              className="text-lg font-semibold border-b-2 border-blue-600 pb-1"
            >
              Add New Task
            </h2>
            <button
              onClick={() => setOpenModal(false)}
              className="text-sm font-semibold underline hover:text-blue-600"
              aria-label="Go back"
            >
              Go Back
            </button>
          </div>

          {/* ---------------- FORM ---------------- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-400"
                placeholder=""
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block font-medium mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                {...register("date")}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <p className="font-medium mb-2">Priority</p>

              <div className="flex gap-12 items-center">
                {/* Extreme */}
                <label className="flex items-center gap-1 cursor-pointer text-gray-700">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-600"></span>
                  Extreme
                  <input
                    type="radio"
                    value="extreme"
                    {...register("priority")}
                    className="ml-1 cursor-pointer"
                  />
                </label>

                {/* Moderate */}
                <label className="flex items-center gap-1 cursor-pointer text-gray-700">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  Moderate
                  <input
                    type="radio"
                    value="moderate"
                    {...register("priority")}
                    className="ml-1 cursor-pointer"
                  />
                </label>

                {/* Low */}
                <label className="flex items-center gap-1 cursor-pointer text-gray-700">
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                  Low
                  <input
                    type="radio"
                    value="low"
                    {...register("priority")}
                    className="ml-1 cursor-pointer"
                  />
                </label>
              </div>

              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-medium mb-1">
                Task Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={6}
                placeholder="Start writing here....."
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm resize-none placeholder-gray-400"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Done"}
              </button>
              <button
                type="button"
                onClick={() => {
                  // Here you could implement delete if needed, currently closes modal as example
                  setOpenModal(false);
                }}
                className="bg-red-600 p-2 cursor-pointer rounded text-white hover:bg-red-700"
                aria-label="Delete Task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
