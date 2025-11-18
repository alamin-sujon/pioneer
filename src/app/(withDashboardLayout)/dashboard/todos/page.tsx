import Todos from "@/components/dashboard/todos/Todos";
import { getAllTodos } from "@/services/todos";
import { Suspense } from "react";

export default async function TodoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const query = await searchParams;
  const search = query?.search || "";
  console.log({ search });
  const data = await getAllTodos(search);
  const todos = data?.results;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Todos todos={todos} />
      </div>
    </Suspense>
  );
}

// import Todos from "@/components/dashboard/todos/Todos";
// import { getAllTodos } from "@/services/todos";
// import { Suspense } from "react";

// export default async function TodoPage({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string };
// }) {
//   const search = searchParams?.search || "";

//   const data = await getAllTodos(search);
//   const todos = data?.results;

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <div>
//         <Todos todos={todos} />
//       </div>
//     </Suspense>
//   );
// }
