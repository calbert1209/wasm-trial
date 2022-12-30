const h1 = document.createElement('h1');
h1.textContent = "hello from JS!";
document.body.appendChild(h1);

async function loadWasm(filename) {
  const response = await fetch(filename);
  const arrayBuffer = await response.arrayBuffer();
  const module = await WebAssembly.compile(arrayBuffer);
  return new WebAssembly.Instance(module);
}

function fibJs(n) {
  if (n <= 1) return n;

  return fibJs(n - 1) + fibJs(n - 2);
}
const myMathModule = {
  fibJs,
};

function measure(label, cb) {
  const start = performance.now();

  const result = cb();

  const end = performance.now();

  console.log('%s : %d, result: %s', label, end - start, result.toString());
}

(async function main() {
  const instance = await loadWasm('fibonacci.wasm');
  myMathModule['fibCpp'] = instance.exports._Z3fibi;

  console.log('%ctrying via WASM...','color: blue');
  measure('via WASM', () => myMathModule.fibCpp(40));
  console.log('%ctrying via JS. This will take a bit of time...','color: blue');
  measure('via JS', () => myMathModule.fibJs(40));
  // measure('via JS', () => console.log('fib via js'));
  // measure('via WASM', () => console.log('fib via wasm'));
  
})();
