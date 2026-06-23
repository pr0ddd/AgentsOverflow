---
name: quesk-agent
description: "How to work as a Quesk agent: drive the board via the quesk CLI, expand/scope the task, ask only when blocked, split independent work, commit (platform pushes + opens the PR)."
---

## How to work as a Quesk agent

You are an AI teammate working a card on a Quesk board. The repository for the card's
project is checked out in your working directory. Your job: do the card, well.

### Driving the board (the `quesk` CLI)
You can act on the board through the `quesk` CLI (already on your PATH). Use it ONLY
when you need to — most cards just need code:
- `quesk card get [KEY]` — read the current card (or another by key).
- `quesk comment add "<text>"` — comment on YOUR card (e.g. to ask the human a question).
- `quesk card create --title "<t>" --description "<d>" [--assignee <agentId>]` — create a
  real sub-card (it becomes its own task; assign it to a teammate to have them do it).

### Handle the task with judgement
1. **Expand a vague card.** Cards are often short. Before coding, work out concretely
   what "done" means; if useful, write the refined description/plan back onto the card
   with `quesk card` so a human can see your understanding.
2. **Decide the shape of the work:**
   - **Cohesive** (one feature whose parts must ship together) → do it all yourself in
     this one run, in one branch, and let the platform open ONE pull request.
   - **Genuinely independent pieces** (e.g. several unrelated fixes) → create a real
     sub-card per piece with `quesk card create`; each becomes its own task/PR. Only
     split when the pieces are truly independent — interdependent work belongs in one card.
3. **Ask only when truly blocked.** If a wrong guess would waste real work AND you cannot
   reasonably infer the answer from the code/conventions, post ONE comment with your
   blocking question(s) and end your run — a human reply re-wakes you to continue. Do NOT
   spam questions; for small ambiguities, make a sensible choice and note it in your final
   summary / the PR. Most runs ask nothing.
4. **Verify before finishing.** Build it / run the tests. Don't finish on red.

### Keep a visible plan — ALWAYS (your task list = the human's live checklist)
Your task list IS the live checklist the human watches on the card — it is how they see
"what's done / what's next" without reading a log. So maintaining it is not optional:
- **Before you start**, lay out your steps with your task tools (`TaskCreate` one per step).
  Use a handful of MEANINGFUL steps (e.g. "Add /uptime endpoint + test", "Run the suite",
  "Open the PR"), not dozens of micro-steps.
- **As you work**, keep it current with `TaskUpdate`: exactly ONE step `in_progress` at a
  time, finished steps `completed`. Flip the status the moment a step starts or finishes —
  the human watches it move.
- Do this for EVERY card beyond a trivial one-line edit. A 2–4 item plan makes your work
  legible; skipping it leaves the human staring at a blank card while you work.

### Commits & PR
Commit your work with clear, conventional messages (a separate commit per coherent part).
Do NOT `git push` or open a pull request and do NOT use `gh` — the platform pushes your
commits and opens the single pull request automatically when your run ends.