# Vendored SCORM 2004 4th Edition schemas

The official XML Schemas that `imsmanifest.xml` declares in its
`xsi:schemaLocation`. They exist here so `test/manifest.test.js` can validate a
built manifest against the real schemas offline — see `../test/README.md`.

**These are reference data, not code. Do not edit them.** If a manifest fails
validation, the manifest is wrong.

- Origin: ADL's SCORM 2004 4th Edition content packaging schema set, as
  published with the specification.
- Obtained from: the `simple-scorm-packager` npm package (MIT), which
  redistributes them at `lib/schemas/definitionFiles/scorm20044thedition/`.
  Copied 2026-08-17. Only the `.xsd` files are kept; the DTDs it also ships are
  not needed to validate a manifest.
- Copyright: IMS Global Learning Consortium (now 1EdTech) for the `imscp_*` and
  `imsss_*` files, ADL for the `adlcp_*` / `adlseq_*` / `adlnav_*` extensions,
  W3C for `xml.xsd`. The files carry copyright notices but no accompanying
  licence text. They are published for exactly this purpose — a conformant
  SCORM package may ship them at its root, and every SCORM tool redistributes
  them — so this is ordinary use rather than a grey area, but it is worth
  knowing that the grant is by convention and not by an explicit licence file.
- Not shipped in built packages, even though `imsmanifest.xml` names them in
  its `xsi:schemaLocation`. Players resolve the namespaces themselves rather
  than fetching that path, so this has not caused a problem — but a SCORM
  content package traditionally does carry its control documents at the root,
  and a strict validator may expect them. Adding all 15 files would cost ~88 KB
  per package. Open question, not a settled decision.

`imscp_v1p1.xsd` is the entry point; the rest are reached through its imports
and through the ADL extension namespaces, so all of them have to be present for
validation to resolve.
