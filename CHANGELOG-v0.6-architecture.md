# v0.6 Architecture Baseline

## Added

- `references/architecture.md` — system layering, runtime composition, component governance.
- `references/style-profiles.md` — neutral, technical, and warm style profiles.
- `schemas/` — initial document/chapter/page/block JSON Schemas for agent-facing page generation.

## Design decision

The registry's provenance metadata remains evidence about component origins; runtime rendering should be controlled by a brand theme plus a style profile. This prevents reference corpora from locking a reusable component to one brand palette.
