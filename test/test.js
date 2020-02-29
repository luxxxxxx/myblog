let Animal1 = function (name) {
    this.name = name;
    this.sleep = function () {
        console.log( `${this.name} is sleeping`);
    }    
}

let caty = function () {
        this.species = 'cat'
    }
  
    caty.prototype = new Animal1();



let cat1 = new caty ('kitty');
cat.sleep();




var A = function () {}


A.prototype.n = 1;
var b = new A();

A.prototype = {
    n: 2,
    m: 3
}

var c = new A();

console.log(b.n, b.m, c.n, c.m)


let reg = /^[A-Za-z]\w{4,19}$/



console.log(+true);

console.log(!"xxxx")



//  deep clone 
let  obj1 = {
    a : 1,
    b : {
        a : 2,
        b : {
            a : 3,
            b : null
        }
    },
    c : {
        a : 'c',
        b : [1,2,
            [1,2,3],
            {
                a : undefined,
                b : NaN,
                c : function () {
                    console.log('fuck')
                }
            }
        ]
    }
}



function deepClone (obj) {
    let objStorage = Array.isArray(obj) ? [] : {};
    let number = 0;
    for ( let key in obj ) {
        console.log(number)
        number ++
        if (obj[key] && typeof (obj[key]) != 'object') {
            objStorage[key] = obj[key];
        } else {
            console.log(typeof (obj[key]))
            objStorage[key] = deepClone(obj[key])
        }
    }

    return objStorage;
}



let arr = [1,50,29,80,78,20,213,4,45,642,6865,543,234,1323,556,754,435,131,1];


let quicksort = (arr) => {
    let sort = (arr,left = 0, right = arr.length - 1) => {
        if (left >= right) {
            return
        }
        let i = left,
            j = right,
            val = arr[j];
        
        while ( i == j ) {
            return 
        } 
        
        while (i < j && arr[i] < val) {
            i ++;
        }
        
        a[j] = a[i];
        
        while ( j > i && arr[j] > val) {
            j ++;
        }

        a[i] = a[j];
        a [j] = val;
        
        sort (arr , left , j - 1);
        sort (arr , j + 1, right);
    }
}



let str =  'axxxxxaxxaxxaxaxaxaxxxxxax',
    sub = 'ax';

        let position = 0;
        let num = 0;
        while (str.indexOf(sub, position) != -1 && position <= str.length) {
            position = str.indexOf(sub);
            num ++
        }
        console.log(num);
        

    
    


        

//  数组去重 


let arr = [1,2,2,3,3,4,5,7,6,435,123,1,3,2,1,0,3];


// o(n2)  

        function x (arr) {
            for (let i = 0; i < arr.length ; i ++) {
                let temp = arr[i];
                for (let j = arr.length - 1; j > i ; j --) {
                    if (arr[j] == temp ) {
                        arr.splice (j,1)
                    }
                }
            }
            return arr;
        }



        function x1 (arr) {
            let y = [];
            for (let i = 0; i < arr.length; i ++) {
                let val = arr[i];
                console.log(val)
                if (y[val]) {
                    arr.splice (i,1);
                    i --;
                } else {
                    y[val] = true;
                }
            }

            return arr;
        }



        // bubbleSort
        function bubbleSort (arr) {
            let len = arr.length;
            for (let i = 0 ; i < len ; i ++) {
                let max = arr[i];
                for (let j = 0 ; j < len - i ; j ++) {
                    if (arr [j] > arr [j + 1]) {
                        swap (arr,j, j + 1);
                    }
                }

            }
            return arr;
        }

        
        function swap (arr, i , j) {
            temp = arr [j];
            arr [j] = arr[i];
            arr [i] = temp;
        }





        // 



        function f () {
            
        }

        var parent = Object.getPrototypeOf(f);
        f.name



        var a = {} ;
        b = Object.prototype;
        [a.prototype === b , Object.getPrototypeOf (a)  === b]



        function foo () { }
            var oldName = foo.name;
            foo.name = 'bar';
            [oldName,foo.name]



        [,,,].join('','')




        var a = [1,2,3],
            b = [1,2,3],
            c = [1,2,4]
            a == b
            a === b
            a > c
            a < c



            var a = 111111111111111110000,
                b = 1111;
                a + b



                for (var i = 0; i < 2; i++) {
                    setTimeout( function () {
                        
                      
                        console.log(i++)
                    }, 1000);
                }

                

                var  reg = /^sjm/

                var text = 's121323jsam'

                (function (params) {
                    var x = y = 1;
                })()


                console.log(y);
                console.log(x)


                2 == [[[2]]]


                let arr = [1,2,3,2,5,4,6,7,8,1];
                
