
        var drawarea;
        var backgroundarea;
        var ctrlGridArea;
        var frontArea;
        var ctx;
        var backctx;
        var gridctx;
        var frontctx;
        var isdown = false;
        var isAdsorb = false;
        var rects = [];
        var oldHoldPointIndex;

        var maxWidth = 1000;
        var maxHeight = 600;

        var minWidth = 40;
        var minHeight = 40;
        var displayWidth = 1920;
        var displayHeight = 1080;
        var disw = 16;
        var dish = 9;
        var box;
        var currentRect = "";
        var currentRectIndex = -1;
        var dx,dy;
        var ctrlRectsWidth = 20;
        var holdPointIndex = -1;

        var info;

        var totalWidth,totalHeight, eachWidth, eachHeight,proportion, backProportion, eachGridWidth, eachGridHeight;

        var beginPoint = {};
        var oldRect = {};

        window.onload = function () {
            backgroundarea = document.getElementById("backgroundArea");
            ctrlGridArea = document.getElementById("ctrlGridArea");
            box = document.getElementById("box");
            info = document.getElementById("info");
            drawarea = document.getElementById("drawArea");
            frontArea = document.getElementById("frontArea");

            ctx = drawarea.getContext("2d");
            backctx = backgroundarea.getContext("2d");
            gridctx = ctrlGridArea.getContext("2d");
            frontctx = frontArea.getContext("2d");

            frontArea.onmouseup = mouseup;
            frontArea.ontouchend = mouseup;
            frontArea.onmousemove = mousemove;
            frontArea.ontouchmove = mousemove;
            frontArea.onmousedown = mousedown;
            frontArea.ontouchstart = mousedown;

            setBackRect();
            setGrid();
        };

        function calculateProportion(row, col) {
            proportion = disw*col/(dish*row);
            backProportion = maxWidth/maxHeight;
            if (proportion >= backProportion) {
                totalWidth = maxWidth;
                totalHeight = totalWidth / proportion;
            } else {
                totalHeight = maxHeight;
                totalWidth = totalHeight * proportion;
            }
            eachWidth = totalWidth / col;
            eachHeight = totalHeight /row;
        }

        function setGrid() {
            clearGrid();
            var gridrow = parseInt(document.getElementById("gridrow").value);
            var gridcol = parseInt(document.getElementById("gridcol").value);
            eachGridWidth = totalWidth / gridcol;
            eachGridHeight = totalHeight /gridrow;
            drawGrid(gridrow, gridcol);
            var checkgrid = document.getElementById("showgrid");
            checkgrid.checked = true;
        }

        function drawGrid(row, col) {
            gridctx.lineWidth = 1;
            gridctx.strokeStyle = "rgba(200,250,0, 1)";
            gridctx.beginPath();
            for (var i=0; i<=row; i++) {
                if (i == row) {
                    gridctx.dashedLineTo(-0.5,Math.floor(i*eachGridHeight)-0.5,Math.floor(totalWidth)-0.5, Math.floor(i*eachGridHeight)-0.5);
                } else {
                    gridctx.dashedLineTo(0.5,0.5+Math.floor(i*eachGridHeight), 0.5+Math.floor(totalWidth), 0.5+Math.floor(i*eachGridHeight));
                }
            }
            for (var i=0; i<=col; i++) {
                if (i == col) {
                    gridctx.dashedLineTo (Math.floor(i*eachGridWidth)-0.5, -0.5, Math.floor(i*eachGridWidth)-0.5, Math.floor(totalHeight)-0.5);
                } else {
                    gridctx.dashedLineTo (Math.floor(i*eachGridWidth)+0.5, 0.5, Math.floor(i*eachGridWidth)+0.5, 0.5+Math.floor(totalHeight));
                }
            }
            gridctx.stroke();
        }

        function clearGrid() {
            //gridctx.width = gridctx.width;
            gridctx.clearRect(0,0,totalWidth, totalHeight);
        }

        function setBackRect() {
            var row = parseInt(document.getElementById("row").value);
            var col = parseInt(document.getElementById("col").value);
            calculateProportion(row,col);
            drawBackRect(row, col);
            setGrid();
        }

        function drawBackRect(row, col) {
            backgroundarea.style.marginLeft = (-totalWidth/2)+"px";
            backgroundarea.style.marginTop = (-totalHeight/2)+"px";
            drawarea.style.marginLeft = (-totalWidth/2)+"px";
            drawarea.style.marginTop = (-totalHeight/2)+"px";
            ctrlGridArea.style.marginLeft = (-totalWidth/2)+"px";
            ctrlGridArea.style.marginTop = (-totalHeight/2)+"px";
            frontArea.style.marginLeft = (-totalWidth/2)+"px";
            frontArea.style.marginTop = (-totalHeight/2)+"px";

            backgroundarea.width = totalWidth;
            backgroundarea.height = totalHeight;
            drawarea.width = totalWidth;
            drawarea.height = totalHeight;
            ctrlGridArea.width = totalWidth;
            ctrlGridArea.height = totalHeight;
            frontArea.width = totalWidth;
            frontArea.height = totalHeight;

            //backctx.fillStyle = "#a1a2a3";
            backctx.fillStyle = "#1b6d85";
            backctx.fillRect(0,0,totalWidth, totalHeight);
            backctx.lineWidth = 1;
            backctx.beginPath();
            for (var i=0; i<=row; i++) {
                if (i == row) {
                    backctx.moveTo(-0.5,Math.floor(i*eachHeight)-0.5);
                    backctx.lineTo(Math.floor(totalWidth)-0.5, Math.floor(i*eachHeight)-0.5);
                } else {
                    backctx.moveTo(0.5,0.5+Math.floor(i*eachHeight));
                    backctx.lineTo(0.5+Math.floor(totalWidth), 0.5+Math.floor(i*eachHeight));
                }
            }
            for (var i=0; i<=col; i++) {
                if (i == col) {
                    backctx.moveTo(Math.floor(i*eachWidth)-0.5, -0.5);
                    backctx.lineTo(Math.floor(i*eachWidth)-0.5, Math.floor(totalHeight)-0.5);
                } else {
                    backctx.moveTo(Math.floor(i*eachWidth)+0.5, 0.5);
                    backctx.lineTo(Math.floor(i*eachWidth)+0.5, 0.5+Math.floor(totalHeight));
                }
            }
            backctx.stroke();
            rects = [];
            info.innerHTML = "";
        }

        function mathpixel(num) {
            return Math.floor(num)+0.5;
        }

        function test() {
            //drawAreaClear()
            ctx.clearRect(0,0,totalWidth, totalHeight);
            //alert(document.body.scrollTop);
        }

        function toFront() {
            if (currentRect != "") {
                rects.remove(currentRect);
                rects.push(currentRect);
                currentRectIndex = rects.length-1;
                drawRects();
            }
        }

        function toBack() {
            if (currentRect != "") {
                rects.remove(currentRect);
                rects.unshift(currentRect);
                currentRectIndex = 0;
                drawRects();
            }
        }

        function deleteWidget() {
            if (currentRectIndex >= 0) {
                rects.splice(currentRectIndex, 1);
                currentRectIndex = -1;
                currentRect = "";
                drawRects();
            }
        }

        function drawAreaClear() {
            drawarea.width = drawarea.width
        }

        function checkShowGrid () {
            var checkGrid = document.getElementById("showgrid");
            if (checkGrid.checked) {
                setGrid();
            } else {
                clearGrid();
            }
        }

        function checkAdsorb() {
            var checkAdsorb = document.getElementById("adsorb");
            if (checkAdsorb.checked) {
                isAdsorb = true;
            } else {
                isAdsorb = false;
            }
        }

        /*
         function getPointOnCanvas(canvas, x, y) {
         var bbox =canvas.getBoundingClientRect();
         return { x: x- bbox.left *(canvas.width / bbox.width),
         y:y - bbox.top  * (canvas.height / bbox.height)
         };
         }
         */


        function inCtrlRect(x, y, p) {
            if (x > p[0]-ctrlRectsWidth/2 && x < p[0]+ctrlRectsWidth/2 && y > p[1]-ctrlRectsWidth/2 && y < p[1]+ctrlRectsWidth/2) {
                return true;
            } else {
                return false;
            }
        }

        function getGridArray(x, y, w, h) {
            return [ [x, y], [x+w/2, y], [x+w, y], [x, y+h/2], [x+w, y+h/2], [x, y+h], [x+w/2, y+h], [x+w, y+h] ];
        }

        function inWhichCtrlRect(px, py) {
            holdPointIndex = -1;
            if (currentRectIndex == -1) {
                return -1;
            }
            var ctrlRects = getGridArray(currentRect.x, currentRect.y, currentRect.w, currentRect.h);

            for (var i in ctrlRects) {
                if (inCtrlRect(px, py, ctrlRects[i])) {
                    holdPointIndex = parseInt(i);
                    break;
                }
            }
            return holdPointIndex;
        }

        function drawRects() {
            ctx.clearRect(0,0,totalWidth, totalHeight);
            frontctx.clearRect(0,0,totalWidth, totalHeight);
            ctx.save();
            for (var i in rects) {
                var rect = rects[i];
                if (rect == currentRect) {
                    //ctx.fillStyle = "rgba(50,100,50, 0.5)";
                    ctx.fillStyle = "rgba(10,100,242, 0.4)";
                    ctx.strokeStyle = "rgba(0,255,0, 1)";
                } else {
                    ctx.fillStyle = "rgba(40,109,212, 0.8)";
                    ctx.strokeStyle = "rgba(0,50,0, 1)";
                }

                ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
                ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
                if (rect == currentRect) {
                    frontctx.beginPath();
                    frontctx.strokeStyle = "rgba(0,255,255,0.9)";
                    var ctrlRects = getGridArray(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
                    for (i in ctrlRects) {
                        if (holdPointIndex == parseInt(i)) {
                            frontctx.fillStyle = "rgba(0,255,255,0.9)";
                            frontctx.fillRect(ctrlRects[i][0]-ctrlRectsWidth/2, ctrlRects[i][1]-ctrlRectsWidth/2, ctrlRectsWidth, ctrlRectsWidth);
                        } else {
                        }
                        frontctx.strokeRect(ctrlRects[i][0]-ctrlRectsWidth/2, ctrlRects[i][1]-ctrlRectsWidth/2, ctrlRectsWidth, ctrlRectsWidth);
                    }
                    frontctx.closePath();
                }
            }
            ctx.restore();
        }


        function fixRange() {
            if (currentRect != "") {
                if (isAdsorb) {
                    if (currentRect.x < 0) {
                        currentRect.w -= -currentRect.x;
                        currentRect.x = 0;
                    }
                    if (currentRect.y < 0) {
                        currentRect.h -= -currentRect.y;
                        currentRect.y = 0;
                    }
                    if (currentRect.x+currentRect.w > totalWidth) {
                        currentRect.w = totalWidth - currentRect.x;
                    }
                    if (currentRect.y+currentRect.h > totalHeight) {
                        currentRect.h = totalHeight - currentRect.y;
                    }
                } else {
                    if (currentRect.x < 0) {
                        currentRect.x = 0;
                    }
                    if (currentRect.y < 0) {
                        currentRect.y = 0;
                    }
                    if (currentRect.x+currentRect.w > totalWidth) {
                        //currentRect.w = totalWidth - currentRect.x;
                        currentRect.x = totalWidth - currentRect.w;
                    }
                    if (currentRect.y+currentRect.h > totalHeight) {
                        //currentRect.h = totalHeight - currentRect.y;
                        currentRect.y = totalHeight - currentRect.h;
                    }
                }
            }
        }

        /*
        function fixSize() {
            if (currentRect != "") {
                if (isAdsorb) {
                    if (currentRect.w < eachGridWidth) {
                        currentRect.w = eachGridWidth;
                        currentRect.x -= eachGridWidth;
                    }
                    if (currentRect.h < eachGridHeight) {
                        currentRect.h = eachGridHeight;
                        currentRect.y -= eachGridHeight;
                    }
                }
            }
        }
        */


        function adsorb() {
            if (currentRect != "") {
                var adsorbX = getNearNum(currentRect.x, eachGridWidth);
                var adsorbY = getNearNum(currentRect.y, eachGridHeight);
                var adsorbX1 = getNearNum(currentRect.x+currentRect.w, eachGridWidth);
                var adsorbY1 = getNearNum(currentRect.y+currentRect.h, eachGridHeight);
                var newX = adsorbX;
                var newY = adsorbY;
                var newW = adsorbX1 - adsorbX;
                var newH = adsorbY1 - adsorbY;

                //alert(oldHoldPointIndex);
                if (newW < eachGridWidth) {
                    newW = eachGridWidth;
                    if (oldHoldPointIndex == 0 || oldHoldPointIndex == 3 || oldHoldPointIndex == 5) {
                        newX -= eachGridWidth;
                    }
                }

                if (newH < eachGridHeight) {
                    newH = eachGridHeight;
                    if (oldHoldPointIndex == 0 || oldHoldPointIndex == 1 || oldHoldPointIndex == 2) {
                        newY -= eachGridHeight;
                    }
                }

                currentRect.x = newX;
                currentRect.y = newY;
                currentRect.w = newW;
                currentRect.h = newH;
            }
        }

        function mousedown(e) {
            isdown = true;
            var point = getPointOnCanvas(drawarea, e);
            var x = point.x;
            var y = point.y;
            beginPoint.x = x;
            beginPoint.y = y;

            //ctx.moveTo(x,y);
            //ctx.beginPath();

            if (inWhichCtrlRect(x, y) < 0) {
                //alert("fdfs")
                var isHit = false;
                var i ;
                for (i=rects.length-1; i >= 0; i--) {
                    if (inRect(x, y, rects[i])) {
                        isHit = true;
                        break;
                    }
                }

                if (isHit) {
                    currentRect = rects[i];
                    currentRectIndex = i;
                } else {
                    var newRect = {x:x-eachWidth/2, y:y-eachHeight/2,w:eachWidth, h:eachHeight};
                    rects.push(newRect);
                    currentRect = newRect;
                    currentRectIndex = rects.length-1;
                    info.innerHTML = JSON.stringify(rects);
                }

                dx = x - currentRect.x;
                dy = y - currentRect.y;

            }

            if (currentRect != "") {
                oldRect.x = currentRect.x;
                oldRect.y = currentRect.y;
                oldRect.w = currentRect.w;
                oldRect.h = currentRect.h;
            }

            drawRects();
            return false;
        }
        function mousemove(e) {
            if (isdown) {
                var point = getPointOnCanvas(drawarea, e);
                var x = point.x;
                var y = point.y;

                var movex = x - beginPoint.x;
                var movey = y - beginPoint.y;

                if (currentRect != "") {
                    switch (holdPointIndex) {
                        case -1:
                            currentRect.x = x-dx;
                            currentRect.y = y-dy;
                            break;
                        case 0:
                            var newX = oldRect.x + movex;
                            var newW = oldRect.w - movex;
                            if (newW < minWidth) {
                                var fixW = minWidth - newW;
                                currentRect.w = minWidth;
                                currentRect.x = newX - fixW;
                            } else {
                                currentRect.x = newX;
                                currentRect.w = newW;
                            }

                            var newY = oldRect.y + movey;
                            var newH = oldRect.h - movey;
                            if (newH < minHeight) {
                                var fixH = minHeight - newH;
                                currentRect.h = minHeight;
                                currentRect.y = newY - fixH;
                            } else {
                                currentRect.y = newY;
                                currentRect.h = newH;
                            }
                            break;
                        case 1:
                            var newY = oldRect.y + movey;
                            var newH = oldRect.h - movey;
                            if (newH < minHeight) {
                                var fixH = minHeight - newH;
                                currentRect.h = minHeight;
                                currentRect.y = newY - fixH;
                            } else {
                                currentRect.y = newY;
                                currentRect.h = newH;
                            }
                            break;
                        case 2:
                            var newY = oldRect.y + movey;
                            var newH = oldRect.h - movey;
                            if (newH < minHeight) {
                                var fixH = minHeight - newH;
                                currentRect.h = minHeight;
                                currentRect.y = newY - fixH;
                            } else {
                                currentRect.y = newY;
                                currentRect.h = newH;
                            }
                            var newW = oldRect.w + movex;
                            currentRect.w = newW > minWidth ? newW : minWidth;
                            break;
                        case 3:
                            var newX = oldRect.x + movex;
                            var newW = oldRect.w - movex;
                            if (newW < minWidth) {
                                var fixW = minWidth - newW;
                                currentRect.w = minWidth;
                                currentRect.x = newX - fixW;
                            } else {
                                currentRect.x = newX;
                                currentRect.w = newW;
                            }
                            break;
                        case 4:
                            var newW = oldRect.w + movex;
                            currentRect.w = newW > minWidth ? newW : minWidth;
                            break;
                        case 5:
                            var newX = oldRect.x + movex;
                            var newW = oldRect.w - movex;
                            if (newW < minWidth) {
                                var fixW = minWidth - newW;
                                currentRect.w = minWidth;
                                currentRect.x = newX - fixW;
                            } else {
                                currentRect.x = newX;
                                currentRect.w = newW;
                            }
                            var newH = oldRect.h + movey;
                            currentRect.h = newH > minHeight ? newH : minHeight;
                            break;
                        case 6:
                            var newH = oldRect.h + movey;
                            currentRect.h = newH > minHeight ? newH : minHeight;
                            break;
                        case 7:
                            var newW = oldRect.w + movex;
                            currentRect.w = newW > minWidth ? newW : minWidth;
                            var newH = oldRect.h + movey;
                            currentRect.h = newH > minHeight ? newH : minHeight;
                            break;
                        default:
                            console.log("error");
                    }
                }
                drawRects();
                return false;
            }
        }

        function mouseup(e) {
            isdown = false;
            oldHoldPointIndex = holdPointIndex;
            holdPointIndex = -1;
            drawRects();
            fixRange();
            if (isAdsorb) {
                adsorb();
            }
            drawRects();
            return false;
        }

