import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

export async function transpile(inputFile, outputFile) {
  const CODE = await fs.readFile(inputFile, 'utf-8');
  const CODE_LOGGED = addLogging(CODE);
  await fs.writeFile(outputFile, CODE_LOGGED);
}

export function addLogging(code) {
  const ast = espree.parse(code, {ecmaVersion: 6});
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression') {
                addBeforeCode(node);
            }
        }
    });
    return escodegen.generate(ast);
}

function addBeforeCode(node) {
  var name = node.id ? node.id.name : '<anonymous function>';
  const params = node.params.map(id => `\${ ${id.name} }`);
  var beforeCode = "console.log('Entering " + name + `(${params})');`;
  var beforeNodes = espree.parse(beforeCode).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
