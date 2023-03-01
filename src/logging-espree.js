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
  const ast = espree.parse(code, {ecmaVersion: 6, loc: true});
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression' ||
                node.type === 'ArrowFunctionExpression') {
                addBeforeCode(node);
            }
        }
    });
    return escodegen.generate(ast);
}

function addBeforeCode(node) {
  var name = node.id ? node.id.name : '<anonymous function>';
  const params = node.params.map(id => `\${ ${id.name} }`);
  var beforeCode = "console.log(`Entering " + name + `(${params})` +
      ` at line ${node.loc.start.line}\`);`;
  var beforeNodes = espree.parse(beforeCode, {ecmaVersion: 6, loc: true}).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
