import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <p>This is the home page.</p>
    </div>
  );
}
