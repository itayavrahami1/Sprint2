'use strict';

var gCanvas = document.getElementById('myCanvas');
var gCtx = gCanvas.getContext('2d');
var isOpen = false;
var isMemeEdit = false;

function init() {
    renderGallery();
    initCanvasSize();
    window.addEventListener('resize', function () {
        _resizeCanvas()
    })
}

function renderGallery() {
    var images = getImgs();

    var strHTML = images.map(image => {
        return `<img src="${image.url}" onclick="onImgClick(${image.id})" alt="">`
    })
    document.querySelector('.gallery').innerHTML = strHTML.join('');
}

function onImgClick(imgId) {
    isMemeEdit = true;
    // shownig the canvas and hiding the gallery    
    document.querySelector('.canvas-container').classList.add('shown');
    document.querySelector('.main-footer-meme').classList.add('shown');
    // document.querySelector('.meme-screen').classList.add('shown');
    document.querySelector('.gallery').classList.add('hide'); // hide
    document.querySelector('.main-gallery').classList.add('minimize'); // take the space off the 'body' no scroll
    document.querySelector('.main-nav').classList.add('hide');
    document.querySelector('.search-bar').classList.add('hide');
    document.querySelector('.page-scroller').classList.add('hide');
    document.querySelector('.personal-sec').classList.add('hide');
    document.querySelector('.main-footer').classList.add('hide');
    document.querySelector('.screen').style.display = 'none';


    gCurrImg = getImgById(imgId);
    getMeme(imgId);
    _getTextRectRegion(gMeme)
    //drawing the meme image to its place
    drawImg(gCurrImg.url, drawText)
}

function onBackToGallery() {
    isMemeEdit = false;
    document.querySelector('.canvas-container').classList.remove('shown');
    document.querySelector('.main-footer-meme').classList.remove('shown');
    document.querySelector('.meme-screen').classList.add('hide');
    document.querySelector('.gallery').classList.remove('hide');
    document.querySelector('.main-gallery').classList.remove('minimize');
    document.querySelector('.main-nav').classList.remove('hide');
    document.querySelector('.search-bar').classList.remove('hide');
    document.querySelector('.page-scroller').classList.remove('hide');
    document.querySelector('.personal-sec').classList.remove('hide');
    document.querySelector('.main-footer').classList.remove('hide');
    document.querySelector('.screen').classList.remove('hide');
    document.querySelector('.screen').style.display = 'block';
}

function drawImg(imgUrl, func) {
    // clearCanvas()
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
        gCtx.strokeStyle = memeLineProperties['strok-color'];
        gCtx.fillStyle = memeLineProperties['fill-color'];
        gCtx.font = fontStr;
        gCtx.textAlign = memeLineProperties['align'];
        gCtx.fillText(text, x, y);
        gCtx.strokeText(text, x, y);
        if (i === gMeme['selectedLineIdx']) {
            var rectWidth = (memeLineProperties['textRectRegion'].finX - memeLineProperties['textRectRegion'].initX);
            var rectHeight = (memeLineProperties['textRectRegion'].finY - memeLineProperties['textRectRegion'].initY);
            gCtx.strokeRect(memeLineProperties['textRectRegion'].initX, memeLineProperties['textRectRegion'].initY, rectWidth, rectHeight);
        }
    }
}

// MEME CHANGES

function onTxtToAdd(txt) {
    setMemeLine(txt)
    var rectRegion = _getTextRectRegion(gMeme);
    gMeme['lines'][gMeme.selectedLineIdx].textRectRegion = rectRegion;
    drawImg(gCurrImg.url, drawText)
}

function onChangeFontSize(diff) {
    gMeme['lines'][gMeme.selectedLineIdx]['size'] += diff;
    var rectRegion = _getTextRectRegion(gMeme);
    gMeme['lines'][gMeme.selectedLineIdx].textRectRegion = rectRegion;
    drawImg(gCurrImg.url, drawText)
}

function onChangeTxtPos(diff) {
    // <!-- bigger Y is down -->
    gMeme['lines'][gMeme.selectedLineIdx]['coord'].y += diff;
    var rectRegion = _getTextRectRegion(gMeme);
    gMeme['lines'][gMeme.selectedLineIdx].textRectRegion = rectRegion;
    drawImg(gCurrImg.url, drawText);
}

function onAddLine() {
    document.querySelector('.meme-txt').value = ''; // clear the input place holder
    if (gMeme['lines'].length === 1) {
        createLine()
    } else {
        var currLine = (gMeme.selectedLineIdx === 0) ? 1 : 0;
        gMeme.selectedLineIdx = currLine;
    }
    var rectRegion = _getTextRectRegion(gMeme);
    gMeme['lines'][gMeme.selectedLineIdx].textRectRegion = rectRegion;
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

function onRemoveLine() {
    removeLine();
    drawImg(gCurrImg.url, drawText);
}

function canvasClicked(ev) {
    checkIfLine(ev);
    drawImg(gCurrImg.url, drawText);
}

function onMoveText(ev) {
    if (!ev.buttons) return;
    updateTextCoord(ev);
    drawImg(gCurrImg.url, drawText);
}

function onAlignTxt(alignTo) {
    updateLineAlign(alignTo)
    drawImg(gCurrImg.url, drawText);
}

// MOBILE MENU

function toggleMenu() {
    isOpen = !isOpen;
    var elMenuBtns = document.querySelectorAll('.menu-btn');
    var btnIdx = (isMemeEdit) ? 1 : 0;
    var menuSign = (isOpen) ? 'X' : '☰';
    document.body.classList.toggle('menu-open');
    elMenuBtns[btnIdx].innerText = menuSign;
}

function _resizeCanvas() {
    if (!gMeme) return;
    if (window.innerWidth < 740 && window.innerWidth > 550 && gCanvas.width != 400) {
        gCanvas.width = 400;
        gCanvas.height = 400;
        drawImg(gCurrImg.url, drawText);
    } else if (window.innerWidth < 550 && gCanvas.width != 300) {
        console.log('it');
        gCanvas.width = 300;
        gCanvas.height = 300;
        drawImg(gCurrImg.url, drawText);
    } else if (window.innerWidth > 740 && gCanvas.width != 500) {
        gCanvas.width = 500;
        gCanvas.height = 500;
        drawImg(gCurrImg.url, drawText);
    }
}

function initCanvasSize() {
    if (window.innerWidth > 740) {
        gCanvas.width = 500;
        gCanvas.height = 500;
    } else if (window.innerWidth < 740 && window.innerWidth > 550) {
        gCanvas.width = 400;
        gCanvas.height = 400;
    } else if (window.innerWidth < 550) {
        gCanvas.width = 300;
        gCanvas.height = 300;
    }
}