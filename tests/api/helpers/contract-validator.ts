export type ApiResponse = {
  account_id: string;
  account_email: string;
  start_date: string;
  end_date: string;
  locale: string;
  text: string;
  suggestion_list: string;
  completed: boolean;
};

const REQUIRED_FIELDS: (keyof ApiResponse)[] = [
  'account_id',
  'account_email',
  'start_date',
  'end_date',
  'locale',
  'text',
  'suggestion_list',
  'completed',
];

export function validateResponseContract(
  response: unknown,
  matchAnywhere = false,
): string[] {
  const errors: string[] = [];

  if (typeof response !== 'object' || response === null) {
    return ['Response must be an object'];
  }

  const data = response as Record<string, unknown>;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (typeof data.account_id !== 'string') {
    errors.push('account_id must be a string');
  }

  if (typeof data.account_email !== 'string') {
    errors.push('account_email must be a string');
  }

  if (typeof data.start_date !== 'string' || !isTimestamp(data.start_date)) {
    errors.push('start_date must be a valid timestamp');
  }

  if (typeof data.end_date !== 'string' || !isTimestamp(data.end_date)) {
    errors.push('end_date must be a valid timestamp');
  }

  if (typeof data.locale !== 'string' || !isBcp47Locale(data.locale)) {
    errors.push('locale must be a valid BCP 47 language tag');
  }

  if (typeof data.text !== 'string') {
    errors.push('text must be a string');
  }

  if (typeof data.suggestion_list !== 'string') {
    errors.push('suggestion_list must be a comma-separated string');
  } else if (typeof data.text === 'string') {
    const suggestions = data.suggestion_list
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    for (const suggestion of suggestions) {
      const matches = matchAnywhere
        ? suggestion.toLowerCase().includes(data.text.toLowerCase())
        : suggestion.toLowerCase().startsWith(data.text.toLowerCase());

      if (!matches) {
        errors.push(`Suggestion does not match text: ${suggestion}`);
      }
    }
  }

  if (typeof data.completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }

  return errors;
}

function isTimestamp(value: string): boolean {
  return !Number.isNaN(Date.parse(value)) && /T/.test(value);
}

function isBcp47Locale(value: string): boolean {
  return /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(value);
}
