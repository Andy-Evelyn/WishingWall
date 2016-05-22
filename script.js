var EventUtil = {
        addHandler:function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else if(element.attachEvent){
                element.attachEvent("on" + type,handler);
            }else{
                element["on" + type] = handler;
            };
        },
        getEvent: function(event) {
                return event || window.event;
        },
        getTarget: function(event) {
                return event.target || event.srcElement;
        },
        preventDefault:function(event){
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            };
        },
        removeHandler:function(element,type,handler){
            if(element.removeEventListener){
                element.removeEventListener(type,handler,false);
            }else if(element.detachEvent){
                element.detachEvent("on" + type,handler);
            }else{
                element["on" + type] = null;
            };
        },
        stopPropagation:function(event){
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            };
        },
};

var WishWall = function(){
    this.a = null;
    this.Left = null;
    this.Top = null;
    this.index = 1;
    this.Width = document.body.clientWidth || document.documentElement.clientWidth;
    this.Height = document.body.clientHeight || document.documentElement.clientHeight;
    this.init();
};

WishWall.prototype = {
    init:function(){
        this.mouse();
        this.handler();
    },
    g:function(id){
         return id.substring(0,1) == "." ? document.getElementsByClassName(id.substring(1)) : document.getElementById(id);
    },
    add:function(){
        this.g("light").style.display = "block";
        this.g("fade").style.display = "block";
    },
    cancel:function(){
        this.g("light").style.display = "none";
        this.g("fade").style.display = "none";
    },
    move:function(o,e){
        e = e || event;
        this.a = o;
        /*设置鼠标捕获*/
        document.all ? this.a.setCapture() : window.captureEvents(Event.MOUSEMOVE);  
        initX = parseInt(this.a.style.left);
        initY = parseInt(this.a.style.top);
        offsetX = e.clientX;
        offsetY = e.clientY;
        this.a.style.zIndex = this.index++;
    },
    mouse:function(){
        var that = this;
        document.onmouseup = function() {
        if (!that.a) return;
        /*释放鼠标捕获*/ 
        document.all ? that.a.releaseCapture() : window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);    
        that.a = "";
        };
        document.onmousemove = function(e) {
        if (!that.a) return;
        e = e || event;
        that.a.style.left = (e.clientX - offsetX + initX) + "px";
        that.a.style.top = (e.clientY - offsetY + initY) + "px";  
        };
    },
    GetCurrentStyle:function(obj, attribute){
        return obj.currentStyle?obj.currentStyle[attribute]:document.defaultView.getComputedStyle(obj,false)[attribute];
    },
    siblings:function(el){
        var p1 = this.g(el).parentNode.children;
        for(var i = 0; i< p1.length;i++){
            if(p1[i] != this.g(el)){
                p1[i].style.border="none";
            }
        }
        this.g(el).style.border="1px solid #369"; 
        /*将当前的背景色保存在myColor中*/
        this.g("mycolor").value = this.GetCurrentStyle (this.g(el),"background-color");
    },
    handler:function(){
        var that = this;
        EventUtil.addHandler(this.g("color"),"click",function(event){
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            switch(target.id){
                case "c1":
                    that.siblings("c1");
                break;
                case "c2":
                    that.siblings("c2");
                break;
                case "c3":
                    that.siblings("c3");
                break;
                case "c4":
                    that.siblings("c4");
                break;
            }
        });
    },
    btnAdd_Click:function(){
        var strStuID = this.g("txtStuID").value;
        var strTextarea = this.g("txt").value;
        var strColor;
        var strTime = new Date();
        if(this.g("mycolor").value == ""){
            strColor = "#fc9";
        }else{
             strColor = this.g("mycolor").value;
        }
        if(strTextarea == "") {
            alert("您还没有许下心愿哟！");
            return false;
        }
        if(strTextarea.length > 0){
            //定义一个实体对象，保存全部获取的值
            var setData = new Object;
            setData.StuID = strStuID;
            setData.Textarea = strTextarea;
            setData.Color = strColor;
            setData.Time = strTime.toLocaleDateString(); 
            var strTxtData = JSON.stringify(setData);
            localStorage.setItem(strStuID,strTxtData);     
        }
        this.getlocalData();     
        //清空原先内容
        this.g("txt").value = "";
        this.g("mycolor").value = "";
        this.cancel();
     },
     //获取保存数据并显示在页面中
     getlocalData:function(){
        var strHTML = "";
        this.Left = 100;
        this.Top = 140;
        var all = new Array();
        for(var i = 0;i < localStorage.length;i++){
            var strKey = localStorage.key(i);
            if(!isNaN(strKey)){
            var GetData = JSON.parse(localStorage.getItem(strKey));
            this.Left += 181;
            if(this.Left > (this.Width-350)){
                this.Left = 100;
                this.Top += 80;
            }
            strHTML += "<li style='left:";
            strHTML += this.Left;
            strHTML += "px; top:";
            strHTML += this.Top;
            strHTML += "px; background:";
            strHTML += GetData.Color;
            strHTML += "' onmousedown = 'wishwall.move(this,event)'>" ;
            strHTML += "<div class='sradius'></div>";
            strHTML += "<a class='icon icon-cancel-circle' href='#' onclick = wishwall.DeleteData('";
            strHTML += GetData.StuID;
            strHTML += "')></a>";
            strHTML += "<p class='snum'>"+parseInt(GetData.StuID)+"</p>";
            strHTML += "<p class='wcolor'>"+GetData.Textarea+"</p>";
            strHTML +="<span class='wtime'>"+ GetData.Time + "</span>";
            strHTML +="</li>";
            } 
            all.push(GetData.StuID);
        }
        this.g("main").innerHTML = strHTML;
        var ID = 1;
        if(localStorage.length != 0){
            ID =  Math.max.apply(null, all) + 1;
        } 
        this.g("txtStuID").value = ID;
    },
    DeleteData:function(k){
        //删除指定键名对应的数据
        localStorage.removeItem(k); 
        this.getlocalData();
    },
};

var wishwall = new WishWall();


     
     
     

     
     
     
    
     
