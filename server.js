const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.sendFile('C:\\Users\\ALOK DUBEY\\Desktop\\thrifter_app\\video_streamer_app\\frontend\\index.html')
})
app.get('/stream',(req,res)=>{
    const range = req.headers.range;
    console.log(req.headers)
    if(!range){
        res.status(400).send("send me a range man!");
    }
    const videoPath = `./videos/video.webm`;
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10**6;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start+CHUNK_SIZE,videoSize-1);

    const contentLength = end-start+1;
    const headers = {
        "Content-Range":`bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"video/webm",
    };
    res.writeHead(206,headers);

    const videoStream = fs.createReadStream(videoPath , {start,end});
    videoStream.pipe(res);
});

app.listen(3000, ()=>{
    console.log("started server");
})