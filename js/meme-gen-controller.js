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
    document.querySelector('.canvas-container').classList.add('shown');
    document.querySelector('.main-footer-meme').classList.add('shown');
    document.querySelector('.gallery').classList.add('hide');
    document.querySelector('.main-nav').classList.add('hide');
    document.querySelector('.search-bar').classList.add('hide');
    document.querySelector('.page-scroller').classList.add('hide');
    document.querySelector('.personal-sec').classList.add('hide');
    document.querySelector('.main-footer').classList.add('hide');

    gCurrImg = getImgById(imgId);
    getMeme(imgId);
    //drawing the meme image to its place
    drawImg(gCurrImg.url, drawText)
}

function onBackToGallery() {
    document.querySelector('.canvas-container').classList.remove('shown');
    document.querySelector('.main-footer-meme').classList.remove('shown');
    document.querySelector('.gallery').classList.remove('hide');
    document.querySelector('.main-nav').classList.remove('hide');
    document.querySelector('.search-bar').classList.remove('hide');
    document.querySelector('.page-scroller').classList.remove('hide');
    document.querySelector('.personal-sec').classList.remove('hide');
    document.querySelector('.main-footer').classList.remove('hide');
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
    for (var i = 0; i < gMeme['lines'].length; i++) {
        var memeLineProperties = gMeme['lines'][i];
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
}


// MEME CHANGES

function onTxtToAdd(txt) {
    setMemeLine(txt)
    drawImg(gCurrImg.url, drawText)
}

function onChangeFontSize(diff) {
    gMeme['lines'][gMeme.selectedLineIdx]['size'] += diff;
    drawImg(gCurrImg.url, drawText)
}

function onChangeTxtPos(diff) {
    // <!-- bigger Y is down -->
    gMeme['lines'][gMeme.selectedLineIdx]['coord'].y += diff;
    drawImg(gCurrImg.url, drawText);
}

function onAddLine() {
    document.querySelector('.meme-txt').value = ''; // clear the input place holder
    createLine()
    drawImg(gCurrImg.url, drawText);
}

// PAGE SCROLLER

function onPageScrollBtn(diff) {
    var scrollBtnToDisp = changePage(diff)
    renderGallery();

    // show\hide to scroll btn if first\last page
    if (!scrollBtnToDisp.prev) {
        document.querySelector('.page-prev-scroll-btn').classList.remove('shown');
        document.querySelector('.page-prev-scroll-btn').classList.add('hide');
    } else {
        document.querySelector('.page-prev-scroll-btn').classList.remove('hide');
        document.querySelector('.page-prev-scroll-btn').classList.add('shown');
    }
    if (!scrollBtnToDisp.next) {
        document.querySelector('.page-next-scroll-btn').classList.add('hide');
        document.querySelector('.page-next-scroll-btn').classList.remove('shown');
    } else {
        document.querySelector('.page-next-scroll-btn').classList.add('shown');
        document.querySelector('.page-next-scroll-btn').classList.remove('hide');
    }
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