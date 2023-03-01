import { transpile } from "../src/logging-espree.js";
import assert from 'assert';
import * as fs from "fs/promises";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
import Tst from './test-description.mjs';

const Test = Tst.map(t => ({
  input: __dirname + '/data/' + t.input,
  output: __dirname + '/data/' + t.output,
  correctLogged: __dirname + '/data/' + t.correctLogged,
  correctOut: __dirname + '/data/' + t.correctOut,
})
)

function removeSpaces(s) {
  return s.replace(/\s/g, '');
}

for (let i = 0; i < Test.length; i++) {
  it (`Test ${Test[i].input}`, async () => {
    await transpile(Test[i].input, Test[i].output);
    const CODE_EXPECTED = await fs.readFile(Test[i].correctLogged, 'utf-8');
    const CODE = await fs.readFile(Test[i].output, 'utf-8');
    const CODE_CLEAR = removeSpaces(CODE);
    assert.equal(CODE_CLEAR, removeSpaces(CODE_EXPECTED));
    await fs.unlink(Test[i].output);

    const correctOut = await fs.readFile(Test[i].correctOut, 'utf-8')
    let oldLog = console.log; // mocking console.log
    let result = "";
    console.log = function (...s) { result += s.join('') }
    eval(CODE);
    assert.equal(removeSpaces(result), removeSpaces(correctOut))
    console.log = oldLog;
  });
}


