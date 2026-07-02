# Automatic Code Review on GitHub — a tiny working demo

This is a minimal Node.js project that shows how GitHub can **review your code for you, automatically**, every time you open a Pull Request (PR).

Two things happen on each PR, with **zero manual effort**:

1. **CI checks (pass / fail):** GitHub Actions runs your linter, a formatting check, and your tests. You get a ✅ or ❌ on the PR.
2. **Inline review comments:** [Reviewdog](https://github.com/reviewdog/reviewdog) posts ESLint findings as comments **directly on the changed lines** — like a human reviewer, but instant and free.

---

## The big picture

```
You push a branch  ─►  open a Pull Request
                              │
                              ▼
        GitHub Actions runs .github/workflows/ci.yml automatically
                              │
             ┌────────────────┴─────────────────┐
             ▼                                    ▼
   JOB: test (the gate)               JOB: review (Reviewdog)
   lint + format + tests              inline ESLint comments
             │                                    │
      ✅ green / ❌ red                  comments on the PR diff
             │
             ▼
   Branch protection: ❌ red  ➜  merge is BLOCKED until fixed
```

**Key idea:** CI (Continuous Integration) just means _"automatically run scripts whenever code changes."_ On GitHub, you describe those scripts in a YAML file under `.github/workflows/`, and GitHub runs them on a fresh cloud machine for you.

---

## What each file does

| File                       | Role                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| `src/math.js`              | Sample code — the thing being reviewed.                          |
| `test/math.test.js`        | Jest tests. A failing test = ❌, blocking merge.                 |
| `eslint.config.js`         | The **code-quality rules** (ESLint v9 flat config).              |
| `.prettierrc.json`         | The **formatting rules** (Prettier).                             |
| `package.json`             | Defines the `lint`, `format:check`, and `test` commands CI runs. |
| `.github/workflows/ci.yml` | **The automation itself** — what runs, and when.                 |

---

## Run the checks locally (before you even push)

You need [Node.js](https://nodejs.org) (v18+) installed. Then, in this folder:

```bash
npm install        # install the tools (eslint, prettier, jest)
npm test           # run the tests
npm run lint       # run the code-quality review
npm run format:check   # check formatting
npm run format     # auto-fix formatting
```

If all of these pass locally, they'll pass in CI too.

---

## Set it up on GitHub (step by step)

### 1. Put the project on GitHub

```bash
git init
git add .
git commit -m "Initial commit: CI demo"
git branch -M main
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Open a Pull Request and watch the automation run

```bash
git checkout -b my-change
# ...edit a file...
git commit -am "Try a change"
git push -u origin my-change
```

Now open the PR on GitHub (it'll offer a button). Click the **"Checks"** tab on the PR — you'll see the `test` and `review` jobs running automatically. No configuration needed; the workflow file is enough.

### 3. Make the checks _required_ (branch protection)

This is what turns the automation from "nice to have" into "you can't merge broken code":

1. Repo → **Settings** → **Branches** → **Add branch ruleset** (or "Add rule").
2. Target branch: `main`.
3. Enable **"Require status checks to pass before merging"**.
4. Search for and select the **`Lint, format & test`** check.
5. Save.

Now any PR with failing tests or lint errors is **blocked from merging**.

> **Reviewdog needs no setup or account** — it authenticates with the `GITHUB_TOKEN` that GitHub automatically provides to every workflow run.

---

## Want to _see_ the automatic review catch something?

On a branch, introduce a deliberate problem and push it, then open a PR:

- **Trigger a lint comment:** add `const unused = 42;` to `src/math.js` (ESLint's `no-unused-vars` will flag it, and Reviewdog will comment on that exact line).
- **Trigger a test failure:** change `return a + b;` to `return a - b;` in `add()` — the `test` job goes ❌ red.

You'll see the red X and the inline comment appear on the PR within a minute. Fix it, push again, and watch it turn green. That's the whole loop.

---

## Adding an AI reviewer on top of Reviewdog

Reviewdog catches _mechanical_ issues (lint rules). An **AI reviewer** adds
_natural-language_ review — it explains bugs, suggests improvements, and answers
questions in the PR. Here's what's free and what isn't:

| Tool                   | Free?                                         | Setup effort                            |
| ---------------------- | --------------------------------------------- | --------------------------------------- |
| **CodeRabbit**         | ✅ **Free for public repos** (this one is)    | Install a GitHub App (~2 min, no code)  |
| **Claude Code Action** | ❌ Needs an Anthropic API key (pay-per-use)   | Add a workflow + an `ANTHROPIC_API_KEY` |
| **GitHub Copilot**     | ⚠️ Needs a Copilot subscription (mostly paid) | Enable in repo settings                 |

### Option A — CodeRabbit (free, recommended)

The repo already includes a `.coderabbit.yaml` config. To turn it on:

1. Go to **https://coderabbit.ai** and **"Sign up with GitHub"** (free).
2. Authorize it and **install the CodeRabbit GitHub App** on this repository
   (`github-code-reviews-demo`).
3. That's it. Open (or re-open) a PR — CodeRabbit will post a summary and inline
   AI review comments automatically. Nothing to add to your workflows.

> CodeRabbit runs on **their** servers, not GitHub Actions, so it doesn't appear
> as a CI check — it just comments on the PR alongside Reviewdog.

### Option B — Claude Code Action (paid, most capable)

Free the _action_ is; the API usage it consumes is not. If you have an
[Anthropic API key](https://console.anthropic.com):

1. Repo → **Settings → Secrets and variables → Actions → New repository secret**,
   name it `ANTHROPIC_API_KEY`.
2. Add `.github/workflows/claude-review.yml`:

   ```yaml
   name: Claude Review
   on:
     pull_request:
   permissions:
     contents: read
     pull-requests: write
   jobs:
     claude:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: anthropics/claude-code-action@v1
           with:
             anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
             prompt: 'Review this PR for bugs and clarity. Leave inline comments.'
   ```

---

## Where to go next

- **More checks:** type-checking (TypeScript), security scanning (`npm audit`, CodeQL), test coverage thresholds.
- **Matrix builds:** run the `test` job across multiple Node versions or operating systems.
