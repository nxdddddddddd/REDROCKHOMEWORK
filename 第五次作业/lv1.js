// 编写一个函数 factorial(n) 计算 n!

//1、循环实现
function factorial1(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

//2、递归实现
function factorial2(n) {
  if (n === 1) {
    return 1;
  } else {
    return n * factorial2(n - 1);
  }
}

const userInput = prompt('Enter something:');
const n = parseInt(userInput, 10);
console.log(factorial1(n));
console.log(factorial2(n));