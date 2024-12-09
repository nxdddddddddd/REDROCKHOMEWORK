// ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）
// lv0(必做) : 通过解构赋值的方式获取对象中所有属性 
const obj = {
  a: '1',
  b: 2,
  c: {
    d: '4',
    e: 5
  },
  f: [6, 7, 8]
};

//解构赋值
const { a, b, c, f } = obj;
console.log(a, b, c); // 1 2 {d: "4", e: 5}
console.log(f); // [6, 7, 8]
