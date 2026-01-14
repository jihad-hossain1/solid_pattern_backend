import { serve } from "@hono/node-server";
import app from "./app";

const port = Number(process.env.PORT) || 7010;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
