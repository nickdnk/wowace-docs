# CLAUDE.md

Guidance for AI agents editing this repo. Setup, structure, the `apimethod` authoring format and the writing conventions
live in [README.md](README.md); read and follow them. They are not repeated here.

## Prime directive

`Ace3/` (a git submodule) is the authoritative Lua source. Verify every signature, parameter, return, callback and
example against it: **never trust memory or `legacy_docs/`**. Do not edit `Ace3/`.

## Working notes (AI-specific)

- API entries use the `apimethod` macro (format in README → Contributing). Never hand-write a signature; it's generated
  from `name` + `params`.
- Before assuming a page renders, expand it offline with `createMarkdownRenderer` from `vitepress` plus the macro, and
  confirm `<ApiMethod>` tags balance and no raw `apimethod` blocks leak through.
- When auto-linking method/library references, **never** insert links inside code fences or inside string literals (e.g.
  `LibStub("AceEvent-3.0")`); that has broken examples before. Match only prose and `desc` strings.
