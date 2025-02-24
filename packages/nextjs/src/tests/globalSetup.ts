import { generateTypes } from '../generator';

export const setup = async () => {
  await generateTypes({
    appDir: 'src/fixtures/app',
    pagesDir: '',
    outDir: 'src/tests/.safe-routes'
  });
};
