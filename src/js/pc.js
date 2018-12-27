!function(){
    function AppCanvas(){
        this.$canvas=$('#canvas')
        this.$ctx = this.$canvas.get(0).getContext('2d')//get(0)是什么方法，哪可以查资料？
        this.using=false
        this.lastPoint={x:undefined,y:undefined}
        this.eraserEnabled=false
        this.color='black'
        this.init()
    }
    //初始化
    AppCanvas.prototype.init=function(){
        this.autoPage()
        this.useroptions()
        this.listenToUser()
    }   
    //更新画板
    AppCanvas.prototype.autoPage=function(){
        this.changePage()
        window.onresize = ()=>{
            this.changePage()
        }        
    }
    //监控用户更改页面大小动作
    AppCanvas.prototype.changePage=function(){
        let pageWidth = document.documentElement.clientWidth
        let pageHeight = document.documentElement.clientHeight
        this.$canvas.attr({ width: pageWidth, height: pageHeight })
    }
       //监控用户对选项操作的动作
    AppCanvas.prototype.useroptions=function(){
        console.log('useroptions ok')
        self=this
        $('#eraser').on('click', function(){
            console.log('触屏下点击事件')
            self.eraserEnabled = true//这里如果用箭头函数的画，我怎么修改对象中的属性值呢？
            console.log('橡皮擦状态')
            $('#eraser').addClass('active').siblings().removeClass('active')
        })
        $('#painting').on('click', () => {
            self.eraserEnabled = false
            console.log('绘画模式')
            $('#painting').addClass('active').siblings().removeClass('active')
            $('.area').css('display', 'none')
        })       
        $('.pens>div').on('click',function(){           
            $(this).addClass('active').siblings().removeClass('active')
            //
            let code=$(this).attr('style')
            pencolor = code.substring(11, code.length)
            console.log(pencolor)
            self.color = pencolor
        }) 
        //增加宽度选项，橡皮擦宽度选项，保存选项，清除选项
    }
        

    AppCanvas.prototype.listenToUser=function(){
    // if(ontouchstart===undefined){方法1
        self = this
        if(document.body.ontouchstart!==undefined){//为触屏设备
            console.log('触屏模式')       
            this.$canvas.on('touchstart',function(point){
                self.using = true;
                let x = point.touches[0].clientX
                let y = point.touches[0].clientY
                lastPoint = { x: x, y: y }
                if (self.eraserEnabled) {
                    $('.area').css('display', 'block')
                    console.log('准备橡皮擦:' + self.eraserEnabled)
                    $('.area').css({ top: y - 4, left: x - 4 })//要能调节大小
                }
            })
            this.$canvas.on('touchmove', (point) => {
                console.log('move')
                let x = point.touches[0].clientX
                let y = point.touches[0].clientY
                let newPoint = { x: x, y: y }
                if (self.eraserEnabled) {
                    self.$ctx.clearRect(x - 3, y - 3, 8, 8)//还要打磨，先走完
                    $('.area').css({ top: y - 4, left: x - 4 })//要能调节大小
                } else {
                    self.drawCircle(x, y)
                    self.drawLine(self.lastPoint.x, self.lastPoint.y, newPoint.x, newPoint.y)
                    self.lastPoint = newPoint
                }
            })
            this.$canvas.on('touchend', () => {
                console.log('end')
                self.using = false;
                this.lastPoint = { x: undefined, y: undefined }
            })
        }else{//为非触屏设备            
            $('#canvas').on('mousedown',function(point){
                self.using=true;
                let x=point.clientX
                let y=point.clientY
                self.lastPoint={x:x,y:y}
                if (self.eraserEnabled){
                    $('.area').css('display','block')
                    console.log('准备橡皮擦:' + self.eraserEnabled)
                    $('.area').css({ top: y - 4, left: x - 4 })//要能调节大小
                }
            })

                $("#canvas").on('mousemove',(point)=>{  
            if(using){
                let x = point.clientX
                let y = point.clientY
                let newPoint={x:x,y:y}
                if (self.eraserEnabled){
                    self.$ctx.clearRect(x-3,y-3,8,8)//还要打磨，先走完
                    $('.area').css({ top: y - 4, left: x - 4 })//要能调节大小
                }else{
                    self.drawCircle(x,y)
                    self.drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
                    self.lastPoint=newPoint            
                    }
                }
            })

            $('#canvas').on('mouseup',()=>{
                console.log('up')
                self.using=false;
                this.lastPoint = { x: undefined, y: undefined }
            }) 
        }
    }    
    AppCanvas.prototype.drawCircle=function(x, y, radius = 2){
        this.$ctx.beginPath()
        this.$ctx.arc(x, y, radius, 0, Math.PI * 2)
        this.$ctx.fillStyle = this.color
        this.$ctx.fill()
    }
    AppCanvas.prototype.drawLine=function(x1, y1, x2, y2) {
        this.$ctx.beginPath()
        this.$ctx.moveTo(x1, y1)
        this.$ctx.lineWidth = 5
        this.$ctx.lineTo(x2, y2)
        this.$ctx.strokeStyle =this.color
        this.$ctx.stroke()
        this.$ctx.closePath()
    } 
    let canvasapp=new AppCanvas()
    canvasapp.init() 
}()

