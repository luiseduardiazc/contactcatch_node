const puppeteer = require('puppeteer');
const sleep = require('sleep-promise');

async function displayMore (page) {
  let moreComments = null;
  let a = null;
  return page.evaluate(() => {
    moreComments = document.querySelector('div._7a94._7a9d');
    a = moreComments.querySelector('a');
    if (a !== null) {
      a.click();
      return 'more items';
    } else {
      return -1;
    }
  });
}

async function scrollToBottom (page) {
  const distance = 150; // should be less than or equal to window.innerHeight
  const delay = 100;
  while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
    await page.evaluate((y) => { document.scrollingElement.scrollBy(0, y); }, distance);
    await page.waitFor(delay);
  }
}

async function doScraping (url) {
  // start scraping
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1024,
    height: 720,
    deviceScaleFactor: 1
  });

  try {
    await page.goto(url);
    console.log('scraping ......');
    await sleep(3000);
    await page.click('#expanding_cta_close_button');
    await page.waitForSelector('.commentable_item.collapsed_comments');
    await page.evaluate(() => {
      const comments = document.querySelector('.commentable_item.collapsed_comments');
      comments.querySelector('._3hg-._42ft').click();
    });

    await page.waitForSelector('._7a99._21q1._p');

    await page.evaluate(() => {
      document.querySelector('._7a99._21q1._p').click();
      const ul = document.querySelectorAll('ul._54nf > li');
      ul[1].click();
    });

    await page.waitForSelector('div._7a94._7a9d');

    while (await displayMore(page) !== -1) {
      await sleep(1000);
    }

    // click for more Replies

    await page.evaluate(() => {
      const moreResponses = document.querySelectorAll('._4sso._4ssp');
      moreResponses.forEach((resp) => resp.click());
    });

    await scrollToBottom(page);

    const data = await page.evaluate(() => {
      const comments = document.querySelectorAll('div._72vr');
      const listComments = [];
      comments.forEach((comment) => {
        const message = comment.querySelector('span > span');
        if (message !== null) {
          listComments.push({
            author: comment.querySelector('._6qw4').innerText,
            message: message.innerText
          });
        }
      });
      return {
        status: 'OK',
        data: listComments,
        count: listComments.length
      };
    });
    await browser.close();
    return data;
  } catch (error) {
    return {
      status: 'Error',
      data: [],
      count: 0
    };
  }
}

module.exports = {
  doScraping
};
