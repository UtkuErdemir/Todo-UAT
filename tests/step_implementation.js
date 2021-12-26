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
    const box = await textBox("Please type the todo name");
    await write(item, into(box));
    alert(`Todo ${item} named is saved.`, async () => await accept());
    await click("Add");
    assert.equal(await box.value()==="",true);
});

step("Try to add empty todo item", async () => {
    const box = await textBox("Please type the todo name");
    await write("", into(box));
    alert(`Todo name cannot be empty.`, async () => await accept());
    await click("Add");
});

step("Open todo application", async function () {
    await goto("localhost:3000");
});
