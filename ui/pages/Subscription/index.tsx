import { useSubmit } from "react-router";
import { Button } from "~/components/ui/Button";
import type { SubscriptionPageProps } from "~/routes/subscription";

export function SubscriptionPage({ loaderData, actionData }: SubscriptionPageProps) {
  const submit = useSubmit();

  const handleSubmit = () => {
    submit({}, { method: "post" });
  };

  return (
    <div className="justify-center items-center">
      <p>Subscriptiuon</p>
      <Button onClick={handleSubmit}>CLique aqui para ir pra home</Button>
      <span>dados from loader: {loaderData?.name}</span>
      {actionData && <p>Action executado!</p>}
    </div>
  );
}