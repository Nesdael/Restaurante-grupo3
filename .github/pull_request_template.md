<!--
Title format (same as commits, in English):
  <type>(<scope>): <description>
  e.g. feat(tables): add table management module
-->

## Description

<!-- What does this PR do and why? -->

## Related issue

Closes #

User story: HU-

## Type of change

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — code change without behavior change
- [ ] `docs` — documentation
- [ ] `test` — tests
- [ ] `style` — formatting only, no logic changes
- [ ] `chore` — config, dependencies, maintenance

## How to test it

<!-- Steps for the reviewer: endpoint, method, example body, expected response -->

```http

```

1.

## Checklist

- [ ] Branch and commit messages follow the convention in `CONTRIBUTING.md`
- [ ] The project builds with no errors (`npm run build`)
- [ ] `npm run lint` passes with no errors
- [ ] Input data is validated with DTOs and `class-validator`
- [ ] Business logic lives in services, not in controllers
- [ ] Database changes have a versioned TypeORM migration
- [ ] New endpoints are documented in Swagger
- [ ] Added or updated tests and `npm run test` passes
- [ ] `npm run format:check` passes
- [ ] All acceptance criteria of the user story are met
- [ ] `README.md` and `.env.example` updated if needed
- [ ] My branch is up to date with `develop`

## Notes for the reviewer

<!-- Anything worth knowing: decisions taken, pending work, questions -->
