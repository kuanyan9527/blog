## 引言
最近在学习的过程中发现越来越多的地方使用到`this`,在此之前我对this的指向知之甚少，由此决定深究一一番，做下记录以备今后复习之用，文章内所有代码执行结果只针对浏览器环境。
> this在做代词时翻译成中文的意思是：`(指较近的人或事物)这，这个;(指已提到过的人或事物)这;`记住这个对于理解this有帮助。  

## 心得
- 一般情况下this的指向只有在调用时才能确定，箭头函数是个例外在定义是就已经确定；
- 函数中的this指向的是函数的最终调用者（可以结合this的中文翻译理解）；
- 函数一定是某个对象调用了才会执行，也就是说this指向的一定是一个对象Object；

## 案例引入
看完几篇大佬们讲解this指向的博客，都用到了一个经典的案例，我也班门弄斧一番，掏出这个案例琢磨一二。
```javascript
var a = 5
var obj = {
  a : 10,
  foo: function(){
    console.log(this.a)
  }
}

var bar = obj.foo
obj.foo() // 10
bar() // 5

```
**案例分析**
- 案例中`obj.foo()`这一行的输出结果理解起来还是非常容易的，函数的调用者是`obj`，所以函数中的this指向的是obj这个对象，很容易想到输出的是obj中的a值；
- `bar()`这一行的输出结果就很容让人头脑犯晕，在定义`bar`是时候明明用的是`obj.foo`为什么输出结果不是obj中的a，其实`var bar = obj.foo`这一行只是个烟幕弹，把代码改成下面这个样子就比较容易理解；

```javascript
//这一步就类似上一段代码中的var bar=obj.foo
var bar = function(){
    console.log(this.a)
}

```

- 在定义bar的时候并没有执行`obj.foo`，只是将foo这个函数体赋值給了变量bar，像上面代码这个样子（这样说比较好理解，实际赋值的是foo函数对象的地址值），这个时候执行bar调用者是`window`，跟obj一点关系都没有，所以输出的是window中的a值；

**案例小结**
通过上面这个简单的案例（看着简单，内含量很大），不难发现函数中this指向的是函数的调用者，关键点就是确定函数是谁调用的，那么就涉及到函数的四种绑定方式。

## 函数绑定
函数绑定的实质就是函数调用，说成函数绑定显得高大上，函数绑定有四种方式分别是：默认绑定、隐式绑定、现实绑定、new绑定，下面是我对这四种绑定的理解。

### 默认绑定
顾名思义默认绑定就是javaScript内部默认的函数调用者（这句话等于没说），**发生在函数调用时没有任何修饰情况下**，不多说先来段案例代码

```javascript
var name = 'Tom'
function foo(){
  console.log('foo---'+this.name);  
}

setTimeout(function(){
  var name = 'Jerry'
  console.log('定时器---'+this.name)//定时器---Tom
  foo()//foo---Tom
},1000)
    
foo()//foo--tom

```
**案例分析**
- 案例中最先输出的是全局下调用的`foo`，非常好理解它的调用者是`window`，所以输出的是window中的name值；
- 接下来输出的是定时器中的`console.log('定时器---'+this.name)`这行代码的结果，为什么`this.name`输出的不是`Jerry`，答案是javaScript中默认定时器中回调函数的this是window；
- 可以这样理解：定时器就是一个函数，它接收两个参数，在定时器中写函数只是一个传参的过程，中间没有涉及到任何改变this指向的操作（开头提到过this指向的一定是一个对象Object），将写在定时器中的函数提取出来会更容易理解，像是下面这样；

```javascript
var name = 'Tom'
function time(){
  var name = 'Jerry'
  console.log('定时器---'+this.name)//定时器---Tom
}
    
setTimeout(time,1000)

```

- 最后输出的是定时器中调用的foo,写这一行的目的是加强对**默认绑定发生在函数调用时没有任何修饰的情况下**这句话的理解。

### 隐式绑定
隐式绑定可以理解成书写代码过程中发生了函数绑定但还不自知（特别像我这个小白），还是通过案例代码理解

```javascript
var name = 'Tom'
var obj = {
  name: 'Jerry',
  f1: function () {
    console.log('f1---' + this.name);
  },
  child: {
    name: 'Speike',//Speike是只狗
    f2: function () {
      console.log('f2---' + this.name);
    },
  }
}

obj.f1()//f1---Jerry
obj.child.f2()//f2---Speike

```

**案例分析**
- 像案例中这种通过对象调用函数的方式就是隐式绑定，函数中的this指向函数最后的调用者，还记的this的中文翻译吗?`(指较近的人或事物)这`,在这里函数的最后调用者就是调用函数时离函数名最近的那个对象；
- 豁然开朗`obj.f1()`的调用者就是`obj`，`obj.child.f2()`调用者就是`obj.child`,分析到这里输出结果就很好理解了。

