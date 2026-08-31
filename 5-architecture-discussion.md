# 8. Architecture Discussion

## Proposed automation architecture

The framework uses Playwright Test with TypeScript and separates test intent from implementation details.

```text
tests/ui/tests
      |
      v
AutocompleteFormPage
      |
      +--> locators
      +--> user interactions
      +--> reusable assertions/helpers
      |
      v
      AUT

tests/api/tests
      |
      +--> contract-validator
      +--> APIRequestContext
      |
      v
      API
```

## Page Object Model

`AutocompleteFormPage` owns:
- input locator;
- suggestion locators;
- Next button;
- success/error messages;
- keyboard actions;
- reusable methods for typing, selecting and submitting.

This prevents test cases from duplicating CSS/ID selectors and makes locator changes localized.

## API contract layer

The API tests use a lightweight validator rather than a third-party schema package. This keeps the dependency surface small while explicitly checking:
- required properties;
- primitive types;
- timestamp format;
- BCP 47-like locale syntax;
- suggestion-list semantics.

For a production framework, a formal JSON Schema/OpenAPI contract and a schema validator such as Ajv could be introduced if the service publishes a machine-readable contract.

## Configuration

Environment variables keep environment-specific details outside the test source:

- `BASE_URL`
- `API_BASE_URL`
- `API_RESPONSE_PATH`
- `MATCH_ANYWHERE_ENABLED`

This allows the same repository to run across environments without changing committed test code.

## Test isolation

UI tests should be run against a clean or controlled test account where possible. API tests should use deterministic test data or a known response fixture so that assertions do not depend on another test's timing.

## CI/CD recommendation

A CI pipeline should:

1. Install Node dependencies.
2. Install Playwright browsers.
3. Run API contract tests.
4. Run UI tests in Chromium.
5. Publish Playwright HTML results and traces on failure.
6. Fail the pipeline on test failures.

## Scaling considerations

For a larger suite:
- introduce API client classes instead of embedding request construction in tests;
- use typed DTOs for request/response models;
- add JSON Schema/OpenAPI validation;
- add environment-specific configuration files;
- parallelize independent tests;
- add trace/video capture only where useful;
- integrate reporting with CI.

The current assignment implementation intentionally stays small and transparent because the supplied application specification is limited to one form.