const quickSort = (array) => {
    const sort = (arr, left = 0, right = arr.length - 1) => {
        if (left >= right) {//如果左边的索引大于等于右边的索引说明整理完毕
            return
        }
        let i = left
        let j = right
        const baseVal = arr[j] // 取无序数组最后一个数为基准值
        while (i < j) {//把所有比基准值小的数放在左边大的数放在右边
            while (i < j && arr[i] <= baseVal) { //找到一个比基准值大的数交换
                i++
            }
            arr[j] = arr[i] // 将较大的值放在右边如果没有比基准值大的数就是将自己赋值给自己（i 等于 j）
            while (j > i && arr[j] >= baseVal) { //找到一个比基准值小的数交换
                j--
            }
            arr[i] = arr[j] // 将较小的值放在左边如果没有找到比基准值小的数就是将自己赋值给自己（i 等于 j）
        }
        arr[j] = baseVal // 将基准值放至中央位置完成一次循环（这时候 j 等于 i ）
        sort(arr, left, j - 1) // 将左边的无序数组重复上面的操作
        sort(arr, j + 1, right) // 将右边的无序数组重复上面的操作
    }
    const newArr = array.concat() // 为了保证这个函数是纯函数拷贝一次数组
    sort(newArr)
    return newArr
}

                let quicksort = (arr) => {
                    let  sort = (arr,left = 0,right = arr.length - 1) => {
                        let i = left,
                            j = right,
                            baseVal = arr[j];
                        if (left >= right) {
                            return;
                        }
                        while (i < j && arr[i] <= baseVal) {
                            i ++ ; 
                        }
                        arr[j] = arr[i];  
                        while (i < j && arr[j] >= baseVal) {
                            j --
                        }
                        arr [i] = arr [j];
                        arr [j] = baseVal;
                        sort (arr , left , j - 1);
                        sort (arr , j + 1 , right );
                    }
                    sort(arr);
                    return arr;
                }



                // 写一个原型链继承的例子


                function Animal (name) {
                    this.color = ['red','green','purple'];
                    this.sleep = function () {
                        console.log('zzz')
                    }
                }

                


                let cat = new Animal ('xiaoxi');
                let cat2 = new Animal ('dululu');
                cat.color.push ('black');
                console.log(cat2.color)
                console.log(cat.name);
                cat.sleep()


                
                // 原型链继承x

                let Animal = function () {
                    this.species = 'Cat'
                    this.colors = ['red','blue']
                }

                let Cat = function (name) {
                    this.name = name;
                }

                Cat.prototype = new Animal ()
                let cat = new Cat ('kitty');

                
                // or 


                let cat1 = new Animal ('caty1');
                cat1.__proto__ = new Animal()
                cat1.colors.push ('black');
                let cat2 = new Animal ('caty2');
                cat2.__proto__ = new Animal()
                cat 





                // 构造函数继承

                let Bird = function () {
                    this.species = 'bird'
                    console.log('console bird');
                }


                let birddy = function (params) {
                    call (Bird)
                }



                





                //实例继承

                function Father () {
                    this.name = 'father',
                    this.sex = 'male'
                }

                function children (params) {
                    let instance = new Father();
                        instance.sex = 'unknow';
                        instance.parent = 'father';
                        return instance;
                }


                let kid = new children()
                
                
                