//lkjlkj
//App ideas - 
//Welcome Page
// Mixing colors, typing in colors up to three it will display the mix of the colors?
// search up colors, give colors names
//display colors in a cool way
//maybe display all colors in a rainbow/color pallete
//gsap api will help me vizulation  of colors, whether that be transititons or other cool stuffs


import readline from 'readline';
import fs from 'fs';
import express from 'express';
const app = express();
import path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://bilalsuleman0716:rI177r4uAQw1SirZ@project5.hy7nq.mongodb.net/?retryWrites=true&w=majority&appName=Project5"
const databaseAndCollection = {db: "CMSC335_DB", collection:"Colorize"};
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

//import("dotenv").config({ path: path.resolve(__dirname, '/.env') }) 

app.use(express.urlencoded({ extended: true }));


const client = new MongoClient(uri, {serverApi: ServerApiVersion.v1 });
async function main() {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

app.get("/", (req, res) => {
    let ans = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    html{
        background-color: pink;
    }
    .submitColors {
        display: flex; 
        justify-content: center; 
        align-items: center;    
        padding: 20px;
    }
    </style>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>COLORIZE</title>
    </head>
        <div class="topnav" style="text-align: center; background-color: pink; display: flex; align-items: center; justify-content: space-around; padding: 10px;">
        <a class="active" href="/" style="font-size: 30px; color: white; text-decoration: none;"> Home </a>
        <a href="/ColorPallete" style="font-size: 30px; color: white; text-decoration: none;"> Color Pallete </a>
        <h1 style="font-size: 40px; color: black; text-align: center; margin: 0;">Colorize</h1>
        <a href="/ColorWheel" style="font-size: 30px; color: white; text-decoration: none;"> Color Wheel </a>
        </div>
    <body>
        <h2 style = "text-align: center;">Select your colors:</h2> 
        <div id="cDis" style=" width: 250px; height: 250px; margin: 0 auto 20px auto; border: 2px solid black; background-color: white;">
    </div>

    <form action="/ColorPallete" method="POST" style="display: flex; flex-direction: column; align-items: center;">
    <div style="display: flex; justify-content: center; gap: 20px;">
        <div>
            <label for="c1">Color #1</label><br>
            <input type="color" id="c1" name="c1" value="#ff0000">
        </div>
        <div>
            <label for="c2">Color #2</label><br>
            <input type="color" id="c2" name="c2" value="#00ff00">
        </div>
        <div>
            <label for="c3">Color #3</label><br>
            <input type="color" id="c3" name="c3" value="#0000ff">
        </div>
    </div>
    
    <div class="submitColors">
    <input type="text" id="colName" name="colName" value="">
        <button type="submit">Submit Colors</button>
    </div>
</form>

    </body>
    <script>
        const col1 = document.getElementById('c1');
        const col2 = document.getElementById('c2');
        const col3 = document.getElementById('c3');
        const colDis = document.getElementById('cDis');

        
        function mixColors() {
            const rgb1 = hexToRgb(col1.value);
            const rgb2 = hexToRgb(col2.value);
            const rgb3 = hexToRgb(col3.value);

            const mixedRgb = {
                r: Math.round((rgb1.r + rgb2.r + rgb3.r) / 3),
                g: Math.round((rgb1.g + rgb2.g + rgb3.g) / 3),
                b: Math.round((rgb1.b + rgb2.b + rgb3.b) / 3)
            };

        colDis.style.backgroundColor = 'rgb(' + mixedRgb.r + ', ' + mixedRgb.g + ', ' + mixedRgb.b + ')'; 
        }

        function hexToRgb(hex) {
            let r = parseInt(hex.substring(1, 3), 16);
            let g = parseInt(hex.substring(3, 5), 16);
            let b = parseInt(hex.substring(5, 7), 16);
            return { r, g, b };
        }

        col1.addEventListener('input', mixColors);
        col2.addEventListener('input', mixColors);
        col3.addEventListener('input', mixColors);

        mixColors();
        </script>
    </body>
    </html>`;
    res.send(ans);
});

app.post("/ColorPallete", async (req, res) => {
    const {c1, c2, c3, colName} = req.body;
    const MongoColor = mixColors2(c1, c2, c3)
    const item = {
        colName,
        MongoColor
    }

    //console.log(item)

    const result = await insertItem(client, databaseAndCollection, item);
    //console.log(result)


    function mixColors2(c1, c2, c3) {
        const rgb1 = hexToRgb(c1);
        const rgb2 = hexToRgb(c2);
        const rgb3 = hexToRgb(c3);

        const mixedRgb2 = {
            r: Math.round((rgb1.r + rgb2.r + rgb3.r) / 3),
            g: Math.round((rgb1.g + rgb2.g + rgb3.g) / 3),
            b: Math.round((rgb1.b + rgb2.b + rgb3.b) / 3)
        };
        return rgbToHex(mixedRgb2.r, mixedRgb2.g, mixedRgb2.b);
    }

    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }
    
    function mixColors(color1, color2) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        const mixedRgb = {
            r: Math.round(((rgb1.r*0.75) + (rgb2.r *0.25))),
            g: Math.round(((rgb1.g*0.75) + (rgb2.g *0.25))),
            b: Math.round(((rgb1.b*0.75) + (rgb2.b *0.25))),
        };  

        return `#${
            Math.round(mixedRgb.r).toString(16).padStart(2, '0') +
            Math.round(mixedRgb.g).toString(16).padStart(2, '0') +
            Math.round(mixedRgb.b).toString(16).padStart(2, '0')
        }`;
    }

    function rgbToHex(r, g, b) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    const mixc1 = mixColors(c1, c2);
    const mixc2 = mixColors(c2, c1);
    const mixc3 = mixColors(c2, c3);
    const mixc4 = mixColors(c3, c2);


    let ans = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Color Wheel - Colorize</title>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
        <style>
            html {
                background-color: pink;
            }
            .color-display {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
            }
            .color-box {
                width: 200px;
                height: 200px;
                border: 2px solid black;
                margin: 0 10px;
            }
        </style>
    </head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COLORIZE</title>
</head>
    <div class="topnav" style="text-align: center; background-color: pink; display: flex; align-items: center; justify-content: space-around; padding: 10px;">
    <a class="active" href="/" style="font-size: 30px; color: white; text-decoration: none;"> Home </a>
    <a href="/ColorPallete" style="font-size: 30px; color: white; text-decoration: none;"> Color Pallete </a>
    <h1 style="font-size: 40px; color: black; text-align: center; margin: 0;">Colorize</h1>
    <a href="/ColorWheel" style="font-size: 30px; color: white; text-decoration: none;"> Color Wheel </a>
    </div>
<body>

        <div class="color-display">
            <div class="color-box" style="background-color: ${c1}"></div>
            <div class="color-box" style="background-color: ${mixc1}"></div>
            <div class="color-box" style="background-color: ${mixc2}"></div>
            <div class="color-box" style="background-color: ${c2}"></div>
            <div class="color-box" style="background-color: ${mixc3}"></div>
            <div class="color-box" style="background-color: ${mixc4}"></div>
            <div class="color-box" style="background-color: ${c3}"></div>
        </div>

        <h2 style = "text-align: center; ">${colName}'s Color Pallete</h2>
        <script>
    
        gsap.from('.topnav', { duration: 5, y: '-100%', ease: 'power2' });
    
        </script>


    <script>
    function mixColors(color1, color2) {
        const rgb1 = hexToRgb(color1.value);
        const rgb2 = hexToRgb(color2.value);
        
        const mixedRgb = {
        r: Math.round(((rgb1.r *1.25) + rgb2.r) / 2),
        g: Math.round(((rgb1.g *1.25) + rgb2.g) / 2),
        b: Math.round(((rgb1.b *1.25) + rgb2.b) / 2)
        };  
    }

    function hexToRgb(hex) {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        return { r, g, b };
    }
    </script>

    </body>
    </html>`;
    res.send(ans);
});


