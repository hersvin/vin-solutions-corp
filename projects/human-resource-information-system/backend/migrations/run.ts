import { createApp, getDataSource } from './runner.js';

/**
 * Applies all pending TypeORM migrations (files under src/migrations/).
 * Idempotent: safe to run repeatedly.
 */
async function run() {
  const module = await createApp();
  const ds = await getDataSource(module);
  try {
    await ds.runMigrations();
    console.log('Migrations applied');
  } finally {
    await module.close();
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
