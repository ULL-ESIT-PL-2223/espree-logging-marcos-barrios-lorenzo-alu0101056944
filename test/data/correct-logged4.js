
const a = 3;

function spreadFunction(something, other, another) {
  console.log(`Entering spreadFunction(${ something }, ${ other }, ${ another }) at line 4`);
  let amount = 0;
  for (let i = 0; i < arguments.length; i++) {
    amount++;
  }
  return amount;
}
spreadFunction(2, 'xyzz', true);