app.get("/ColorWheel", async (req, res) => {

    const db = client.db(databaseAndCollection.db);
    const collection = db.collection(databaseAndCollection.collection);
    const items = await collection.find({}).toArray();

    let colorBoxes = "";
    items.forEach(item => {
        colorBoxes += `
            <div class="color-box" style="background-color: ${item.MongoColor}">
                <p style="text-align: center; color: white; text-shadow: 1px 1px 2px black;">${item.colName}</p>
            </div>`;
    });

    let ans = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    html{
        background-color: pink;
    }
    .submitColors {
        display: flex; 
        justify-content: center; 
        align-items: center;    
        padding: 20px;
    }
    .color-box {
        width: 200px;
        height: 200px;
        border: 2px solid black;
        margin: 0 10px;
    }
    .color-display {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
    </style>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

</head>
    <div class="topnav" style="text-align: center; background-color: pink; display: flex; align-items: center; justify-content: space-around; padding: 10px;">
    <a class="active" href="/" style="font-size: 30px; color: white; text-decoration: none;"> Home </a>
    <a href="/ColorPallete" style="font-size: 30px; color: white; text-decoration: none;"> Color Pallete </a>
    <h1 style="font-size: 40px; color: black; text-align: center; margin: 0;">Colorize</h1>
    <a href="/ColorWheel" style="font-size: 30px; color: white; text-decoration: none;"> Color Wheel </a>
    </div>
<body>

        <h2 style="text-align: center; margin-top: 20px;">Color Wheel</h2>
            <div class="color-display">
                ${colorBoxes}
            </div>

    <div style="display: flex; justify-content: center; align-items: center;">
    <form action="/ColorWheel" method="POST">
        <button type="submit" id="deleteButton" style="margin: 20px; font-size: 16px; text-align: center;">Delete All Colors</button>
    </form>
    </div>
   <script>
   
    <body>


    <script>
    let t1 = gsap.timeline();
    t1.from(".color-display", {xPercent:-100})
        .from(".colorBoxes", {xPercent:200});

    gsap.from('.topnav', { duration: 5, y: '-100%', ease: 'bounce' });

    </script>

    </body>
    </html>
    `;
    res.send(ans);
});


app.post("/ColorWheel", async (req, res) =>{
    const result = await client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .deleteMany({});
    res.redirect("/ColorWheel");

});


app.get("/Search", async (req, res) => {
    let ans = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    html{
        background-color: pink;
    }
    .color-box {
        width: 200px;
        height: 200px;
        border: 2px solid black;
        margin: 0 10px;
    }
    </style>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>COLORIZE</title>
    </head>
        <div class="topnav" style="text-align: center; background-color: pink; display: flex; align-items: center; justify-content: space-around; padding: 10px;">
        <a class="active" href="/" style="font-size: 30px; color: white; text-decoration: none;"> Home </a>
        <a href="/ColorPallete" style="font-size: 30px; color: white; text-decoration: none;"> Color Pallete </a>
        <h1 style="font-size: 40px; color: black; text-align: center; margin: 0;">Colorize</h1>
        <a href="/ColorWheel" style="font-size: 30px; color: white; text-decoration: none;"> Color Wheel </a>
        <a href="/Search" style="font-size: 30px; color: white; text-decoration: none;"> Search </a>
        </div>
    <body>
    <h1> Search</h1>
    <input type="text" id="SearchName" name="searchName" style = "text-align: center; ">

    </body>

    </html>

    `
    res.send(ans);

    
});



    async function insertItem(client, databaseAndCollection, item) {
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(item);
        return result;

    };


app.listen(9000);
console.log(`Web server started and running at http://localhost:${9000}`);  
console.log(`Stop to shutdown the server: `)
