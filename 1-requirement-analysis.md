# 1. Requirement Analysis

## Functional requirements

### FR-01 — Text Input
The user can either type a response into the text field or select a suggestion list item.

### FR-02 — Suggestion Filtering: Prefix Match
Prefix matching is the default behavior. A suggestion remains visible when the entered text matches the beginning of that suggestion. Suggestions that do not begin with the entered text disappear.

### FR-03 — Suggestion Filtering: Match Anywhere
A backend configuration can enable substring matching. When enabled, suggestions remain visible when they contain the entered text anywhere.

### FR-04 — Form Submission
Selecting Next sends a REST API request.

- HTTP 200 represents successful submission.
- A success message is displayed after successful submission.
- An error message is displayed for invalid input.

### FR-05 — Backend Data Contract
The persisted response is required to contain:

| Property | Requirement |
|---|---|
| `account_id` | ID of the account completing the form |
| `account_email` | Email of the account completing the form |
| `start_date` | Timestamp in the user's local time when the user reached the form |
| `end_date` | Timestamp in the user's local time when the user selected Next |
| `locale` | IETF BCP 47 locale |
| `text` | Text supplied by the user |
| `suggestion_list` | Comma-separated suggestions matching the entered/selected value |
| `completed` | Boolean representing upload completion status |

## Test environment

- Browser: Chrome on Windows 10.
- Browser language: English.
- Login user: `test123@gmail.com`.
- User location: India.
- Local timezone: IST / UTC+05:30.
- Form URL: `https://test.com/autocomplete-form`.

## Requirement ambiguities requiring clarification

1. The API endpoint/path is not specified.
2. FR-03 says match-anywhere is backend configurable, but no configuration API or UI is provided.
3. The HTML contains an error message and success container without visibility rules; the expected initial visibility is implied rather than explicitly specified.
4. Escape is required by the automation exercise, but the functional requirements do not define exactly whether Escape clears the input, closes suggestions, or both.
5. "Timestamp in the user's local time" is not accompanied by a required serialized timestamp format or timezone representation. The Task 5 wording separately asks for proper timestamp format, but the exact canonical format should be confirmed.

## Risk-based testing principle

The highest risks are assigned to data integrity, submission correctness, invalid-input handling, and suggestion filtering because these behaviors directly affect persisted business data or the user's ability to complete the form. Keyboard/accessibility flows and secondary configuration behavior follow because failures affect usability or specific deployments rather than every successful transaction.
