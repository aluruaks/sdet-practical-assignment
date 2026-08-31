# 3. Defect Identification

## Supplied API response

The assignment supplies a response after selecting `agile methodology`.

### Findings

| Field | Requirement | Supplied value | Result |
|---|---|---|---|
| `account_id` | Account ID | `"98765"` | Pass |
| `account_email` | Completing account email | `"test123@gmail.com"` | Pass |
| `start_date` | User-local timestamp when form was reached | `"2024-03-15T10:30:00Z"` | **Potential defect / contract mismatch** |
| `end_date` | User-local timestamp when Next was selected | `"2024-03-15T10:32:00Z"` | **Potential defect / contract mismatch** |
| `locale` | IETF BCP 47 locale | `"en"` | Pass: `en` is syntactically valid BCP 47 |
| `text` | User-provided text | `"agile methodology"` | Pass |
| `suggestion_list` | Matching suggestions | Three `agile methodology...` values | Pass for the supplied prefix-match example: all three start with the selected value |
| `completed` | Boolean | `"true"` | **Fail** |

## Defect 1 — `completed` has the wrong data type

**Severity:** High

The contract requires `completed` to be a Boolean. The response returns the string `"true"` rather than the Boolean `true`.

Expected:

```json
"completed": true
```

Actual:

```json
"completed": "true"
```

This can cause strict schema validation and downstream type handling to fail.

## Defect 2 — timestamps conflict with the stated local-time contract

**Severity:** High, subject to contract clarification

The environment specifies India / IST (UTC+05:30), and FR-05 states that `start_date` and `end_date` are timestamps in the user's local time. The response uses a `Z` suffix, which conventionally represents UTC.

For a local-time representation of the supplied instants, an offset-aware representation would be expected, for example:

```text
2024-03-15T16:00:00+05:30
2024-03-15T16:02:00+05:30
```

However, the assignment does not explicitly state whether the API serialization is allowed to normalize local timestamps to UTC. Therefore this should be raised as a contract discrepancy/clarification rather than asserted as an unconditional implementation bug.

## Non-defects

### `locale: "en"`

`en` is an IETF BCP 47 language tag and therefore is valid under the stated format requirement. The example `en-IN` does not mean that `en-IN` is mandatory.

### `suggestion_list`

The selected value is `agile methodology`. Under the default prefix-match rule, all three supplied suggestions begin with that value:

- agile methodology
- agile methodology process
- agile methodology process testing

Therefore, the fact that three suggestions are returned is not itself a defect.

## Recommended corrected response fragment

```json
{
  "account_id": "98765",
  "account_email": "test123@gmail.com",
  "start_date": "2024-03-15T16:00:00+05:30",
  "end_date": "2024-03-15T16:02:00+05:30",
  "locale": "en",
  "text": "agile methodology",
  "suggestion_list": "agile methodology, agile methodology process, agile methodology process testing",
  "completed": true
}
```

The timestamp representation above assumes that the API must preserve the user's local timezone rather than normalize timestamps to UTC.
