# 4. Detailed Test Cases

## TC-UI-001 — Prefix filtering retains matching suggestions

**Preconditions**
- User is logged in.
- User is on the autocomplete form.
- Default prefix-match configuration is enabled.
- Suggestion list contains the three suggestions from the assignment.

**Test Steps**
1. Click the input field.
2. Type `agile`.
3. Observe the suggestion list.
4. Verify all three `agile...` suggestions remain visible.
5. Replace the input with `testing`.
6. Observe the suggestion list.

**Expected Results**
- All three suggestions remain visible for `agile`.
- Suggestions that do not start with `testing` are removed from the list.
- No unrelated suggestion remains visible.

**Test Data**
- `agile`
- `testing`

---

## TC-UI-002 — Selecting a suggestion populates the input

**Preconditions**
- User is on the autocomplete form.
- Suggestions are displayed.

**Test Steps**
1. Click `agile methodology`.
2. Read the value of the input field.
3. Inspect the remaining UI state.

**Expected Results**
- Input value becomes exactly `agile methodology`.
- The selected suggestion is treated as the chosen value.
- No unintended characters are added.

**Test Data**
- Suggestion: `agile methodology`

---

## TC-UI-003 — Invalid input displays an error

**Preconditions**
- User is on the autocomplete form.
- A value not represented by a valid suggestion can be entered.

**Test Steps**
1. Type `invalid response`.
2. Click Next.
3. Wait for the submission result.

**Expected Results**
- The submission is rejected as invalid.
- Error message `Error: Invalid input. Please select a valid suggestion.` is displayed.
- A success message is not displayed.
- No successful completion is reported.

**Test Data**
- `invalid response`

---

## TC-UI-004 — Valid selection submits successfully

**Preconditions**
- User is on the autocomplete form.
- API is available.

**Test Steps**
1. Select `agile methodology`.
2. Click Next.
3. Capture the REST API response.
4. Verify the HTTP status.
5. Observe the page.

**Expected Results**
- REST API request is sent.
- HTTP status is 200.
- Success message `Success! Your response has been recorded.` is displayed.
- Error message is not displayed.

**Test Data**
- `agile methodology`

---

## TC-UI-005 — Tab navigation follows a usable sequence

**Preconditions**
- User is on the autocomplete form.
- Focus can be placed on the first form control.

**Test Steps**
1. Place focus on the input.
2. Press Tab.
3. Verify focus moves to the next interactive form element.
4. Press Tab again.
5. Verify focus reaches the Next button.
6. Continue with Tab and verify no unexpected focus trap occurs.

**Expected Results**
- Focus moves through interactive controls in a logical order.
- The Next button is reachable using Tab.
- No unexpected focus trap occurs.

**Test Data**
- None.

---

## TC-UI-006 — Enter submits a valid selection

**Preconditions**
- User has selected `agile methodology`.
- Form is ready for submission.

**Test Steps**
1. Ensure the input contains `agile methodology`.
2. Press Enter.
3. Wait for the submission result.

**Expected Results**
- Enter triggers form submission.
- API returns HTTP 200 for the valid value.
- Success message is displayed.

**Test Data**
- `agile methodology`

---

## TC-UI-007 — Escape performs the defined clear/close behavior

**Preconditions**
- User is on the form.
- Input contains text and suggestions are visible.

**Test Steps**
1. Type `agile`.
2. Press Escape.
3. Inspect the input.
4. Inspect the suggestion list.

**Expected Results**
- The input is cleared and/or the suggestion popup closes according to the application's Escape contract.
- The automation implementation assumes the clear behavior because the assignment explicitly asks to use Escape to clear/close but does not define the exact UI behavior.

**Test Data**
- `agile`

---

## TC-UI-008 — Match-anywhere filtering works when enabled

**Preconditions**
- Backend match-anywhere configuration is enabled.
- User is on the form.

**Test Steps**
1. Type `method`.
2. Observe the suggestions.
3. Compare the visible values with the configured suggestion list.

**Expected Results**
- Suggestions containing `method` anywhere in the string remain visible.
- Suggestions that do not contain `method` are removed.

**Test Data**
- `method`
- Expected matching values include all three assignment suggestions.

---

## TC-API-001 — Validate successful response contract

**Preconditions**
- API is available.
- A valid form response exists.

**Test Steps**
1. Send GET request to the configured response endpoint.
2. Assert HTTP 200.
3. Validate required properties.
4. Validate primitive data types.
5. Validate timestamp format.
6. Validate locale format.
7. Validate suggestion-list matching.

**Expected Results**
- Response conforms to the documented contract.
- `completed` is Boolean.
- Dates are valid offset-aware timestamps.
- Locale matches BCP 47 syntax.
- Suggestion list contains only matching suggestions.

**Test Data**
- Valid response returned by the environment.

---

## TC-API-002 — Missing required field is rejected by contract validation

**Preconditions**
- Contract validator is available.

**Test Steps**
1. Create a response object without `account_id`.
2. Pass it to the validator.
3. Inspect validation failures.

**Expected Results**
- Validation fails.
- Missing `account_id` is reported.

**Test Data**
- Negative fixture in `tests/api/fixtures/responses.ts`.

---

## TC-API-003 — Wrong data type is rejected

**Preconditions**
- Contract validator is available.

**Test Steps**
1. Create a response where `completed` is the string `"true"`.
2. Pass it to the validator.
3. Inspect validation failures.

**Expected Results**
- Validation fails.
- `completed` is reported as requiring Boolean type.

**Test Data**
- `"completed": "true"`

---

## TC-API-004 — Suggestion list excludes non-matching values

**Preconditions**
- Response text is `agile methodology`.

**Test Steps**
1. Build a response containing one unrelated suggestion, for example `scrum`.
2. Validate the response.
3. Inspect validation failures.

**Expected Results**
- Validation fails because `scrum` does not match the selected text under the default prefix rule.

**Test Data**
- Text: `agile methodology`
- Invalid suggestion: `scrum`
