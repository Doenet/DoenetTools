## Summary

<!-- What changed and why. -->

## Deploy safety

- [ ] Every `/api` route whose inputs or outputs changed is in the API contract (not in `apps/api/contract-uncovered.json`)
- [ ] If labelled `api-breaking`: no app build that uses the old shape is still calling it (`infra/README.md`, "Removing an API shape")
- [ ] If labelled `db-destructive`: the code that stopped using the old shape has been deployed
