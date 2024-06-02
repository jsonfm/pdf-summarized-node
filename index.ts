import "reflect-metadata";
import { logger } from "@/logs";
import { AppDataSource } from "@/database";
import { app } from "@/app";
import { Config } from "@/config";

//
AppDataSource.initialize()
  .then(() => {
    app.listen(Config.PORT, () => {
      logger.info(`🔥 Server is listening on port ${Config.PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error);
  });
