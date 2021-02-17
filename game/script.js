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

var lasttime = 0
var frames = 0
var fps = 0

const TheGame = {
    Player: {
        Rotation: 0
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
    TheGame.FireBullet(w/2,h/2, TheGame.Player.Rotation, 4)
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
        //TheGame.Bullets[i].X = approach(TheGame.Bullets[i].X, TheGame.Bullets[i].DirX, TheGame.Bullets[i].Speed)
        //TheGame.Bullets[i].Y = approach(TheGame.Bullets[i].Y, TheGame.Bullets[i].DirY, TheGame.Bullets[i].Speed)
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
        let size = 10
        ctx.rotate(rot);
        Line(ctx, 0, 0, 0, 10, 1, "white")
        ctx.fillRect(0 - (size/2)*screenscale, 0 - (size/2)*screenscale, size*screenscale, size*screenscale)
        ctx.resetTransform();
        ctx.fillStyle = "white"
    }
}


function draw(time){
    ctx.clearRect(0, 0, w, h);

    frames = frames + 1
    let diff = time - lasttime
    if (diff >= 100)
    {
        lasttime = time
        fps = Math.round((frames/diff)*1000)
        frames = 0
    }
    BulletMove()
    DrawBullets()
    ctx.font = "48px serif";
    ctx.fillText(fps, 10, 50);

    //TheGame.Player.Rotation = TheGame.Player.Rotation + 1
    //if (TheGame.Player.Rotation >= 360){
    //    TheGame.Player.Rotation = 0
    //}

   //let cos = (mousex - (w/2)) / Distance(w/2,h/2, mousex, mousey)
   //TheGame.Player.Rotation = Math.acos(cos)*180/Math.PI

    TheGame.Player.Rotation = Math.atan2(mousey - h/2, mousex - w/2)* 180 / Math.PI
    //angledLine(ctx, w/2, h/2, w*h, 1, TheGame.Player.Rotation, "white") 
    
    ctx.translate(w/2, h/2);

    let rot = (TheGame.Player.Rotation - 90) * Math.PI /180

    
    

    ctx.rotate(rot);
    Line(ctx, 0, 0, 0, w*h, 1, "white")
    ctx.fillStyle = "white"
    let size = 20
    ctx.fillRect(0 - (size/2)*screenscale, 0 - (size/2)*screenscale, size*screenscale, size*screenscale)
    size = 10
    ctx.fillRect(0 - (size/2)*screenscale, 10, size*screenscale, size*screenscale)
    ctx.resetTransform();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
