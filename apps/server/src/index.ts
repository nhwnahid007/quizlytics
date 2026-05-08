import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

app.listen(env.PORT, (error?: Error) => {
  if (error) {
    logger.error({ err: error }, "server failed to start");
    throw error;
  }

  logger.info({ port: env.PORT }, "server listening");
});
