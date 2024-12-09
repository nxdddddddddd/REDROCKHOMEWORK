// - lv2 : 自行实现一个浅拷贝
// 要求写下自己的思考和实现过程（想偷懒写注释也可

//**笔记part
//浅拷贝创建一个新的对象，但只有顶层属性被复制，新对象与源对象共享内部嵌套对象的引用，即指向同一片内存空间
//因此，对副本的顶层属性的重新赋值不会影响源对象，而对副本的嵌套对象属性的重新赋值会影响到源对象

// 在 JavaScript 中，所有标准内置对象复制操作
// （展开语法、Array.prototype.concat()、Array.prototype.slice()、Array.from() 和 Object.assign()）
// 都创建浅拷贝，而不是深拷贝。

function shallowCopy(obj) {
  //创建空对象（副本对象预备役）用于接收对象属性
  const copy = {};

  //遍历源对象并创建副本
  for (let key in obj) {
    copy[key] = obj[key];
  }
  return copy;
}

// 测试用例
const original = {
  a: 1,
  b: {
    c: 2
  }
};

const copy = shallowCopy(original);

console.log(copy);

