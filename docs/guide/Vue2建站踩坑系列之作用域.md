# Vue2建站踩坑系列之作用域
> 由于在项目中，后台的数据一次性给前端，前端需要做一些分页的处理。用的是Vue2+Axios 来做ajax请求目前可以得到后端的数据console.log打印成功,但就是更新不上dom上。开始在axios的success回调了尝试了各种变量声明的位置调整
> 而后在分页逻辑里也检查了许多遍列表仍然不能渲染到页面上。先贴下问题代码。

## html
```html
  <section class="main">
            <ul class="list">
                <li v-for="info in listt2">
                    <img src="#" v-bind:alt="info.Name">                                                     
                    <h4> <a class="talk" target="_blank" v-bind:href="'content.html?'+info.id">{{ info.title }}</a></h4>
                    <span class="ckey">【{{ info.key }}】 </span> <span style="color: #ffffff;"> {{info.id}}</span>
                </li>
            </ul>
             <!--分页按钮区域-->
            <div class="pages" v-show="onn">   
                <button class="previem" @click="page('last')" v-show='curPage>0'>上一页</button>
                <button class="next" @click="page('!last')" v-show="curPage<pageCount-1">下一页</button>
            </div>
        </section> 
```
   
        `

 ## JS
``` js
    Vue.prototype.$ajax = axios;  //修改原型链 
    var vm = new Vue({
        el: '.main',
        data: {
            listt2:[ ],  //页面要展示的数据
            pageSize:10,  //翻页每页显示数据
            curPage:0,  //当前页面
            pageCount:'',  //总共页面数
            onn:true,  //默认显示分页
            items:' ', //后台数据         
        },
        created:function(){
            //Ajax获取后台数据，获取的数据存储在 this.items
            var url = "api.json";
            this.$ajax.get(url)
                .then(function (response) {
                    var jsons = response.data.getJson;
                    var self = this;
                    this.items =jsons;
                    console.log(self.items);
                }).catch(function (error) {
                    console.log(error);
                });
            this.fanye();  //调用分页
        },
        methods: {
            page: function (el) {    //点击翻页
                el == 'last' ? this.curPage-- : this.curPage++;
                var curtotal = this.curPage * this.pageSize;
                var tiaoshu = this.curPage * this.pageSize + this.pageSize;
                this.listt2 = this.items.slice(curtotal,tiaoshu);
                document.body.scrollTop = 0;
            },
            fanye: function () {      //分页处理
                var _this = this;
                _this.listt2 = [];
                if (_this.items) {
                    _this.pageCount = Math.ceil(_this.items.length / _this.pageSize);
                    for (var i = 0; i < _this.pageSize; i++) {
                        if (_this.items[i]) {
                            _this.listt2.push(_this.items[i]);
                        }
                    }
                }
            }
        }
        })
           `
```

## 返回的模拟数据
``` json

     `
        {
    "getJson":[
        {
            "id":"59",
            "key":"science",
            "title":" 动物也是科技宅，这些智能科技装备你想要吗？ ",
            "time":"2017-05-12",
            "name":"两个质子",
            "eng":"lianggezhizi"
        },
        {
            "id":"60",
            "key":"science",
            "title":" 肯定你没见过的养老新科技！ ",
            "time":"2017-06-19",
            "name":"老年健康生活方式",
            "eng":"aged-expo"
        }]
        }
    ```

   经过与群里的开发者沟通后，发现可能是this.fanye()在执行的时候，根本没有数据传入！疑问到底是哪里的值中断了，接着在axios里面打了几个console，发觉原来是this.fanye()位置放错了，应该要放在回调里面才能被异步的JS执行，不然翻页的时候还拿不到后台的数据。

     这时候仍然无法显示，但心里已踏实了许多，看着满屏幕的this心想会不会又是this作用域的问题，检查了一遍果然，self=this放在回调url外层后问题就迎刃而解了。这里遇到了一种特殊的情况，通常Ajax回调的this还是指向Vue的实例本身，但在Axios这个组件中，this却指向了axios内部，重新将this指向Vue实例才能顺利得到想要的数据。