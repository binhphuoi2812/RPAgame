const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-angular')());
const cron = require('node-cron')
const fs = require('fs')

var i = 0;
var start = '';
const Screenshot = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {width: 1920, height: 1080},
            executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding', "--disabled-setupid-sandbox", '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process', '--disable-extensions'],
            
        });    
      
        const page = await browser.newPage();        
    
        await page.goto('https://www.jbbodds.com/vi-vn/live', {waitUntil: 'networkidle2'});
        await page.waitForTimeout(2000)
        await page.type('input[type="text"]', 'binhbui9516');
        await page.type('input[type="password"]', 'binh1102');
        await page.click('button.toggle-login-desktop');
        await page.waitForTimeout(2000)
        const page2 = await browser.newPage();        // open new tab
        await page2.goto('https://www.jbbodds.com/vi-vn/live/lobby?partnerId=56&partnerName=EA-N2Live&playfor=real&&category=Baccarat&gameType=',{waitUntil :"networkidle2"});
        await page2.bringToFront();                   // make the tab active
        await page2.waitForSelector('.handCursor', {
            visible: true,
        });
        await page2.waitForTimeout(3000)
        let scrollBar = await page2.$('.handCursor');
        await scrollBar.evaluate((el) => el.style.height = 100 + '%');
        await page2.waitForTimeout(1000);
    
        const session = await page2.target().createCDPSession();
        await session.send('Page.enable');
        await session.send('Page.setWebLifecycleState', {state: 'active'});
        
    
        cron.schedule('1 * * * * *', async () => {
            let cookies = await page.cookies();
            limitCookies = cookies.map((item) => {
                item.expires = -1;
                return item;
            })
            await page2.setCookie(...limitCookies);
        
            if(i == 0){
                start = new Date();
            }
            let now = new Date();
            console.log(111,now.getTime() / 1000 - start.getTime() / 1000 >= 900);
            console.log(222,now.getTime() / 1000 ,start.getTime() / 1000);
            if(now.getTime() / 1000 - start.getTime() / 1000 >= 900){
                await page.close();
                await page2.close();
                await browser.close();
                i = 0;
                Screenshot();          
                return false;
            } else {
            let current = now.toLocaleTimeString().split(' ');
    
            let nametime = `${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
            console.log(current,nametime);
            
            const path = './screenshot.png'
    
            // try {
            //     if (fs.existsSync(path)) {
    
            //         fs.unlinkSync(path);
    
            //     }
            // } catch(err) {
    
            // console.error(err)
    
            // }
            page2.screenshot({
    
                path: `./screenshot_${i}_${nametime}.png`,
    
                fullPage: true
    
                });
                i++;
              }
            
        });
    } catch (error) {
        console.log(error);
    }
    
 }

 Screenshot();