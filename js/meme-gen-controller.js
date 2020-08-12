'use strict';

var gCanvas = document.getElementById('myCanvas');
var gCtx = gCanvas.getContext('2d');

function init() {
    renderGallery()
}

function renderGallery() {
    var images = getImgs();

    var strHTML = images.map(image => {
        return `<img src="${image.url}" onclick="onImgClick(${image.id})" alt="">`
    })
    document.querySelector('.gallery').innerHTML = strHTML.join('');
}

function onImgClick(imgId) {
    // shownig the canvas and hiding the gallery    
    document.querySelector('.canvas-container').classList.add('shown')
    document.querySelector('.gallery').classList.add('hidden');
    
    gCurrImg = getImgById(imgId);
    getMeme(imgId);
    //drawing the meme image to its place
    drawImg(gCurrImg.url, drawText)
}

async function drawImg(imgUrl, func) {
    const img = new Image();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        func();
    }
    img.src = imgUrl;
}

function drawText() {
    var memeLineProperties = gMeme['lines'][0];
    var x = memeLineProperties.coord.x;
    var y = memeLineProperties.coord.y;
    var text = memeLineProperties['txt'];
    var fontStr = memeLineProperties['size'] + 'px Impact';
    gCtx.lineWidth = '1';
    gCtx.strokeStyle = memeLineProperties['strok-color'];;
    gCtx.fillStyle = memeLineProperties['fill-color'];
    gCtx.font = fontStr;
    gCtx.textAlign = memeLineProperties['align'];
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function onTxtToAdd(ev) {
    var memeTxt = document.querySelector('.meme-txt').value;
    var charToAdd = ev.key;
    if (charToAdd.length > 1 && charToAdd !== 'Backspace') {
        return
    } else if (charToAdd === 'Backspace') {
        memeTxt = memeTxt.substring(0, memeTxt.length - 1);
    } else {
        memeTxt += ev.key;
    }
    setMemeLine(memeTxt)
    drawImg(gCurrImg.url, drawText)

}


// window.addEventListener('resize', function(){
//     // gCanvas.width = window.innerWidth;
//     // gCanvas.height = window.innerHeight;
//     resizeCanvas()
// })

// function resizeCanvas() {
//     const elContainer = document.querySelector('.canvas-container');
//     // Note: changing the canvas dimension this way clears the canvas
//     gCanvas.width = elContainer.offsetWidth;
//     gCanvas.height = elContainer.offsetHeight;
// }