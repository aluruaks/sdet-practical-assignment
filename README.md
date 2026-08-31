# SDET Practical Assignment — Autocomplete Form

This repository implements the practical assignment supplied in the PDF.

## Scope

The assignment covers:

1. Risk-ranked test scenarios.
2. Backend contract discrepancy identification.
3. Detailed UI/API test cases.
4. Playwright UI automation using Page Object Model.
5. API contract/data validation and negative tests.
6. Architecture and implementation documentation.

The supplied assignment defines the application URL as `https://test.com/autocomplete-form`, while the API endpoint itself is not specified. Therefore the API suite makes the endpoint configurable through environment variables rather than inventing a production endpoint.

## Repository structure

```text
.
├── README.md
├── package.json
├── playwright.config.ts
├── prompts/
│   └── assignment-completion-prompt.md
├── ai-conversation-transcript.json
├── docs/
│   ├── 1-requirement-analysis.md
│   ├── 2-test-scenarios.md
│   ├── 3-defect-identification.md
│   ├── 4-test-cases.md
│   ├── 7-ai-reflection.md
│   └── 8-architecture-discussion.md
└── tests/
    ├── ui/
    │   ├── config/
    │   │   └── test-data.ts
    │   ├── pages/
    │   │   └── autocomplete-form.page.ts
    │   └── tests/
    │       └── autocomplete-form.spec.ts
    └── api/
        ├── helpers/
        │   └── contract-validator.ts
        ├── fixtures/
        │   └── responses.ts
        └── tests/
            └── response-contract.spec.ts
```

## Prerequisites

- Node.js 20+
- npm
- Access to the AUT/API if running against a real environment

## Installation

```bash
npm install
npx playwright install
```

## UI execution

Default UI URL:

```text
https://test.com/autocomplete-form
```

Override it when required:

```bash
BASE_URL=https://your-test-environment.example.com npm test
```

Run headed:

```bash
npm run test:headed
```

Run with the Playwright UI runner:

```bash
npm run test:ui
```

## API execution

The assignment does not provide a concrete API URL or endpoint. Configure:

```bash
API_BASE_URL=https://your-api.example.com
API_RESPONSE_PATH=/responses
```

Then run:

```bash
npm run test:api
```

The live API contract test expects a successful GET to return one response object with:

- `account_id`
- `account_email`
- `start_date`
- `end_date`
- `locale`
- `text`
- `suggestion_list`
- `completed`

The negative tests validate deliberately invalid contract examples locally, so they do not require a deliberately broken server.

## Match-anywhere configuration

Prefix filtering is the default requirement. Match-anywhere filtering is configurable in the backend.

The UI suite contains a conditional test for match-anywhere behavior. Enable it only when the target environment has that backend configuration enabled:

```bash
MATCH_ANYWHERE_ENABLED=true npm test
```

## Important assumptions

- The login flow/admin configuration are out of scope, as stated by the assignment.
- The supplied HTML is treated as the functional locator contract; selectors use the provided IDs/classes.
- The assignment says Escape should clear/close and Enter should submit. The exact browser/application behavior for Escape is not otherwise specified, so the UI test documents the expected clear behavior as an explicit automation assumption.
- The API route is not specified in the PDF; no undocumented route is presented as fact.
- Timestamps in the response are expected to be timestamps representing the user's local time. A `Z` suffix represents UTC, so the supplied sample is treated as a contract discrepancy unless the API contract is clarified to require UTC.