### 显示绑定
显示绑定就是代码中明确的指出了函数的调用对象，通过三个方法实现分别是`call()`、`apply()`、`bind()`

#### call()和apply()
- call()和apply()这两个方法使用起来几乎一样，它们都会会在使用时立即执行函数，区别在于这两个方法的传参方式不一样；
- call()方法接收多个参数，第一个参数是this指向的对象，后续参数是函数中需要用到的所有参数；
- apply()方法只接受两个参数，第一个参数是this指向对象，第二个参数是函数中需要用到的所有参数组成的**数组**。

```javascript
var name = 'Tom'
  var obj = {
    name: 'Jerry',
    f1: function (a,b) {
      console.log(a+b+'f1---' + this.name);
    },
    child: {
      name: 'Speike',//Speike是只狗
      f2: function (a,b) {
        console.log(a+b+'f2---' + this.name);
      },
    }
  }

obj.child.f2('1','2')//12f2---Speike
obj.child.f2.call(obj,'1','2')//12f2---jerry
obj.child.f2.apply(obj,['1','2'])//12f2---Jerry

```

#### bind()
`bind()`与`call()`和`apply()`比较，区别在于bind()在使用时不会立即执行函数，bind只是修改函数和的this指向；
```javascript
var name = 'Tom'
  var obj = {
    name: 'Jerry',
    f1: function (a,b) {
      console.log(a+b+'f1---' + this.name);
    },
    child: {
      name: 'Speike',//Speike是只狗
      f2: function (a,b) {
        console.log(a+b+'f2---' + this.name);
      },
    }
  }

var bar = obj.child.f2.bind(obj,'1','2')//使用一个变量去接收返回的结果
bar()//12f2---Jerry

```

### new绑定
`new`是在通过构造函数创建实例对象时使用，此时this指向的是新建的实例对象，还是来一个案例吧比较简洁明了；
 
```javascript
function Cat(name, age) {
  this.name = name
  this.age = age
  this.showInfo = function () {
    console.log(this.name + '---' + this.age)
  }
}

var c1 = new Cat('Tom', 5)
c1.showInfo()//Tom---5

```
- 要理解new绑定，需要知道new创建实例对象时做了些什么
  1. 创建一个空对象obj
  2. 将空对象的隐式原型属性`__proto__`指向构造函数的显示原型`prototype`
  3. 将this的指向obj
  4. 返回得到的实例对象

**手写函数实现new的功能**

```javascript
function myNew(p,n,a) {
  //创建一个空对象
  var obj = {}
  var Construct = Array.prototype.shift.call(arguments)
  //var Construct=[].shift.call(arguments)
  //上面两段代码效果是等效的，都是为了得到Cat这个构造函数，这一步是难点
  //这里arguments的细节不是很明白，需要去弄明白
  obj.__proto__ = Construct.prototype

  Construct.apply(obj,arguments)//更改this的指向
  return obj//返回得到的新对象
}

function Cat(name, age) {
  this.name = name
  this.age = age
  this.showInfo = function () {
    console.log(this.name + '---' + this.age)
  }
}

var c1 = myNew(Cat,'Tom',20)
console.log(c1)//Cat {name: "Tom", age: 20, showInfo: ƒ}得到了与new一样的效果

```

**案例小结**
经过手写函数实现new的功能，就能够理解new绑定this指向的是新建的实例对象，在这个过程中发现对于`arguments`理解不透彻，留着下次总结。

### 函数绑定的优先级
经过上面这一番折腾，可算是把函数绑定这件是说清楚了，还有非常重要一点上面这四种函数绑定方式存在优先级：**new绑定>显示绑定>隐式绑定>默认绑定**

## 箭头函数
箭头函数是ES6中新增的一种定义函数的方式，对于箭头函数中的this指向记住以下几个要点：
- 箭头函数中没有自己的this，箭头函数中的this是的定义函数时上一层函数中的this；
- 箭头函数中的this在书写代码时就已经确定，这有别于之前提到的函数中的this是在调用时确定的；
- 箭头函数中的没有call()、apply()、bind()这三个方法，当然也就不能更改箭头函数中this的指向；
- 箭头函数中没有构造函数，不能使用new绑定。

```javascript
var name = 'Tom'
var obj = {
    name: 'Jerry'
}

; (function () {
  setTimeout(() => {
    console.log(this.name);
  }, 1000)
}).call(obj)//Jerry
//使用call方法改变了上一层函数中this的指向

```




