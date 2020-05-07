import puppeteer from 'puppeteer'

const DEFAULT_COMMISSION = '5.0';
const DEFAULT_TARGET_CURRENCY = 'ILS';

const asyncCurrencyConverter = (inputData) => {
    return new Promise((resolve, reject) => {
        (async (inputData) => {
            const {inputCashAmount, currencyCodeSource} = inputData;
            let {currencyCodeTarget} = inputData;
            if (!currencyCodeTarget) {
                currencyCodeTarget = DEFAULT_TARGET_CURRENCY;
            }

            const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] });
            const page = await browser.newPage();

            // set viewport and user agent (just in case for nice viewing)
            await page.setViewport({width: 1366, height: 768});
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

            // use Google Live Conversions
            await page.goto(`https://www.google.com/search?hl=en&q=${inputCashAmount}=${currencyCodeSource}+to+${currencyCodeTarget}`);

            // wait until the knowledge about currency is ready on DOM
            try {
                await page.waitForSelector('#knowledge-currency__updatable-data-column', {
                    timeout: 1000
                });
            } catch (e) {
                if (e instanceof puppeteer.errors.TimeoutError) {
                    // Alert if this is a timeout.
                    console.log('target currency is unknown.');
                    await browser.close();
                    reject();
                }
            }

            // get the currency exchange data
            const amountBeforeCommission = await page.evaluate(() => {
                return parseFloat(document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('input')[1].getAttribute('value'));
            });

            const receipt = {
                'From Amount': inputCashAmount,
                'From Currency': currencyCodeSource,
                'To Currency': currencyCodeTarget,
                'Commission': DEFAULT_COMMISSION,
                'Amount Before Commission': amountBeforeCommission,
                'Amount': Math.round(amountBeforeCommission - (amountBeforeCommission * (DEFAULT_COMMISSION/100))).toFixed(2),
            };

            await browser.close();
            resolve(receipt);
        })(inputData);
    })
};

export default asyncCurrencyConverter;
