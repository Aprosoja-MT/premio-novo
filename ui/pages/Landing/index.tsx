import { useSubmit } from "react-router";
import { Button } from "~/components/ui/Button";
import type { LandingProps } from "~/routes/home";

export function Landing({loaderData}: LandingProps) {
  const submit = useSubmit();

  const handleSubmit = () => {
    submit({}, { method: 'POST' })
  }

  return (
    <div className="justify-center items-center">
      <p>home</p>
      <Button onClick={handleSubmit}>CLique aqui para ir pro subscription</Button>
    </div>
  )
}