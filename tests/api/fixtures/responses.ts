export const validResponse = {
  account_id: '98765',
  account_email: 'test123@gmail.com',
  start_date: '2024-03-15T16:00:00+05:30',
  end_date: '2024-03-15T16:02:00+05:30',
  locale: 'en',
  text: 'agile methodology',
  suggestion_list:
    'agile methodology, agile methodology process, agile methodology process testing',
  completed: true,
};

export const missingAccountIdResponse = {
  ...validResponse,
  account_id: undefined,
};

export const invalidCompletedResponse = {
  ...validResponse,
  completed: 'true',
};

export const invalidSuggestionResponse = {
  ...validResponse,
  suggestion_list:
    'agile methodology, agile methodology process, scrum',
};
