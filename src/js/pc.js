!function(){
    let $canvas=$('#canvas')
    let $ctx = $canvas.get(0).getContext('2d')//get(0)是什么方法，哪可以查资料？
    let using=false
    let lastPoint={x:undefined,y:undefined}
    let eraserEnabled=false
    //要增加橡皮范围功能
    autoPage()
    listenToUser()
    function autoPage(){
        changePage()
        window.onresize = function(){
            changePage()
        }        
    }
    //监控用户对页面的动作


    function listenToUser(){
       $('#eraser').on('click',()=>{
            eraserEnabled=true
            console.log('橡皮擦状态')
            $('#eraser').addClass('active').siblings().removeClass('active')
        })
        $('#painting').on('click',()=>{
            eraserEnabled=false
            console.log('绘画模式')
            $('#painting').addClass('active').siblings().removeClass('active')
            $('.area').css('display', 'none')
        })
        $('#canvas').on('mousedown',function(point){
            using=true;
            let x=point.clientX
            let y=point.clientY
            lastPoint={x:x,y:y}
            if(eraserEnabled){
                $('.area').css('display','block')
                console.log('准备橡皮擦:' + eraserEnabled)
                $('.area').css({ top: y - 4, left: x - 4 })//要能调节大小
            }
        })

            $("#canvas").on('mousemove',(point)=>{  
        if(using){
            let x = point.clientX
            let y = point.clientY
            let newPoint={x:x,y:y}
            if (eraserEnabled){
                $ctx.clearRect(x-3,y-3,8,8)//还要打磨，先走完
                $('.area').css({ top: y - 4, left: x - 4 })//要能调节大小
            }else{
                drawCircle(x,y)
                drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
                lastPoint=newPoint            
                }
            }
        })

        $('#canvas').on('mouseup',()=>{
            console.log('up')
            using=false;
        }) 
    }
    
    function changePage() {
        let pageWidth = document.documentElement.clientWidth
        let pageHeight = document.documentElement.clientHeight
        $canvas.attr({ width: pageWidth, height: pageHeight })
    }

    function drawCircle(x, y, radius = 2) {
        $ctx.beginPath()
        $ctx.arc(x, y, radius, 0, Math.PI * 2)
        $ctx.fillStyle = 'red'
        $ctx.fill()
    }
    function drawLine(x1, y1, x2, y2) {
        $ctx.beginPath()
        $ctx.moveTo(x1, y1)
        $ctx.lineWidth = 5
        $ctx.lineTo(x2, y2)
        $ctx.strokeStyle = 'red'
        $ctx.stroke()
        $ctx.closePath()
    } 
}()

