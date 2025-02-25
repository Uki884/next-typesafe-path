import { generateTypes } from '../generator';

export const setup = async () => {
  await generateTypes({
    appDir: 'src/fixtures/app',
    pagesDir: '',
    config: {
      outDir: 'src/tests/.safe-routes',
      trailingSlash: false,
    }
  });
};
