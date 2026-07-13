# Contributing to FIFACoOS

Welcome to the FIFACoOS project! We appreciate your interest in contributing. Whether you are a human developer, a domain expert, or an AI coding assistant, your contributions are crucial to making this platform robust, scalable, and secure.

This document outlines the governance, processes, and standards for contributing to the repository.

========================================================

## Project Philosophy

FIFACoOS is an enterprise-grade platform built with strict architectural guidelines. Our philosophy centers on:
- **Design Before Code:** Architecture drives implementation, not the other way around.
- **Security & Privacy First:** Adherence to robust security models and role-based access control.
- **Simplicity over Complexity:** Striving for clean, maintainable, and pragmatic implementations, especially for the MVP.
- **Documentation as Code:** Living documentation that scales with the codebase.

========================================================

## How to Contribute

### Required Reading

Before writing any code or proposing changes, **every contributor (human or AI)** must read and understand the following core documents:

1. **[PRD](docs/product/PRD.md):** For product requirements and scope.
2. **[Architecture](docs/architecture/ARCHITECTURE.md) (and all related architecture documents):** For system design, AI integration, security, data schema, and API contracts.
3. **[Developer Guide](docs/development/DEVELOPER_GUIDE.md):** For environment setup and development workflows.
4. **[Technology Decisions](docs/planning/TECHNOLOGY_DECISIONS.md):** To understand the chosen tech stack and rationale.
5. **[Implementation Plan](docs/planning/IMPLEMENTATION_PLAN.md):** To align your work with the phased roadmap.

### Repository Structure

- `/docs`: All project documentation, structured by domain (architecture, development, planning, product).
- `/src`: (Future) Source code organized by services and components.
- `/tests`: (Future) Test suites.
- `.github`: (Future) Workflows and issue templates.

========================================================

## Coding Standards

### Git Workflow
We use a feature-branch workflow. All changes must be submitted via Pull Requests (PRs) against the `main` branch.

### Branch Naming
Use descriptive branch names with the following prefixes:
- `feature/` - For new features
- `fix/` - For bug fixes
- `docs/` - For documentation updates
- `refactor/` - For code restructuring without behavioral changes
- `chore/` - For maintenance tasks

Example: `feature/ops-command-dashboard`

### Commit Message Format
We follow conventional commits:
```
<type>(<scope>): <subject>

<body>
```
Types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

### Review Expectations
- All PRs require at least one approval from a designated reviewer.
- Code must pass all automated checks before merging.
- Reviewers will evaluate adherence to architecture, security, and coding standards.

### Testing Requirements
- Comprehensive unit tests are required for all new business logic.
- Integration tests must be provided for cross-service boundaries.
- Adhere to the `TESTING_STRATEGY.md`.

### Accessibility Requirements
- All user interfaces must comply with WCAG 2.1 AA standards.
- Semantic HTML and proper ARIA roles are mandatory.

### Security Requirements
- Ensure strict adherence to `SECURITY.md`.
- No sensitive data (PII, API keys) in logs or source control.
- Validate all inputs and enforce proper authorization checks.

### Documentation Update Rules
- **Frozen documents** (architecture, planning, technology) change only through ADRs or major design revisions.
- **Living documents** (CHANGELOG.md, PHASE_CHECKLISTS.md, README.md, deployment guides) evolve throughout development.
- **Historical documents** (such as audit reports) should be archived or removed from the active documentation set once they've served their purpose.
- If your code changes behavior, the corresponding living documentation must be updated in the same PR.

### ADR Policy
- **Architecture decisions belong in ADRs, not pull requests.**
- If you propose a change to the system's architecture, technology stack, or data model, you must submit an Architecture Decision Record (ADR) in `docs/development/adr/` and gain approval *before* implementation.

========================================================

## AI Contribution Policy

AI coding assistants are treated as first-class contributors in this project. When utilizing or acting as an AI assistant, the following strict rules apply:

1. **AI Must Never Redesign Architecture:** AI assistants must operate strictly within the boundaries of the approved, frozen architecture. They cannot change system design, API contracts, or database schemas without a formal ADR process.
2. **No Unjustified Dependencies:** AI must not introduce new libraries, frameworks, or external dependencies unless explicitly justified and approved by a human lead.
3. **Mandatory Human Review:** All AI-generated output (code, tests, documentation) must be reviewed by a human contributor before merging.
4. **Strict Standard Compliance:** AI-generated code must satisfy all project coding standards, accessibility requirements, and security policies.
5. **Suggestions are Proposals:** AI suggestions are treated as proposals, not authoritative decisions. The human developer remains responsible for the final outcome.

========================================================

## Issue Management

### Feature Requests
Submit feature requests using the standard issue template. They will be evaluated against the PRD and current roadmap.

### Bug Reports
Provide detailed reproduction steps, expected behavior, actual behavior, and environment details.

### Definition of Done
A task is considered "Done" when:
- Code is written and passes all tests.
- Documentation (if applicable) is updated.
- Security and accessibility checks pass.
- PR is reviewed and approved.

### Pull Request Checklist
- [ ] Code follows project standards.
- [ ] Tests added/updated and passing.
- [ ] Documentation updated.
- [ ] Branch is rebased against the latest `main`.
- [ ] Related issues are linked.

========================================================

## Communication Principles

### Professional Conduct
We are committed to providing a welcoming and inspiring community for all. Please maintain a professional, respectful, and constructive tone in all communications, reviews, and discussions. Constructive feedback is encouraged; personal attacks are strictly prohibited.

========================================================

**Architecture decisions belong in ADRs, not pull requests.**
