### 原型、原型链的学习总结
####  一、 写在前面
学习JavaScript有一段时间了，从基础开始，第一次写学习总结，一定坚持写完，相信自己能够将关于原型、原型链的学习总结写好。
####  二、原型、原型链的概念
* 原型：原型分为显示原型属性和隐式原型属性
① 显示原型属性(prototype)： 函数定义时自动添加的空Object对象，通过prototype可以向原型中添加方法；
②隐式原型属性（__ proto __ ）：实例对象创建时自动添加，值为构造函数的prototype值，ES6之前通过__ proto __只能查看原型中的方法。
* 原型、原型链的作用：
①同一个构造函数创建的实例对象共享方法；
②原型链是js实现继承的主要方法。
```javascript
function Person(name){	//创建Person构造函数
                this.name=name;
            }
            Person.prototype.sayName=function(){
                console.log(this.name);
            };
            var p=new Person("Tom");//创建Person的实例对象
            //实例对象的隐式原型属性等于构造函数的显示原型属性
            console.log(Person.prototype===p.__proto__);    //true       

```
* 原型链：构造函数 → prototype属性 → 原型对象 ← __ proto __ 属性 ← 实例对象形成一个原型链 ，通过构造函数中的prototype属性向原型中添加方法，通过实例中的 __ proto __ 属性查看原型中的方法。
#### 三、用案例理解原型、原型链
* 案例一
```javascript
function Person(name,age){//创建Person构造函数，并添加name和age两个属性
                this.name=name;
                this.age=age;
            }
            Person.prototype.sayName=function(){//通过prototype向Person的原型中添加sayName方法
                console.log(this.name);
            };
            Person.prototype.sayAge=function(){//通过prototype向Person的原型中添加sayAge方法
                console.log(this.age);
            };
            var p=new Person("Tom",20);//创建Person的实例对象
            var p0=new Person("Jone",18);
            p.sayName();//通过实例对象p分别调用sayName和sayAge方法
            p.sayAge();
            p0.sayName();
            p0.sayAge();
```
画图分析代码
 ![案例一](https://img-blog.csdnimg.cn/2020012916423224.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQwNzU1Mzgx,size_16,color_FFFFFF,t_70)
①2、4号箭头表示创建构造函数，并通过prototype向构造函数的原型中添加sayName、sayAge方法；
②1、3号箭头和5、6号箭头分别表示通过构造函数Person创建的实例对象p和p0，p和p0的__ proto __ 属性默认指向构造函数Person的原型对象，此时p和p0共享sayName方法和sayAge方法；
③由上述**实例对象的隐式原型值等于构造函数的显示原型值**

* 案例二
```javascript
 function Person(name){
                this.name=name;
            };
            var p1=new Person("Tom");
            Person.prototype={//修改Person原型的指向
                sayName:function(){
                    console.log(this.name);
                }
            };
            var p2=new Person("Jone");
            p2.sayName();//Jone
            p1.sayName();//Uncaught TypeError: p1.sayName is not a function
```
画图分析代码
![案例二](https://img-blog.csdnimg.cn/2020013015033945.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQwNzU1Mzgx,size_16,color_FFFFFF,t_70)①3、4号箭头表示创建Person构造函数，Person的原型指向一个空的Object对象；
②1、2号箭头表示通过Person创建一个实例对象p1，p1的__ proto __指向构造函数的原型对象；
③6号箭头表示修改了Person原型的指向切断了与原对象的引用关系（擦除4号箭头），并在新的对象中添加了sayName方法；
④5、7号箭头表示通过Person创建一个实例对象p2，p2的 __ proto __ 指向含有sayName方法的原型；
⑤代码11行通过p2访问sayName方法是可以执行的，代码12 行通过p1访问sayName方法是会报错的。
⑥由上述尽管我们可以通过prototype修改原型的指向，**尽量避免这样做，可能会产生错误。**

* 案例三
```javascript

function Father(name,age){//创建Father函数，添加name、age属性
                this.name=name;
                this.age=age;
            }
            Father.prototype.sayHello=function(){//向Father函数的原型中添加sayHello方法
                console.log("Hello");
            };
            function Son(name,age){//创建Son函数
                Father.call(this,name,age);//利用call方法做假继承
            }
            Son.prototype=new Father();//将Son的prototype值设为Father对象的一个实例，实现继承
            Son.prototype.constructor=Son;//修正Son的构造函数指向Son
            var s=new Son("Tom",20);//创建Son的实例对象
            s.sayHello();//Hello   实例s可以调用sayHello方法，说明Son继承了Father中的属性
            console.log(s);
```
①这是利用原型实现对象继承的案例；
②代码第10行利用call方法在Son的作用域内执行Father中的代码，这里是一个假继承，同时简化了代码；
③代码第12行将Father的一个实例对象赋值给Son的原型，这一步真正的实现了对象的继承；
④代码第13行修正了Son构造函数的constructor的指向为Son；
⑤代码第15行通过实例s调用sayHello方法正常执行，验证了继承关系的存在。

* 案例四
先上图祭祖
![原型链](https://img-blog.csdnimg.cn/20200130194526157.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQwNzU1Mzgx,size_16,color_FFFFFF,t_70)
```javascript
function Foo(){}
            var f1=new Foo();
            var o1=new Object();
            console.log(f1.__proto__===Foo.prototype);//true
            console.log(Foo.prototype.__proto__===Object.prototype);//true
            console.log(Foo.__proto__==Function.prototype);//true
            console.log(Object.__proto__===Function.prototype);//true
            console.log(Function.__proto__===Function.prototype);//true
            console.log(Function.prototype.__proto__===Object.prototype);//true
            console.log(o1.__proto__===Object.prototype);//true
            console.log(Object.prototype.__proto__===null);//true
            console.log(Function.__proto__===Function.prototype);//true
```
①代码第8行Function. __ proto __ =Function.prototype，由此可知Function是构造函数也是实例；
②代码第11行Object.prototype.__ proto __=null，由此可知Object显示原型的隐式原型为空；
③**牢记这张祭祖的图**。

#### 四、总结
①原型让同一个构造函数创建的实例共享方法；
②通过构造函数中prototype属性向原型中添加方法；
③通过实例的 __ proto __ 属性查看原型中的方法； 
④实例对象的隐式原型值等于构造函数的显示原型值；
⑤尽量避免修改prototype属性的指向，这样可能会产生错误；
⑥原型是实现对象继承的主要方法，详看案例三，特别注意需要修正被继承对象的constructor的指向；
⑦Function既是构造函数，也是实例。

