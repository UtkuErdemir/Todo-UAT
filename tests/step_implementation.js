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
    accept,
    title,
    text,
    waitFor
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
    await waitFor(3000);
    assert.equal(await box.value()==="",true);
});

step("Check todo list for <item>", async(item)=>{
    assert.equal((await (await text(item)).exists()),true);
})

step("Try to add empty todo item", async () => {
    const box = await textBox("Please type the todo name");
    await write("", into(box));
    alert(`Todo name cannot be empty.`, async () => await accept());
    await click("Add");
});

step("Open todo application", async function () {
    await goto("ue-todo-app-frontend.herokuapp.com");
});

step("Check application title", async function(){
    assert.equal(await title()==="Todo App Frontend",true);
})
