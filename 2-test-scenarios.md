# 2. Top 10 Risk-Ranked Test Scenarios

| Rank | Scenario | Risk | Rationale |
|---:|---|---|---|
| 1 | Submit a valid selected suggestion and verify the persisted API response | Critical | Incorrect persistence can corrupt the core business transaction and is the main end-to-end outcome of the form. |
| 2 | Submit invalid/free-text input and verify the API is rejected and an error is shown | Critical | Accepting invalid input can create invalid records and violates the explicit validation contract. |
| 3 | Verify prefix filtering removes non-matching suggestions and retains all matching suggestions | High | Incorrect filtering can cause users to select an unintended value or make valid values unavailable. |
| 4 | Verify backend response schema, types, timestamps and locale contract | High | Contract violations can break downstream consumers even when the UI appears successful. |
| 5 | Verify the selected suggestion populates the input exactly | High | Incorrect selection-to-input mapping can persist a value different from the user's selection. |
| 6 | Verify successful Next submission displays the success message only after HTTP 200 | High | False success messaging can make users believe data was saved when it was not. |
| 7 | Verify Enter submits the form and Escape performs the expected clear/close behavior | Medium | Keyboard failures affect usability and keyboard-only workflows but do not affect every pointer-based transaction. |
| 8 | Verify Tab moves through form controls in a logical order | Medium | Poor keyboard navigation affects accessibility and usability but does not necessarily prevent pointer-based completion. |
| 9 | Verify match-anywhere filtering when backend configuration is enabled | Medium | This affects only deployments where the optional configuration is enabled, reducing overall exposure. |
| 10 | Verify empty input, whitespace and case/partial input do not produce incorrect suggestion or submission behavior | Low | Boundary inputs are useful for robustness but are less likely to affect normal valid transactions. |
