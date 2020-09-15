document.addEventListener("DOMContentLoaded", function () {

    (function () {

        let bracketflock = function (p) {

            let birdFont, numFont, colors, rand,
                matrix, size, margin, mtrxWidth, mtrxHeight,
                x0, y0, xMargin0, xStep, yStep;

            let fillMatrix = function () {
                margin = {i1: 0, i2: 0, j1: 0, j2: 0};
                for (let i = margin.i1; i < mtrxWidth - margin.i2; i++) {
                    for (let j = margin.j2; j < mtrxHeight - margin.j2; j++) {
                        let dot = {
                            i: i, j: j,
                            // inverse
                            x: (x0 + i * xStep) - size.h / 2,
                            y: (y0 + j * yStep) - size.w / 2
                        };
                        matrix.push(dot);
                    }
                }
            };

            p.preload = function () {
                let element = document.getElementById("js-cont");
                // let elWidth = element.getAttribute("width").replace('px', '');
                // let elHeight = element.getAttribute("height").replace('px', '');
                element.style.cursor = 'pointer';
                size = {w: 910, h: 512};
                if (element.getAttribute("special") === "krc") {
                    size = {w: window.innerWidth, h: window.innerHeight};
                }
                rand = new AdvancedRandom();
                matrix = [];
                colors = [];
                let fontsPath = "/static/media/fonts/roboto/";
                let roboRegular = fontsPath + "RobotoMono-Regular.ttf",
                    roboBold = fontsPath + "RobotoMono-Bold.ttf";
                birdFont = p.loadFont(roboBold);
                numFont = p.loadFont(roboRegular);
            };

            p.setup = function () {
                let canvas = p.createCanvas(size.w, size.h);
                canvas.parent('js-cont');
                p.angleMode(p.DEGREES);
                // p.textFont('Roboto Mono');
                colors = ["#fccb4e", "#fccb4e", "#fccb4e", "#fccb4e",
                    "#b44c18", "#f3b82f", "#e26204",
                    "#ffffff", "#212121"];
                colorsBack = ["#fccb4e", "#fccb4e",
                    "#b44c18", "#b44c18",
                    "#f3b82f", "#e26204",
                    "#212121", "#212121", "#212121", "#212121"];
                fillMatrix();
                p.frameRate(2);
            };

            p.draw = function () {

                let factor = rand.getGaussianRandomInt(10, 100, 2);

                xStep = factor * 1.3;
                yStep = factor * 2;
                x0 = (factor >= 79) ? 10 + factor * 1.5 : 35 + factor * 1.5;
                y0 = factor * 1.2;
                xMargin0 = x0 * 0.9;
                mtrxWidth = (size.h - x0 - y0) / xStep;
                mtrxHeight = (size.w - 2 * y0) / yStep;
                fillMatrix();

                let flockSize = rand.getGaussianRandomInt(1, matrix.length * 0.7, 3);

                p.background(colorsBack[rand.getRandomInt(0, colorsBack.length - 1)]);
                p.translate(size.w / 2, size.h / 2);
                p.push();
                p.rotate(90);

                p.fill(colors[rand.getRandomInt(0, colors.length - 1)]);
                p.textFont(numFont);
                p.textSize(factor * 1.3);
                p.textAlign(p.RIGHT, p.CENTER);
                if (p.random() > 0.7) {
                    for (let i = 0; i < mtrxHeight; i++) {
                        let y = 5 + y0 + (i * yStep);
                        // inverse
                        p.text(i + 1, xMargin0 - size.h / 2, y - size.w / 2);
                    }
                }

                p.textFont(birdFont);
                p.textSize(factor * 1.3);
                p.textAlign(p.CENTER, p.CENTER);
                for (let i = 0; i < flockSize; i++) {
                    let pos;
                    do {
                        let ri = rand.gaussianRandomInt(margin.i1, mtrxWidth - margin.i2),
                            rj = rand.gaussianRandomInt(margin.j1, mtrxHeight - margin.j2);
                        pos = matrix.find(x => ((x.i === ri) & (x.j === rj)));
                    } while (!(pos));
                    let symb = (p.random() > 0.5) ? "{" : "}";
                    if (p.random() > 0.95) {
                        symb = (p.random() > 0.5) ? "." : "*";
                    }
                    p.fill(colors[rand.getRandomInt(0, colors.length - 1)]);
                    p.text(symb, pos.x, pos.y);
                    matrix.splice(matrix.indexOf(pos), 1);
                }
                matrix = [];
                p.pop();
            };

            // p.mouseClicked = function () {
            //     window.open("https://krcadinac.com", "_blank");
            // };

        };

        class AdvancedRandom {

            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            getRandomElement(list) {
                return list[this.getRandomInt(0, list.length - 1)];
            }

            getRandomProperty = function (obj) {
                let keys = Object.keys(obj);
                return obj[keys[keys.length * Math.random() << 0]];
            };

            getGaussianRandomInt(min, max, skew = 1) {
                let u = 0, v = 0;
                while (u === 0) u = Math.random();
                while (v === 0) v = Math.random();
                let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
                num = num / 10.0 + 0.5
                if (num > 1 || num < 0) num = randn_bm(min, max, skew);
                num = Math.pow(num, skew);
                num *= max - min;
                num += min;
                return Math.floor(num);
            }

            gaussianRand() {
                let rand = 0, n = 3;
                for (var i = 0; i < n; i += 1) {
                    rand += Math.random();
                }
                return rand / n;
            }

            gaussianRandomInt(start, end) {
                return Math.floor(start + this.gaussianRand() * (end - start + 1));
            }

        }

        new p5(bracketflock, 'nest');

    })();

});