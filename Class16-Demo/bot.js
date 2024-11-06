require("dotenv").config();

const m = require("masto");

const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.TOKEN,
});

async function makeStatus(text){
    const status = await masto.v1.statuses.create({
        status: text,
        visibility: "public",

    })
console.log(masto.url)
}

function multipleStatuses(){
    //external req
    let emojis = ["😂!" , "😅!", "😘!", "不发了!", "爱发奶龙的小朋友你们好呀!"];
    let rad = Math.floor(Math.random()*emojis.length)
    let post = emojis[rad]
    makeStatus(post)
}
setInterval(multipleStatuses, 900000)

makeStatus("爱发奶龙的小朋友你们好呀")
