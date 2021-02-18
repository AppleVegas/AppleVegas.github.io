const canvas = document.getElementById('thegame')
var mousex
var mousey
var w = $(window).width();
var h = $(window).height();

function ScreenScale(int)
{
    return w/int
}

var screenscale = ScreenScale(1366)

function Scale(num)
{
    return (num*screenscale)
}

var curtime = 0
function changeResolution(cnvs, width, height)
{
    cnvs.style.width = width.toString() + "px"
    cnvs.style.height = height.toString() + "px"
    $(cnvs).attr("width", width.toString() + "px");
    $(cnvs).attr("height", height.toString() + "px");
}

changeResolution(canvas, w, h)

$(window).resize(function(){
    w = $(window).width();
    h = $(window).height();
    changeResolution(canvas, w, h)
});

const ctx = canvas.getContext('2d')

function Distance(x,y,x1,y1){
    let dx = x1 - x;
    let dy = y1 - y;
    return Math.sqrt(dx * dx + dy * dy);
};

function roundedRect(ctx,x,y,width,height,radius){
    ctx.beginPath();
    ctx.moveTo(x,y+radius);
    ctx.lineTo(x,y+height-radius);
    ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
    ctx.lineTo(x+width-radius,y+height);
    ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    ctx.lineTo(x+width,y+radius);
    ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
    ctx.lineTo(x+radius,y);
    ctx.quadraticCurveTo(x,y,x,y+radius);
    ctx.stroke();
}

function angledLine(ctx, x, y, length, width, angle, color)
{
    let rot = angle * Math.PI / 180
    let x2 = x + (length * Math.cos(rot))
    let y2 = y + (length * Math.sin(rot))
    ctx.beginPath();     
    ctx.moveTo(x, y);    
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color
    ctx.lineWidth = width;
    ctx.stroke();   
    ctx.strokeStyle = "white"
}

function Line(ctx, x, y, x2, y2, width, color)
{
    ctx.beginPath();     
    ctx.moveTo(x, y);    
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color
    ctx.lineWidth = width;
    ctx.stroke();   
    ctx.strokeStyle = "white"
}

$("body").mousemove(function(e) {
    mousex = e.pageX;
    mousey = e.pageY;
})

const TheGame = {
    Settings:{
        TickCount: 60
    },
    Constants:{
        TickHandler: null
    },
    Player: {
        RotationTime: 0.5,
        Rotation: 0,
        OldRotation: 0,
        NewRotation: 0,
        WasSpinned: false,
        NewTime: 0,
        Shot: true
    },
    Bullets:[]
}

TheGame.FireBullet = function(x,y,angle, speed = 1){
    let SingleBullet = {
        Speed: speed,
        X: x,
        Y: y,
        Ang: angle
    }
    TheGame.Bullets.push(SingleBullet)
}

$( "body" ).click(function() {
    if (curtime - TheGame.Player.NewTime > (TheGame.Player.RotationTime*1000))
    {
        TheGame.Player.Shot = false
        if (TheGame.Player.WasSpinned)
        {
            TheGame.Player.Rotation = TheGame.Player.NewRotation
            TheGame.Player.WasSpinned = false
        }
        TheGame.Player.OldRotation = TheGame.Player.Rotation
        TheGame.Player.NewRotation = (Math.atan2(mousey - h/2, mousex - w/2)* 180 / Math.PI)
        TheGame.Player.NewTime = curtime
        //TheGame.FireBullet(w/2,h/2, TheGame.Player.Rotation, 4)
    }
});

function BulletMove(){
    for (let i = 0; i < TheGame.Bullets.length; i++) {
        if (TheGame.Bullets[i].X >= w || TheGame.Bullets[i].X <= 0)
        {
            TheGame.Bullets.splice(i, 1)
            continue;
        }
        if (TheGame.Bullets[i].Y >= h || TheGame.Bullets[i].Y <= 0)
        {
            TheGame.Bullets.splice(i, 1)
            continue;
        }

        let rot = TheGame.Bullets[i].Ang * Math.PI /180
        dx = (Math.cos(rot) * TheGame.Bullets[i].Speed);
        dy = (Math.sin(rot) * TheGame.Bullets[i].Speed)
        TheGame.Bullets[i].X += dx
        TheGame.Bullets[i].Y += dy
    }
}

