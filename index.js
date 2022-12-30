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

  // console.log('%s : %d, result: %s', label, end - start, result.toString());
  return {
    label,
    result,
    time: end - start,
  }
}

function createCell(textContent) {
  const td = document.createElement('td');
  td.textContent = textContent;
  return td;
}

function createRow(result) {
  const tr = document.createElement('tr');
  const labelCell = createCell(result.label);
  tr.appendChild(labelCell);

  const resultCell  = createCell(result.result);
  tr.appendChild(resultCell);

  const timeCell  = createCell(result.time.toFixed(3));
  tr.appendChild(timeCell);

  return tr;
}

(async function main() {
  const cpp = await loadWasm('output/fibonacci.wasm');
  myMathModule['fibCpp'] = cpp.exports._Z3fibi;
  const assemblyScript = await loadWasm('output/fib-as.wasm');
  myMathModule['fibAs'] = assemblyScript.exports.fib;

  const n = 40;
  const tbody = document.getElementById('tbody');
  console.log('%ctrying via CPP WASM...','color: blue');
  const cppResult = measure('C++', () => myMathModule.fibCpp(n));
  const cppRow = createRow(cppResult);
  tbody.appendChild(cppRow);

  console.log('%ctrying via AS WASM...','color: blue');
  const asResult = measure('via AssemblyScript', () => myMathModule.fibAs(n));
  const asRow = createRow(asResult);
  tbody.appendChild(asRow);

  console.log('%ctrying via JS. This will take a bit of time...','color: blue');
  const jsResult = measure('via JavaScript', () => myMathModule.fibJs(n));
  const jsRow = createRow(jsResult);
  tbody.appendChild(jsRow);

  const rowData = [cppResult, asResult, jsResult];
  console.table(rowData);
})();
