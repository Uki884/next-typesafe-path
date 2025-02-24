import { generateTypes } from '../generator';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  await generateTypes({
    appDir: 'src/fixtures/app',
    pagesDir: '',
    outDir: 'src/tests/.safe-routes'
  });
});