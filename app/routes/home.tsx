import { redirect } from "react-router";
import { Landing } from "ui/pages/Landing";
import type { Route } from "./+types/home";

export type LandingProps = Pick<Route.ComponentProps, "loaderData" | "actionData">;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({}: Route.ActionArgs) {
  return redirect('/subscription')
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Landing loaderData={loaderData} />;
}
