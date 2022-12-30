# assumes AssemblyScript installed globally via
# $ yarn add global assembly-script
yarn asc ./fibonacci.ts --baseDir $(pwd) -o ./output/test.wasm -t ./output/test.wat