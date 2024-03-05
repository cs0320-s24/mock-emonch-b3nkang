import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(async ({ page }) => {
  // ... you'd put it here.
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
});

// // code below from gearup
// test("on page load, i dont see the input box until pressing login", async ({
//   page,
// }) => {
//   await expect(page.getByLabel("Login")).toBeVisible();
//   await expect(page.locator(".repl")).not.toBeVisible();
// });

// test("after login, the repl is now visible", async ({ page }) => {
//   await page.getByLabel("Login").click();
//   await expect(page.locator(".repl")).toBeVisible();
// });

test("i can switch modes between verbose and brief", async ({ page }) => {
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Command: mode"
  );
  await expect(page.locator('[data-index="history-output-0"]')).toContainText(
    "Output: Switched to verbose"
  );

  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-1"]')).toContainText(
    "Command: mode"
  );
  await expect(page.locator('[data-index="history-output-1"]')).toContainText(
    "Output: Switched to brief"
  );
});

test("i can load a CSV file and view data", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file path1");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Loaded dataset from path1"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.getByRole("table")).toBeVisible();
});

test("i get a useful error if i try loading nonexistent data", async ({
  page,
}) => {
  await page.getByLabel("Command input").fill("load_file hi");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Error: File not found at hi"
  );
});

test("i get a useful error if i view unloaded data", async ({ page }) => {
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Error: dataset not loaded for view"
  );
});

test("i can load a CSV file and search existent data with column INDEX, without viewing it", async ({
  page,
}) => {
  await page.getByLabel("Command input").fill("load_file path2");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Loaded dataset from path2"
  );

  await page.getByLabel("Command input").fill("search 2 Data6");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-1"]')).toContainText(
    "Data4 Data5 Data6"
  );
  await expect(page.locator('[data-index="history-command-2"]')).toContainText(
    "Data4 Data7 Data6"
  );
});

test("i can load a CSV file and search existent data with column NAME, without viewing it", async ({
  page,
}) => {
  await page.getByLabel("Command input").fill("load_file path2");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Loaded dataset from path2"
  );

  await page.getByLabel("Command input").fill("search Header3 Data6");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-1"]')).toContainText(
    "Data4 Data5 Data6"
  );
  await expect(page.locator('[data-index="history-command-2"]')).toContainText(
    "Data4 Data7 Data6"
  );
});

test("i can load a CSV file and search existent data with WRONG column name, without viewing it", async ({
  page,
}) => {
  await page.getByLabel("Command input").fill("load_file path2");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Loaded dataset from path2"
  );

  await page.getByLabel("Command input").fill("search Header2 Data6");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-1"]')).toContainText(
    "No results found for"
  );
});

test("i get a useful error if i search unloaded data", async ({ page }) => {
  await page.getByLabel("Command input").fill("search 1 hi");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Error: dataset not loaded for search"
  );
});

test("i can do EVERYTHING: view and search before loading (gets errors), load a nonexistent CSV file, load an existing file, view it, and search existent AND nonexistent data with column name and index", async ({
  page,
}) => {
  // unloaded view
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-0"]')).toContainText(
    "Error: dataset not loaded for view"
  );

  // unloaded search
  await page.getByLabel("Command input").fill("search 1 hi");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-1"]')).toContainText(
    "Error: dataset not loaded for search"
  );

  // load malformed filepath
  await page.getByLabel("Command input").fill("load_file hii");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-2"]')).toContainText(
    "Error: File not found at hii"
  );

  // load formed filepaht
  await page.getByLabel("Command input").fill("load_file path2");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-3"]')).toContainText(
    "Loaded dataset from path2"
  );

  // view loaded file
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.getByRole("table")).toBeVisible();

  // search loaded file in wrong column
  await page.getByLabel("Command input").fill("search Header2 Data6");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-5"]')).toContainText(
    "No results found for"
  );

  // search loaded file in correct column with NAME
  await page.getByLabel("Command input").fill("search Header3 Data6");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-6"]')).toContainText(
    "Data4 Data5 Data6"
  );
  await expect(page.locator('[data-index="history-command-7"]')).toContainText(
    "Data4 Data7 Data6"
  );

  // search loaded file in correct column with INDEX
  await page.getByLabel("Command input").fill("search 2 Data6");
  await page.getByRole("button", { name: "Submit Command" }).click();

  await expect(page.locator('[data-index="history-command-8"]')).toContainText(
    "Data4 Data5 Data6"
  );
  await expect(page.locator('[data-index="history-command-9"]')).toContainText(
    "Data4 Data7 Data6"
  );
});

// npx playwright codegen http://localhost:8000/
// npm run test:e2e

// /**
//  * Don't worry about the "async" yet. We'll cover it in more detail
//  * for the next sprint. For now, just think about "await" as something
//  * you put before parts of your test that might take time to run,
//  * like any interaction with the page.
//  */
// test("on page load, i see a login button", async ({ page }) => {
//   // Notice: http, not https! Our front-end is not set up for HTTPs.
//   await page.goto("http://localhost:8000/");
//   await expect(page.getByLabel("Login")).toBeVisible();
// });

// test("on page load, i dont see the input box until login", async ({ page }) => {
//   // Notice: http, not https! Our front-end is not set up for HTTPs.
//   await page.goto("http://localhost:8000/");
//   await expect(page.getByLabel("Sign Out")).not.toBeVisible();
//   await expect(page.getByLabel("Command input")).not.toBeVisible();

//   // click the login button
//   await page.getByLabel("Login").click();
//   await expect(page.getByLabel("Sign Out")).toBeVisible();
//   await expect(page.getByLabel("Command input")).toBeVisible();
// });

// test("after I type into the input box, its text changes", async ({ page }) => {
//   // Step 1: Navigate to a URL
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   // Step 2: Interact with the page
//   // Locate the element you are looking for
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("Awesome command");

//   // Step 3: Assert something about the page
//   // Assertions are done by using the expect() function
//   const mock_input = `Awesome command`;
//   await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });

// test("on page load, i see a button", async ({ page }) => {
//   // CHANGED
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();
//   await expect(
//     page.getByRole("button", { name: "Submitted 0 times" })
//   ).toBeVisible();
// });

// // test("after I click the button, its label increments", async ({ page }) => {
// //   // CHANGED
// //   await page.goto("http://localhost:8000/");
// //   await page.getByLabel("Login").click();
// //   await expect(
// //     page.getByRole("button", { name: "Submitted 0 times" })
// //   ).toBeVisible();
// //   await page.getByRole("button", { name: "Submitted 0 times" }).click();
// //   await expect(
// //     page.getByRole("button", { name: "Submitted 1 times" })
// //   ).toBeVisible();
// // });

// test("after I click the button, my command gets pushed", async ({ page }) => {
//   // CHANGED
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();
//   await page.getByLabel("Command input").fill("Awesome command");
//   // await page.getByRole("button", { name: "Submitted 0 times" }).click();

//   // you can use page.evaulate to grab variable content from the page for more complex assertions
//   const firstChild = await page.evaluate(() => {
//     const history = document.querySelector(".repl-history");
//     return history?.children[0]?.textContent;
//   });
//   expect(firstChild).toEqual("Awesome command");
// });
