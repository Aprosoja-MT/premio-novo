import { SubscriptionPage } from "@/pages/Subscription";
import { redirect } from "react-router";
import type { Route } from "./+types/subscription";

export type SubscriptionPageProps = Pick<Route.ComponentProps, "loaderData" | "actionData">;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Subscription" },
    { name: "description", content: "Welcome to Subscription!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  return { name: "teste" };
}

export async function action({ request }: Route.ActionArgs) {
  return redirect("/");
}

export default function Subscription({ loaderData, actionData }: Route.ComponentProps) {
  return <SubscriptionPage loaderData={loaderData} actionData={actionData} />;
}
