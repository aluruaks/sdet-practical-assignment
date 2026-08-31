import { expect, Locator, Page } from '@playwright/test';

export class AutocompleteFormPage {
  readonly page: Page;
  readonly input: Locator;
  readonly suggestions: Locator;
  readonly nextButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator('#input-field');
    this.suggestions = page.locator('ul.suggestions li');
    this.nextButton = page.locator('#next-button');
    this.errorMessage = page.locator('.error-message');
    this.successMessage = page.locator('.success-container p');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async typeValue(value: string): Promise<void> {
    await this.input.fill(value);
  }

  async selectSuggestion(value: string): Promise<void> {
    await this.suggestions.filter({ hasText: value }).first().click();
  }

  async pressEnter(): Promise<void> {
    await this.input.press('Enter');
  }

  async pressEscape(): Promise<void> {
    await this.input.press('Escape');
  }

  async submit(): Promise<void> {
    await this.nextButton.click();
  }

  async visibleSuggestionTexts(): Promise<string[]> {
    const visible = this.suggestions.filter({ visible: true });
    return visible.allTextContents();
  }

  async expectInputValue(value: string): Promise<void> {
    await expect(this.input).toHaveValue(value);
  }
}
