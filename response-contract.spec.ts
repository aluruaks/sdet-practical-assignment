import { test, expect } from '@playwright/test';

type ResponseContract = {
  account_id: string;
  account_email: string;
  start_date: string;
  end_date: string;
  locale: string;
  text: string;
  suggestion_list: string;
  completed: boolean;
};

const apiBaseUrl = process.env.API_BASE_URL;
const responsePath = process.env.API_RESPONSE_PATH || '/responses/latest';

const contractKeys: (keyof ResponseContract)[] = [
  'account_id',
  'account_email',
  'start_date',
  'end_date',
  'locale',
  'text',
  'suggestion_list',
  'completed',
];

function isBcp47Locale(value: string): boolean {
  // Pragmatic BCP 47 validation for the assignment's locale field.
  // This accepts language-only tags such as "en" and regional tags such as "en-IN".
  return /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(value);
}

function isIsoTimestamp(value: string): boolean {
  return !Number.isNaN(Date.parse(value)) && /T/.test(value);
}

function assertContract(response: unknown): asserts response is ResponseContract {
  expect(response).toBeTruthy();
  expect(typeof response).toBe('object');

  const body = response as Record<string, unknown>;

  for (const key of contractKeys) {
    expect(body, `Missing required property: ${key}`).toHaveProperty(key);
  }

  expect(typeof body.account_id).toBe('string');
  expect(typeof body.account_email).toBe('string');
  expect(typeof body.start_date).toBe('string');
  expect(typeof body.end_date).toBe('string');
  expect(typeof body.locale).toBe('string');
  expect(typeof body.text).toBe('string');
  expect(typeof body.suggestion_list).toBe('string');
  expect(typeof body.completed).toBe('boolean');

  expect(isIsoTimestamp(body.start_date as string)).toBeTruthy();
  expect(isIsoTimestamp(body.end_date as string)).toBeTruthy();
  expect(isBcp47Locale(body.locale as string)).toBeTruthy();
}

function assertSuggestionListMatches(body: ResponseContract): void {
  const entered = body.text.trim().toLowerCase();
  const suggestions = body.suggestion_list
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  expect(suggestions.length).toBeGreaterThan(0);

  for (const suggestion of suggestions) {
    const candidate = suggestion.toLowerCase();
    // Validate against the default prefix rule supplied by the assignment.
    expect(
      candidate.startsWith(entered) || candidate.includes(entered),
      `Suggestion "${suggestion}" does not match "${body.text}"`
    ).toBeTruthy();
  }
}

test.describe('API response contract', () => {
  test.beforeEach(async () => {
    test.skip(!apiBaseUrl, 'Set API_BASE_URL to run API integration tests.');
  });

  test('validates the FR-05 response contract', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}${responsePath}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    assertContract(body);
    assertSuggestionListMatches(body);
  });

  test('rejects a response with a missing required field', async () => {
    const invalid = {
      account_id: '98765',
      account_email: 'test123@gmail.com',
      start_date: '2024-03-15T10:30:00Z',
      end_date: '2024-03-15T10:32:00Z',
      locale: 'en-IN',
      text: 'agile methodology',
      suggestion_list: 'agile methodology',
      completed: true,
    } as Partial<ResponseContract>;

    delete invalid.account_email;

    expect(() => assertContract(invalid)).toThrow();
  });

  test('rejects a response with invalid completed data type', async () => {
    const invalid = {
      account_id: '98765',
      account_email: 'test123@gmail.com',
      start_date: '2024-03-15T10:30:00Z',
      end_date: '2024-03-15T10:32:00Z',
      locale: 'en-IN',
      text: 'agile methodology',
      suggestion_list: 'agile methodology',
      completed: 'true',
    };

    expect(() => assertContract(invalid)).toThrow();
  });

  test('rejects an invalid locale', async () => {
    const invalid = {
      account_id: '98765',
      account_email: 'test123@gmail.com',
      start_date: '2024-03-15T10:30:00Z',
      end_date: '2024-03-15T10:32:00Z',
      locale: 'en_',
      text: 'agile methodology',
      suggestion_list: 'agile methodology',
      completed: true,
    };

    expect(() => assertContract(invalid)).toThrow();
  });
});
