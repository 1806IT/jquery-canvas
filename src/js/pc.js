!function(){
    function AppCanvas(){
        this.$canvas=$('#canvas')
        this.$ctx = this.$canvas.get(0).getContext('2d')//get(0)是什么方法，哪可以查资料？
        this.using=false
        this.lastPoint={x1:undefined,y1:undefined} 
        this.newPoint = { x1: undefined, y1: undefined } 
        this.eraserEnabled=false
        this.color='black'
        this.penWidth=6
        this.pageWidth = document.documentElement.clientWidth
        this.pageHeight = document.documentElement.clientHeight
        this.init()
    }
    //初始化
    AppCanvas.prototype.init=function(){
        this.autoPage(this.pageWidth, this.pageHeight)
        this.useroptions()
        this.listenToUser()
    }   
    //更新画板
    AppCanvas.prototype.autoPage = function (pageWidth, pageHeight){
        this.changePage(pageWidth, pageHeight)
        window.onresize = ()=>{
            this.changePage(pageWidth, pageHeight)
        }        
    }
    //监控用户更改页面大小动作
    AppCanvas.prototype.changePage = function (pageWidth, pageHeight){
        
        this.$canvas.attr({ width: pageWidth, height: pageHeight })
    }
       //监控用户对选项操作的动作
    AppCanvas.prototype.useroptions=function(){
        console.log('useroptions ok')
        
        this.painting()
        this.penscolor()
        this.pensWidth()
        this.clearing()
        this.saving()
        this.erasing()
    }
    AppCanvas.prototype.erasing=function(){
        self=this
        $('#eraser').on('click', function(){
            $('.pens').children().removeClass('active')
            console.log('进入橡皮擦状态')
            self.eraserEnabled = true
            $('#eraser').addClass('active').siblings().removeClass('active')
            self.color ='#fafafafa' 
        })
    }
    AppCanvas.prototype.painting = function () {   
        self = this
        $('#painting').on('click', () => {        
            console.log('绘画模式')
            this.drawing()           
        })  
    }
    AppCanvas.prototype.drawing = function () { 
        $('#painting').addClass('active').siblings().removeClass('active')
        $('.area').css('display', 'none')
        self.eraserEnabled = false
    }
    AppCanvas.prototype.penscolor = function () {
        console.log('color ok')
        self = this     
        $('.pens>div').on('click',function(){           
            $(this).addClass('active').siblings().removeClass('active')
            //改变画笔颜色
            let code=$(this).attr('style')
            pencolor = code.substring(11, code.length)
            console.log(pencolor)
            self.color = pencolor
            self.using = false
            self.lastPoint = { x1: undefined, y1: undefined }
            self.drawing()
        }) 
    }
        //增加宽度选项，橡皮擦宽度选项，保存选项，清除选项
    AppCanvas.prototype.pensWidth = function () {
        console.log('请选择画笔宽度ok')
        $('.thin').on('click',()=>{
            console.log('细线')
            self.penWidth = 5
            $('.thin').addClass('active').siblings().removeClass('active')
        })
        $('.thick').on('click', () => {
            console.log('粗线')
            self.penWidth = 12
            $('.thick').addClass('active').siblings().removeClass('active')
        })
    }
    AppCanvas.prototype.clearing = function () {
        console.log('清空画板 ok')
        $('#clear').on('click', () => { 
            console.log('清空了')
            $('#clear').addClass('active')
            self.$ctx.clearRect(0, 0, self.pageWidth, self.pageHeight)
            setTimeout(() => {
                $('#clear').removeClass('active')
            }, 1000);
        })     
    }
    AppCanvas.prototype.saving = function () {
        console.log('保存ok')
        $('#saving').on('click',()=>{
            //这个保存的事件的函数怎么改成jquery？
            
            $('#saving').addClass('active')
            let url = canvas.toDataURL('image/png')
            let $a=$('<a></a>')
            $('body').append($a)
            var a=document.querySelector('a')
            a.href=url
            a.download='画'
            a.click()
            setTimeout(() => {
                $('#saving').removeClass('active')
            }, 1000);
        })
    }
        

    AppCanvas.prototype.listenToUser=function(){
        self = this
        this.$canvas.on('touchstart mousedown',function(point){
            self.using = true
            lastPoint = self.testCharacter(point)
            if (self.eraserEnabled) {
                $('.area').css('display', 'block')
            }    
        })
        this.$canvas.on('touchmove mousemove', (point) => {
            if (self.using){
                console.log('move')
                newPoint = self.testCharacter(point) 
                let x1 = newPoint.x1
                let y1 = newPoint.y1                                 
                self.drawCircle(x1, y1, self.penWidth/2)
                self.drawLine(self.lastPoint.x1, self.lastPoint.y1, newPoint.x1, newPoint.y1)
                //为什么加了下面这句就出现不能监听touchend mouseup情况了？，删掉这句话除了没有橡皮擦的范围，其余都正常了
                if (self.eraserEnabled){
                    console.log('橡皮跟着鼠标飞')
                    $('.area').css({top:y1,left:x1})
                }
                //------..//
                self.lastPoint = newPoint                
            }          
        })
        this.$canvas.on('touchend mouseup', () => {
            console.log('end')
            self.using = false
            this.lastPoint = { x1: undefined, y1: undefined }
            $('.area').css('display', 'none')
            return false
        })
    }
    AppCanvas.prototype.testCharacter=function(point){
        if (document.body.ontouchstart !== undefined) {//为触屏设备
            var x = point.touches[0].clientX
            var y = point.touches[0].clientY
        } else {
            var x = point.clientX
            var y = point.clientY
        }
        return { x1: x, y1: y }
    }
       
    AppCanvas.prototype.drawCircle = function (x, y, radius){
        this.$ctx.beginPath()
        this.$ctx.arc(x, y, radius, 0, Math.PI * 2)
        this.$ctx.fillStyle = this.color
        this.$ctx.fill()
    }
    AppCanvas.prototype.drawLine=function(x1, y1, x2, y2) {
        this.$ctx.beginPath()
        this.$ctx.moveTo(x1, y1)
        this.$ctx.lineWidth = self.penWidth
        this.$ctx.lineTo(x2, y2)
        this.$ctx.strokeStyle =this.color
        this.$ctx.stroke()
        this.$ctx.closePath()
    } 
    let canvasapp=new AppCanvas()
    canvasapp.init() 
}()

