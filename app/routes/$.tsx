import type { Route } from "./+types/$";

export async function loader({ request }: Route.LoaderArgs) {
  // Ignora requisições do Chrome DevTools
  const url = new URL(request.url);
  if (url.pathname.startsWith("/.well-known/")) {
    return new Response(null, { status: 404 });
  }
  throw new Response(null, { status: 404 });
}

export default function CatchAll() {
  return null;
}
