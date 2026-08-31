import { test, expect } from '@playwright/test';
import { AutocompleteFormPage } from '../pages/autocomplete-form.page';
import { testData } from '../config/test-data';

test.describe('Autocomplete form', () => {
  let form: AutocompleteFormPage;

  test.beforeEach(async ({ page }) => {
    form = new AutocompleteFormPage(page);
    await form.goto();
  });

  test('filters suggestions using prefix matching', async () => {
    await form.typeValue(testData.prefix);

    const visibleSuggestions = await form.suggestions.evaluateAll(
      (items) =>
        items
          .filter((item) => {
            const style = window.getComputedStyle(item);
            return style.display !== 'none' && style.visibility !== 'hidden';
          })
          .map((item) => item.textContent?.trim() ?? '')
    );

    expect(visibleSuggestions.length).toBeGreaterThan(0);
    expect(visibleSuggestions.every((value) => value.startsWith(testData.prefix))).toBeTruthy();
  });

  test('removes suggestions for a non-matching prefix', async () => {
    await form.typeValue(testData.nonMatchingPrefix);
    await expect(form.suggestions).toHaveCount(0);
  });

  test('selects a suggestion and populates the input', async () => {
    await form.typeValue(testData.prefix);
    await form.selectSuggestion(testData.validSuggestion);
    await form.expectInputValue(testData.validSuggestion);
  });

  test('supports Tab navigation to the Next button', async () => {
    await form.input.focus();
    await form.input.press('Tab');
    await expect(form.nextButton).toBeFocused();
  });

  test('Escape does not submit the form', async ({ page }) => {
    let requestCount = 0;
    page.on('request', (request) => {
      if (request.method() !== 'GET' && request.method() !== 'HEAD') requestCount += 1;
    });

    await form.typeValue(testData.prefix);
    await form.pressEscape();

    expect(requestCount).toBe(0);
  });

  test('Enter submits the form for a valid selection', async ({ page }) => {
    await form.typeValue(testData.prefix);
    await form.selectSuggestion(testData.validSuggestion);

    const responsePromise = page.waitForResponse(
      (response) => response.request().method() === 'POST' || response.request().method() === 'PUT',
      { timeout: 10_000 }
    ).catch(() => null);

    await form.pressEnter();
    await responsePromise;

    await expect(form.successMessage).toBeVisible();
  });

  test('Next displays success for a successful submission', async ({ page }) => {
    await form.typeValue(testData.prefix);
    await form.selectSuggestion(testData.validSuggestion);

    await form.submit();

    await expect(form.successMessage).toBeVisible();
  });

  test('invalid input displays an error message', async () => {
    await form.typeValue(testData.invalidValue);
    await form.submit();

    await expect(form.errorMessage).toBeVisible();
  });
});
