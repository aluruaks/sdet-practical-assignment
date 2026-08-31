# 7. AI Reflection

## Tools Used

ChatGPT was used during preparation of the assignment.

## Usage Areas

It was used to assist with requirement analysis, risk-based test design, test-case structure, Playwright framework organization, API contract validation, and documentation.

## Modifications Made

1. The `suggestion_list` analysis was reviewed against the stated prefix-match requirement. All three supplied suggestions begin with `agile methodology`, so the list was not incorrectly classified as a defect.
2. The `locale` value `en` was reviewed against the BCP 47 requirement. It is a valid language tag; `en-IN` is an example, not a mandatory value.
3. The timestamp finding was treated as a contract clarification because the assignment states local time but does not define the exact serialized timezone representation.
4. The API endpoint was kept configurable because the assignment does not specify a concrete API route.

## Limitations

The provided assignment does not contain the actual API endpoint, authentication details, backend configuration interface, or a precise Escape-key behavior. These items must be validated against the supplied test environment before execution.
