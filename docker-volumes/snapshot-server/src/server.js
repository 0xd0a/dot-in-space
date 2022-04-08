const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

app.get('/image/:dot_id/:params', async (req, res) => {
    // This was puppeteer.launch()
try{    const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://browserless:3000' });
    const page = await browser.newPage();

    await page.goto('http://api-server:5000/api/view_dot/'+ req.params.dot_id+'/'+ req.params.params);
    //await page.goto('https://p5js.org/examples/simulate-snowflakes.html');

    console.log("waiting");
    await page.waitFor(3000);
    console.log("end of waiting");
    const data = await page.screenshot();
    browser.close();

    return res.end(data, 'binary');
} catch(error){
        console.log(error)
    }
});

app.listen(8080);
