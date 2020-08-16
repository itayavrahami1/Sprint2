'use strict';

var gImgs;
var gMeme;
var gKeywords;
var gId = 1;
var gMeme;
var gCurrImg;
var gPageSize = 9; // might change with responsivity
var gPageIdx = 0;
var gSum = 0;
var gPrevMouseMoveEv;
var gMapKeyword;



var defaultImgs = [
    {
        url: 'img/meme-imgs (square)/1.jpg',
        keywords: ['Trump', 'angry', 'speech']
    },
    {
        url: 'img/meme-imgs (square)/2.jpg',
        keywords: ['dogs', 'kiss']
    },
    {
        url: 'img/meme-imgs (square)/3.jpg',
        keywords: ['baby', 'dog', 'sleep']
    },
    {
        url: 'img/meme-imgs (square)/4.jpg',
        keywords: ['cat', 'computer', 'sleep']
    },
    {
        url: 'img/meme-imgs (square)/5.jpg',
        keywords: ['baby', 'beach', 'success']
    },
    {
        url: 'img/meme-imgs (square)/6.jpg',
        keywords: ['man', 'explanation', 'satisfied']
    },
    {
        url: 'img/meme-imgs (square)/7.jpg',
        keywords: ['baby', 'eyes', 'surprised']
    },
    {
        url: 'img/meme-imgs (square)/8.jpg',
        keywords: ['man', 'magician', 'interesting']
    },
    {
        url: 'img/meme-imgs (square)/9.jpg',
        keywords: ['baby', 'laugh', 'nature']
    },
    {
        url: 'img/meme-imgs (square)/10.jpg',
        keywords: ['obama', 'laugh']
    },
    {
        url: 'img/meme-imgs (square)/11.jpg',
        keywords: ['fight', 'romance', 'nba']
    }
]

gImgs = createImgs(defaultImgs);

function getImgs() {
    var startIdx = gPageSize * gPageIdx;
    return gImgs.slice(startIdx, startIdx + gPageSize);
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
                size: 30,
                align: 'center',
                'fill-color': '#ffffff',
                'stroke-color': '#000000',
                coord: { x: gCanvas.width / 2, y: 50 },
                textRectRegion: null,
                isClicked: true
            }
        ]
    }
    var rectRegion = _getTextRectRegion(meme);
    meme['lines'][0].textRectRegion = rectRegion;

    gMeme = meme;
    return meme;
}

function createImgs(defaultImgs) {
    var imgs = defaultImgs.map(image => {
        return createImg(image)
    })


    gImgs = imgs;
    // an array of all the keywords
    var allKeywords = gImgs.reduce(function (acc, image) {
        acc.push(...image['keywords']);
        return acc;
    }, [])

    // maped array of all the keywords and their appearences
    gMapKeyword = allKeywords.reduce(function (acc, keyword) {
        if (!acc[keyword]) acc[keyword] = 0;
        acc[keyword]++
        return acc;
    }, {})

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
    _getTextRectRegion(gMeme);

}

function createLine() {
    gMeme.selectedLineIdx = gMeme['lines'].length;
    var yCoord = (gMeme['lines'].length >= 2) ? (gCanvas.height / 2) : (gCanvas.height - 30)
    var line = {
        txt: 'Your Text',
        size: 30,
        align: 'center',
        'fill-color': '#ffffff',
        'stroke-color': '#000000',
        textRectRegion: null,
        coord: { x: gCanvas.width / 2, y: yCoord},
        isClicked: true
    }

    gMeme.lines.push(line);
    var rectRegion = _getTextRectRegion(gMeme);
    gMeme['lines'][gMeme.selectedLineIdx].textRectRegion = rectRegion;
}

function changePage(diff) {
    var scrollBtnToDisp = {}; // if is the first\last page won't show the prev\next btn
    var pageCount = Math.ceil(gImgs.length / gPageSize - 1);
    var newPageIdx = gPageIdx + diff;
    gPageIdx = newPageIdx;
    if (newPageIdx > 0 && newPageIdx < pageCount) {
        scrollBtnToDisp = { prev: true, next: true };
        return scrollBtnToDisp;
    } else if (newPageIdx === 0) {
        scrollBtnToDisp = { prev: false, next: true };
        return scrollBtnToDisp;
    } else if (newPageIdx === pageCount) {
        scrollBtnToDisp = { prev: true, next: false };
        return scrollBtnToDisp;
    }

}

function removeLine() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme['lines'].splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = -1;
}

function checkIfLine(ev) {
    var clickX = ev.offsetX;
    var clickY = ev.offsetY;

    var lineIdx = gMeme['lines'].findIndex(line => {
        return line.textRectRegion.initX < clickX && line.textRectRegion.finX > clickX
            && line.textRectRegion.initY < clickY && line.textRectRegion.finY > clickY
    })

    gMeme.lines.forEach(line => {
        line.isClicked = false;
    })

    if (lineIdx !== -1) {
        gMeme['lines'][lineIdx].isClicked = true;
        gMeme.selectedLineIdx = lineIdx;
    } else {
        gMeme.selectedLineIdx = lineIdx;
    }
}

function updateLineAlign(alignTo) {
    var currLine = gMeme['lines'][gMeme.selectedLineIdx];
    currLine['align'] = alignTo;
    var rectRegion = _getTextRectRegion(gMeme);
    gMeme['lines'][gMeme.selectedLineIdx].textRectRegion = rectRegion;
}

function _getTextRectRegion(meme) {

    var memeForRegionCalc = meme['lines'][meme.selectedLineIdx];
    var coordAlignCorrection;

    switch (memeForRegionCalc.align) {
        case 'right':
            coordAlignCorrection = -gCtx.measureText(memeForRegionCalc.txt).width;
            break;
        case 'center':
            coordAlignCorrection = -gCtx.measureText(memeForRegionCalc.txt).width / 2;
            break;
        case 'left':
            coordAlignCorrection = 0;
            break;
        default:
            break;
    }

    var x = memeForRegionCalc.coord.x + coordAlignCorrection;
    var y = memeForRegionCalc.coord.y;
    var fontSize = memeForRegionCalc.size;
    var lineTxt = memeForRegionCalc.txt;

    var rectCoord = {
        initX: x - 30,
        initY: y - 1.5 * fontSize,
        finX: x + gCtx.measureText(lineTxt).width + 30,
        finY: y + fontSize / 2
    }
    return rectCoord;
}

function _getLineIdx() {
    return gMeme.selectedLineIdx;
}


function updateTextCoord(ev) {


    if (gMeme.selectedLineIdx === -1) return;
    // init for the first movemenet
    if (!gPrevMouseMoveEv) {
        gPrevMouseMoveEv = {
            x: ev.offsetX,
            y: ev.offsetY
        }
    }

    var movementX = ev.offsetX - gPrevMouseMoveEv.x;
    var movementY = ev.offsetY - gPrevMouseMoveEv.y;

    gMeme.lines[gMeme.selectedLineIdx].coord.x += movementX;
    gMeme.lines[gMeme.selectedLineIdx].coord.y += movementY;

    var rectRegion = _getTextRectRegion(gMeme);
    gMeme['lines'][gMeme.selectedLineIdx].textRectRegion = rectRegion;

    gPrevMouseMoveEv.x = ev.offsetX;
    gPrevMouseMoveEv.y = ev.offsetY;

}

function updateTextColor(propToCahnge,color){
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx][propToCahnge] = color;
}

// function findCommonKeywords(){

// }