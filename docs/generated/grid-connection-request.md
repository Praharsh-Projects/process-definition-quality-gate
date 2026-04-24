# Grid Connection Request

- Key: `grid-connection-request`
- Version: 1
- Start node: `start`

## Nodes

| Node ID | Type | Name | Owner | SLA (hours) |
|---|---|---|---|---|
| start | start | Start | - | - |
| validate-intake | serviceTask | Validate intake | - | - |
| capacity-review | decision | Capacity review required? | - | - |
| technical-review | userTask | Technical review | Grid Engineering | 24 |
| offer-preparation | userTask | Offer preparation | Customer Operations | 16 |
| complete | end | Complete | - | - |

## Mermaid Flow

```mermaid
flowchart TD
  start["Start"] --> validate-intake
  validate-intake["Validate intake"] --> capacity-review
  capacity-review["Capacity review required?"] -->|variables.capacityKw >= 50| technical-review
  capacity-review["Capacity review required?"] -->|default| offer-preparation
  technical-review["Technical review"] --> offer-preparation
  offer-preparation["Offer preparation"] --> complete
```

## Validation Summary

- Errors: none
- Warnings: none
