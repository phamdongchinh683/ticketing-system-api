import { defineConfig } from "kysely-ctl";
import path from "path";

import { db as kysely } from "./src/datasource/db";

export default defineConfig({
  destroyOnExit: true,
  kysely,
  migrations: {
    allowUnorderedMigrations: true,
    migrationFolder: path.join(process.cwd(), "src/datasource/migrations"),
  },
});
