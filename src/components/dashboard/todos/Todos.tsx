// "use client";

// import CreasteTodoModal from "@/components/modal/CreateTodoModal";
// import DeleteTodoModal from "@/components/modal/DeleteTodoModal";
// import UpdateTodoModal from "@/components/modal/UpdateTodoModal";
// import { deleteTodo } from "@/services/todos";
// import { ITodo } from "@/types/todo.type";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter } from "react-icons/fi";
// import { toast } from "sonner";
// import FilterDropdown from "./FilterDropdown";
// import TodoCard from "./TodoCard";

// export default function Todos({ todos }: { todos: ITodo[] }) {
//   const [search, setSearch] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const handleSearch = (e: any) => {
//     e.preventDefault();
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("search", String(search.trim()));
//     router.push(`?${params.toString()}`);
//   };

//   console.log({ search });
//   return (
//     <div className="">
//       <div className="flex justify-between items-center  ">
//         {/* Title */}
//         <h1 className="text-4xl text-[#0D224A] font-semibold mb-6">Todos</h1>
//         <CreasteTodoModal />
//       </div>

//       {/* Search + Sort + New Task */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-6">
//         {/* Search */}
// <form
//   onSubmit={handleSearch}
//   className="flex items-center w-full flex-1 bg-white shadow-sm   rounded-md"
// >
//   <input
//     type="text"
//     onChange={(e) => setSearch(e.target.value)}
//     placeholder="Search your task here..."
//     className="w-full px-3  focus:outline-none"
//   />
//   <button
//     type="submit"
//     className="bg-[#5272FF] cursor-pointer w-10 rounded flex justify-center py-3"
//   >
//     <FiSearch className="text-white" />
//   </button>
// </form>

//         {/* Sort + New Task */}
//         <div className="flex items-center gap-4">
//           <FilterDropdown />

//           {/* New Task */}
//         </div>
//       </div>

//       {/* Your Tasks */}
//       <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {todos?.map((task) => (
//           <TodoCard task={task} />
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import CreasteTodoModal from "@/components/modal/CreateTodoModal";
import FilterDropdown from "./FilterDropdown";
import TodoCard from "./TodoCard";
import { ITodo } from "@/types/todo.type";

export default function Todos({ todos }: { todos: ITodo[] }) {
  console.log({ todos });
  // Local state for sorting
  const [localTodos, setLocalTodos] = useState<ITodo[]>(todos);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  // Sensors for dnd-kit
  const sensors = useSensors(useSensor(PointerSensor));

  // Called when drag ends
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = localTodos.findIndex(
      (t) => String(t.id) === String(active.id)
    );
    const newIndex = localTodos.findIndex(
      (t) => String(t.id) === String(over.id)
    );

    console.log({ oldIndex, newIndex, active });

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return;
    }

    const newOrder = arrayMove(localTodos, oldIndex, newIndex);

    // Reassign positions
    const reordered = newOrder.map((todo, idx) => ({
      ...todo,
      position: idx + 1,
    }));

    setLocalTodos(reordered);

    // Send to backend to persist
    const formdata = new FormData();
    formdata.append("position", String(newIndex + 1));
    const res = await updateTodo(active.id as number, formdata);
    console.log({ res });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", String(search.trim()));
    router.push(`?${params.toString()}`);
    router.refresh();
  };

  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  return (
    <div className="drag-overlay-fix">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl text-[#0D224A] font-semibold mb-6">Todos</h1>
        <CreasteTodoModal />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full flex-1 bg-white shadow-sm   rounded-md"
        >
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your task here..."
            className="w-full px-3  focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#5272FF] cursor-pointer w-10 rounded flex justify-center py-3"
          >
            <FiSearch className="text-white" />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <FilterDropdown />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localTodos.map((t) => String(t.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {localTodos.map((task) => (
              <SortableTodoItem key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

import { FiGrid, FiSearch } from "react-icons/fi";
import { updateTodo } from "@/services/todos";

export function SortableTodoItem({ task }: any) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="
          absolute 
          top-6 right-5
          p-1
          rounded
          bg-gray-100
          hover:bg-gray-300
          cursor-grab
          active:cursor-grabbing
          shadow
        "
      >
        <FiGrid size={18} className="text-gray-600 " />
      </div>

      <TodoCard task={task} />
    </div>
  );
}
