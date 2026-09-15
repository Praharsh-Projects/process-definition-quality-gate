# Process Definition Quality Gate

> A TypeScript toolkit for validating, simulating, and documenting process automation definitions before deployment.

## What it does
This project focuses on the quality controls around business process automation. It reads process definitions, validates structure and ownership metadata, simulates routing paths for sample inputs, and generates reviewable documentation that can be used in pull requests or CI/CD checks.

## Why I built it
The runtime part of process automation is only half the story. Real BPA work also needs standards, maintainability, reviewability, and change safety. This repo demonstrates that side by treating process definitions as versioned artefacts that can be validated and documented automatically.

## Core capabilities
- Validate process definitions against a TypeScript schema
- Catch duplicate node ids, missing targets, missing owners, and unreachable nodes
- Simulate business paths for representative inputs
- Generate Markdown plus Mermaid documentation from a definition
- Produce sample reports suitable for CI/CD use

## Tech stack
- TypeScript
- Node.js
- Zod
- Vitest

## Commands
```bash
npm ci
npm run quality
```

## CLI usage
```bash
tsx src/cli.ts validate fixtures/definitions/grid-connection-request.json --report reports/validation-report.md
tsx src/cli.ts simulate fixtures/definitions/grid-connection-request.json --input fixtures/inputs/high-capacity.json --out reports/high-capacity-path.json
tsx src/cli.ts generate-docs fixtures/definitions/grid-connection-request.json --out docs/generated/grid-connection-request.md
```

## Example outputs
- `reports/validation-report.md`
- `reports/high-capacity-path.json`
- `docs/generated/grid-connection-request.md`

## Verification and evidence

`npm run quality` compiles the TypeScript project, runs the deterministic test suite, regenerates the checked-in sample outputs, and applies a high-severity dependency audit. GitHub Actions runs the same frozen-install quality gate for pushes and pull requests.

- Architecture: [`docs/architecture.md`](docs/architecture.md)
- Test scope: [`docs/testing.md`](docs/testing.md)
- Evidence boundaries: [`docs/limitations.md`](docs/limitations.md)

## Limitations
- This repo uses JSON definitions rather than BPMN XML or Flowable models.
- Decision simulation is intentionally narrow and based on example rules.
- It is a portfolio quality gate, not a full enterprise deployment platform.
