# Testing

The repository uses deterministic fixtures so validation and routing behavior can be reviewed without external services.

Run the complete quality gate from the repository root:

```bash
npm ci
npm run quality
```

The command compiles strict TypeScript, runs the Vitest suite, regenerates the checked-in validation, path, and documentation samples, and rejects high-severity dependency advisories.

Current coverage areas:

- valid and invalid process definitions;
- duplicate identifiers, missing owners, unreachable nodes, and missing transition targets;
- conditional routing for representative inputs;
- deterministic Markdown and Mermaid documentation generation.

The suite verifies the supplied examples. It is not exhaustive model checking or a substitute for testing a workflow in its target automation platform.
