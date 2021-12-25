/* globals gauge*/
"use strict";
const path = require('path');
const {
    openBrowser,
    write,
    closeBrowser,
    goto,
    screenshot,
    click,
    into,
    textBox,
    alert,
    accept
} = require('taiko');
const assert = require("assert");
const headless = process.env.headless_chrome.toLowerCase() === 'true';

beforeSuite(async () => {
    await openBrowser({
        headless: headless
    })
});

afterSuite(async () => {
    await closeBrowser();
});

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
        `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
        path: screenshotFilePath
    });
    return path.basename(screenshotFilePath);
};

step("Add todo <item>", async (item) => {
    await write(item, into(textBox("Please type the todo name")));
    alert(`Todo ${item} named is saved.`, async () => await accept());
    await click("Add");
});

step("Open todo application", async function () {
    await goto("localhost:3000");
});