function DrawBullets(){
    for (let i = 0; i < TheGame.Bullets.length; i++) {
        ctx.translate(TheGame.Bullets[i].X, TheGame.Bullets[i].Y);
        let rot = (TheGame.Bullets[i].Ang - 90) * Math.PI /180
        ctx.fillStyle = "white"
        let size = Scale(5)
        ctx.rotate(rot);
        Line(ctx, 0, 0, 0, 10*screenscale, 1, "white")
        ctx.fillRect(0 - (size/2), 0 - (size/2), size, size)
        ctx.resetTransform();
        ctx.fillStyle = "white"
    }
}

function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

function Tick(){
    BulletMove()

    if (curtime - TheGame.Player.NewTime <= (TheGame.Player.RotationTime*1000))
    {
        let add = (TheGame.Player.NewRotation - TheGame.Player.OldRotation)
        if (add >= 180 || add <= -180)
        {
            TheGame.Player.WasSpinned = true
            add = ((180 - Math.abs(TheGame.Player.OldRotation)) + (180 - Math.abs(TheGame.Player.NewRotation)))
            //console.log(add)
            if (TheGame.Player.NewRotation > TheGame.Player.OldRotation){
                TheGame.Player.Rotation = easeInOutCubic((curtime - TheGame.Player.NewTime)/(TheGame.Player.RotationTime*1000), TheGame.Player.OldRotation, add*-1, 1);
            }else{
                TheGame.Player.Rotation = easeInOutCubic((curtime - TheGame.Player.NewTime)/(TheGame.Player.RotationTime*1000), TheGame.Player.OldRotation, add, 1);
            }
            
        }else{
            TheGame.Player.Rotation = easeInOutCubic((curtime - TheGame.Player.NewTime)/(TheGame.Player.RotationTime*1000), TheGame.Player.OldRotation, add, 1);
        }
    }else{
        if (!TheGame.Player.Shot){
            TheGame.Player.Shot = true
            TheGame.FireBullet(w/2,h/2, TheGame.Player.Rotation, 4)
        }
    }

}
TheGame.Constants.TickHandler = setInterval(Tick, 1000 / TheGame.Settings.TickCount)

var lasttime = 0
var frames = 0
var fps = 0

function draw(time){
    curtime = time
    ctx.clearRect(0, 0, w, h);

    frames = frames + 1
    let diff = time - lasttime
    if (diff >= 100)
    {
        lasttime = time
        fps = Math.round((frames/diff)*1000)
        frames = 0
    }
   
    DrawBullets()
    ctx.font = Scale(32)+"px serif";
    ctx.fillText(fps, 10, Scale(30));

    //TheGame.Player.Rotation = TheGame.Player.Rotation + 1
    //if (TheGame.Player.Rotation >= 360){
    //    TheGame.Player.Rotation = 0
    //}

   //let cos = (mousex - (w/2)) / Distance(w/2,h/2, mousex, mousey)
   //TheGame.Player.Rotation = Math.acos(cos)*180/Math.PI
   
    ctx.font = (32*screenscale)+"px serif";
    //ctx.fillText(TheGame.Player.Rotation, 10, Scale(60));
    //ctx.fillText(TheGame.Player.NewRotation, 10, Scale(90));
    //ctx.fillText(TheGame.Player.OldRotation, 10, Scale(120));
    //ctx.fillText((TheGame.Player.NewRotation - TheGame.Player.OldRotation), 10, Scale(150));
    //angledLine(ctx, w/2, h/2, w*h, 1, TheGame.Player.Rotation, "white") 
    
    ctx.translate(w/2, h/2);

    let rot = (TheGame.Player.Rotation - 90) * Math.PI /180

    ctx.rotate(rot);
    Line(ctx, 0, 0, 0, w*h, 1, "rgba(255,0,0,10)")
    ctx.fillStyle = "white"
    let size = Scale(20)
    ctx.fillRect(0 - (size/2), 0 - (size/2), size, size)
    size = Scale(10)
    ctx.fillRect(0 - (size/2), Scale(10), size, size)
    ctx.resetTransform();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
