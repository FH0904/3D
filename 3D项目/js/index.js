(function () {
    let len = 5 * 5 * 5,
        oUl = document.getElementById('main').children[0],
        aLi = oUl.children;
    let oAlert = document.querySelector('#alert');
    let oMain = document.querySelector('#main');
    let oAll = document.querySelector('#all');
    let oBack = document.querySelector('#back');
    let oIframe = document.querySelector('#iframe iframe');

    //初始化
    (function () {
        let oATitle = document.querySelector('.title>span'),
            oAImg = document.querySelector('.img>img'),
            oAAuthor = document.querySelector('.author>span'),
            oAInfo = document.querySelector('.info>span');
        //文档碎片
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < len; i++) {
            //创建li
            let oLi = document.createElement('li');
            oLi.index = i;
            //获取数据
            let thisData = data[i] || data[0];

            //添加li的内容
            oLi.innerHTML = `<b class="licover"></b>
                            <p class="title">${thisData.title}</p>
                            <p class="author">${thisData.author}</p>
                            <p class="time">${thisData.time}</p>`;
            //定义li在3d空间的位置
            let ranX = Math.random() * 6000 - 3000,
                ranY = Math.random() * 6000 - 3000,
                ranZ = Math.random() * 6000 - 3000;

            //设置随机位置
            oLi.style.transform = `translate3D(${ranX}px,${ranY}px,${ranZ}px )`
            //获取弹窗
            oLi.onclick = function (e) {
                e.stopPropagation();
                //显示弹窗
                //内容修改
                oATitle.innerHTML = `课题：${thisData.title}`;
                oAAuthor.innerHTML = `主讲老师：${thisData.author}`;
                oAInfo.innerHTML = `描述：${thisData.dec}`;
                //样式修改
                oAlert.style.transition = '0s';
                oAlert.style.transform = 'scale(2)';

                oAlert.style.opacity = '1';

                oAlert.offsetLeft;//重绘
                oAlert.style.transform = 'scale(1)';
                oAlert.style.transition = '.3s';
                //弹窗层的显示
                oAlert.onclick = function (e) {
                    //阻止冒泡
                    e.stopPropagation();
                    oAll.classList.add('right');
                    oIframe.src = thisData.src;
                    console.log(thisData.src);
                }
            };

            //将li放置到文档碎片里面
            fragment.appendChild(oLi);
        }
        oUl.appendChild(fragment);
        setTimeout(Grid, 20);
    })();
    //弹窗层的隐藏
    (function () {
        document.onclick = function () {
            if (oAlert.style.opacity === "0") return;
            //退出动画
            oAlert.style.transition = ".8s";
            oAlert.style.transform = "scale(0) rotateY(270deg)";
            oAlert.style.opacity = "0";
        };

        oBack.onclick = function () {
            oAll.classList.remove("right");
        };
    })();

    //拖拽与滚轮
    (function () {
        let lastX,
            lastY,
            nX,
            nY,
            x_,
            y_,
            timer;

        let roX = 0,
            roY = 0,
            trZ = -2450;
        //给document加拖拽事件
        document.onmousedown = function (e) {

            //停止可能还没有结束的惯性动画
            cancelAnimationFrame(timer);

            //获取鼠标的初始位置
            lastX = e.clientX;
            lastY = e.clientY;

            this.onmousemove = function (e) {
                //当前点的位置
                nX = e.clientX;
                nY = e.clientY;

                x_ = nX - lastX;
                y_ = nY - lastY;
                roX -= y_ * 0.15;
                roY += x_ * 0.15;
                oUl.style.transform = `translateZ(${trZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;
                lastX = nX;
                lastY = nY;

            }
            this.onmouseup = function (e) {
                this.onmousemove = null;

                (function a() {
                    x_ *= 0.95;
                    y_ *= 0.95;
                    if (Math.abs(x_) <= 0.1) {
                        x_ = 0;
                    }
                    if (Math.abs(y_) <= 0.1) {
                        y_ = 0;
                    }
                    roX -= y_ * 0.1;
                    roY += x_ * 0.1;
                    oUl.style.transform = `translateZ(${trZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;
                    if (!x_ && !y_) return;
                    timer = requestAnimationFrame(a);
                })()

                //滚轮事件沿z轴移动
                mousewheel(document, function (e, d) {
                    trZ += d * 150;
                    trZ = Math.min(trZ, 100);
                    trZ = Math.max(trZ, -10000);
                    oUl.style.transform = `translateZ(${trZ}px) rotateX(${roX}deg) rotateY(${roY}deg)`;
                })
            }
        }

    })();

    //左下角按钮点击事件
    (function () {
        //获取所有按钮
        let abtn = document.getElementById('btn').getElementsByTagName('li');
        let arr = [Table, Sphere, Helix, Grid];
        for(let i = 0; i<arr.length; i++){
            abtn[i].onclick= arr[i]
        }
    })()

    //table 元素周期表
    function Table() {
        if (Table.arr) {
            for(let i = 0; i<len; i++){
                aLi[i].style.transform = Table.arr[i]
            }
        } else {
            Table.arr = [];
            let n = Math.ceil(len / 18) + 2;  //计算li要排列多少行
            let midY = n / 2 - 0.5            //现在有9行  ul在第四行
            let midX = 18 / 2 - 0.5           //计算传值方向上ul所在的x的位置
            //水平垂直间距
            let jX = 170;
            let jY = 210;

            //定义前三行不规则布局的坐标
            let coordinate = [
                { x: 0, y: 0 }
                , { x: 17, y: 0 }
                , { x: 0, y: 1 }
                , { x: 1, y: 1 }
                , { x: 12, y: 1 }
                , { x: 13, y: 1 }
                , { x: 14, y: 1 }
                , { x: 15, y: 1 }
                , { x: 16, y: 1 }
                , { x: 17, y: 1 }
                , { x: 0, y: 2 }
                , { x: 1, y: 2 }
                , { x: 12, y: 2 }
                , { x: 13, y: 2 }
                , { x: 14, y: 2 }
                , { x: 15, y: 2 }
                , { x: 16, y: 2 }
                , { x: 17, y: 2 }
            ];
            for (let i = 0; i < len; i++) {
                let x = i < 18 ? coordinate[i].x : i % 18;
                let y = i < 18 ? coordinate[i].y : Math.floor(i / 18) + 2;

                let trX = (x - midX) * jX;
                let trY = (y - midY) * jY;
                let val = `translate3D(${trX}px,${trY}px,0px)`;
                Table.arr[i] = val;
                aLi[i].style.transform = val;
            }
        }
    };

    //sphere
    function Sphere(){
        if(Sphere.arr){
            for(let i =0;i<len;i++){
                console.log(1);
                aLi[i].style.transform = Sphere.arr[i];
            }
        }else{
            console.log(2);
            //定义arr确定球面一共有多少层以及每层有多少个li
        let arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1],
        arrlen = arr.length,
        xDeg = 180/(arrlen - 1);
        Sphere.arr = [];

    //循环遍历所有li
    for(let i = 0; i<len; i++){
        //定义遍历来保存此时的i是在球面的第几层.以及当前层的第几个
        let numC = 0,      //计算当前i是第几层
            numG = 0,       //第几个
            arrSum = 0;     //当前层一共多少个
        
        //for循环判断此时的i是第几层第几个
        for(let j = 0 ; j<arrlen; j++){
            arrSum += arr[j];

            //判断i是第几层第几个
            if(arrSum>i){
                numC = j;
                numG = arr[j] - (arrSum-i);
                break; 
            }
        }
        //根据当前层数求出当前层没一个li的旋转度数
        let yDeg = 360/arr[numC];

        let rotY = (numG+1.49)*yDeg;

        let roX = 90 -numC*xDeg;


        let val = `rotateY(${rotY}deg) rotateX(${roX}deg) translateZ(800px)`;
            Sphere.arr[i] = val;
            aLi[i].style.transform  = val;
    }
        }
    };

    function Helix(){
        if(Helix.arr){
            for(let i = 0; i<len; i++){
                aLi[i].style.transform = Helix.arr[i]
            }
        }else{
            Helix.arr =[];
            let h = 3.5 , //环数
                tY = 7, //每个li的上下错位
                num = Math.round(len/h) ,//每一环多少个li
                deg =  360/num ,    //计算每个li Y 轴旋转的度数
                mid =  len / 2 - 0.5;  //找中间值
            for(let i = 0; i<len; i++){
                let roX = i *deg,
                    roY = (i+1 - mid)*tY;
                    

                let val = `rotateY(${roX}deg) translateY(${roY}px) translateZ(800px)`;
                Helix.arr[i] = val;
                aLi[i].style.transform = val;
            }

        }
    }

    //Grid
    function Grid() {
        if (Grid.arr) {
            for (let i = 0; i < len; i++) {
                aLi[i].style.transform = Grid.arr[i]
            }
        } else {
            let disX = 350,
                disY = 350,    //li之间的间距
                disZ = 350;
            Grid.arr = [];
            for (let i = 0; i < len; i++) {
                let x = i % 5,
                    y = Math.floor(i % 25 / 5),
                    z = Math.floor(i / 25);



                let trX = (x - 2) * disX;
                let trY = (y - 2) * disY;
                let trZ = (2 - z) * disZ;
                let val = `translate3D(${trX}px,${trY}px,${trZ}px )`;
                Grid.arr[i] = val;
                aLi[i].style.transform = val;
            }



        }

    };

})()