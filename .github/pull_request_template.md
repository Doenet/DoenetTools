## Summary

<!-- What changed and why. -->

## Deploy safety

- [ ] Every `/api` route whose inputs or outputs changed is in the API contract (not in `apps/api/contract-uncovered.json`)
- [ ] If labelled `api-breaking`: no app build that uses the old shape is still calling it (`infra/README.md`, "Removing an API shape")
- [ ] If labelled `db-migration`: the previous backend keeps working while the migration runs (anything that removes or narrows a table or column waits until the code that stopped using it has been deployed)
