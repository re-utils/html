import type { TSConfig, Transpiler } from 'bun';
import { relative } from 'path/posix';

const categories: Record<string, Record<string, any>> = {};

const transpileFile = async (srcDir: string, name: string, target: string, transpiler: Transpiler): Promise<void> => {
  const category = target.substring(0, target.lastIndexOf('.'));
  const input = `${srcDir}/${name}/${target}`;
  const output = `${srcDir}/${name}/dist/${category}.js`;

  console.time(`Transpile file "${input}" to "${output}"`);
  await Bun.write(output, await transpiler.transform(await Bun.file(input).arrayBuffer()));
  console.timeEnd(`Transpile file "${input}" to "${output}"`);

  // Load into categories
  (categories[category] ??= {})[name] ??= (await import(output) as { default: any }).default;
};

const transpileDir = async (srcDir: string, name: string): Promise<void> => {
  console.time(`Transpile directory "${srcDir}/${name}"`);

  const tsconfig = (
    await import(`${srcDir}/${name}/tsconfig.json`) as { default: TSConfig }
  ).default;

  const transpiler = new Bun.Transpiler({
    loader: 'tsx',
    autoImportJSX: true,
    tsconfig,
    minifyWhitespace: true
  });

  // Transpile files concurrently
  const tasks: Promise<void>[] = [];
  for await (const file of new Bun.Glob('*.{jsx,ts,tsx}').scan(`${srcDir}/${name}`)) tasks.push(transpileFile(srcDir, name, file, transpiler));
  await Promise.all(tasks);

  console.timeEnd(`Transpile directory "${srcDir}/${name}"`);
};

export const transpileSources = async (root: string): Promise<void> => {
  console.time(`Transpile source directory "${root}/src"`);

  // Transpile dirs concurrently
  const tasks: Promise<void>[] = [];
  for await (const path of new Bun.Glob('*').scan({
    cwd: `${root}/src`,
    onlyFiles: false
  })) tasks.push(transpileDir(`${root}/src/`, path));
  await Promise.all(tasks);

  console.timeEnd(`Transpile source directory "${root}/src"`);
};

await transpileSources(`.${relative(process.cwd(), import.meta.dir)}`);
