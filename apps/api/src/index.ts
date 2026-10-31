import process from "node:process"

import { serve } from "@hono/node-server"

import { app } from "./app.ts"
import { parseEnv } from "./lib/env.ts"

serve({ fetch: app.fetch, port: parseEnv(process.env).PORT })
