import { createApp, getDataSource } from './runner.js';

/**
 * Recreates the schema from the current entity definitions.
 * WARNING: runs `synchronize(true)` which may drop and recreate
 * columns. Only use for local dev, never in shared or prod.
 */
async function init() {
  const module = await createApp();
  const ds = await getDataSource(module);
  try {
    await ds.synchronize(true);
    console.log('Schema recreated from entities');
  } finally {
    await module.close();
  }
}

init()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
