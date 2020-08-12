'use strict';

var gImgs;
var gMeme;
var gKeywords;
var gId = 1;
var gMeme;
var gCurrImg;


var defaultImgs = [
    {
        url: 'img/meme-imgs (square)/1.jpg',
        keywords: ['Trump, angry, speech']
    },
    {
        url: 'img/meme-imgs (square)/2.jpg',
        keywords: ['dogs, kiss']
    },
    {
        url: 'img/meme-imgs (square)/3.jpg',
        keywords: ['baby, dog, sleep']
    },
    {
        url: 'img/meme-imgs (square)/4.jpg',
        keywords: ['cat, computer, sleep']
    },
    {
        url: 'img/meme-imgs (square)/5.jpg',
        keywords: ['baby, beach, success']
    },
    {
        url: 'img/meme-imgs (square)/6.jpg',
        keywords: ['man, explanation, satisfied']
    },
    
]

gImgs = createImgs(defaultImgs);



function getImgs() {
    return gImgs;
}
function getMeme(imgId) {
    var meme = creatMeme(imgId);
    gMeme = meme;
    return meme;
}


function getImgById(imgId) {
    var image = gImgs.find(image => {
        return image.id === imgId;
    })
    gCurrImg = image;
    return gCurrImg;
}

function creatMeme(imgId) {
    var meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Your Text',
                size: 20,
                align: 'left',
                'fill-color': 'white',
                'strok-color': 'red',
                coord: { x: 200, y: 40 }
            }
        ]
    }
    return meme;
}

function createImgs(defaultImgs) {
    var imgs = defaultImgs.map(image => {
        return createImg(image)
    })
    gImgs = imgs;
    return gImgs;
}

function createImg(image) {
    var currImg = {
        id: gId++,
        url: image.url,
        keywords: image.keywords
    }
    return currImg;
}

function setMemeLine(line) {
    gMeme.lines[gMeme.selectedLineIdx].txt = line;
}

function createLine() {
    // var yCoord = gMeme.lines[gMeme.selectedLineIdx].coord.y + 40;
    gMeme.selectedLineIdx++;
    var line = {
        txt: 'Your Text',
        size: 20,
        align: 'left',
        'fill-color': 'white',
        'strok-color': 'red',
        coord: { x: 200, y: 440 }
    }

    gMeme.lines.push(line);
    console.log(gMeme);
}

