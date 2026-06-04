# CaliperForge

**Precision contributions, every chain.**

CaliperForge is an engineering and security agency shipping
invariant-driven, CI-verified tooling — AI-augmented and
human-reviewed, operated and signed by a named human. One operator
orchestrates a small team of specialized AI agents; our edge is
specialization velocity — we stand up a new specialist and ship a
CI-verified tool in days. Current focus is protocol and smart-contract
security.

AI involvement is disclosed at point of use; full policy at
[caliperforge.com/ai-disclosure](https://caliperforge.com/ai-disclosure)
and in [./AI_DISCLOSURE.md](./AI_DISCLOSURE.md).

## How we work

One operator (Michael Moffett, named below) orchestrates a small team
of specialized AI agents — an audit engineer, a Cairo specialist, a
Rust / Anchor specialist, a grant writer, a content reviewer, and
others as the work calls for them. Every specialist is a configured
AI agent with its own scope and review pattern; the operator reviews
every output, runs cold-environment reproductions, and ships under his
own name as operator-of-record.

Specialization velocity is the working pattern. New chain, new VM, new
contest — we stand the specialist up and the CI-verified tool with it,
in days rather than months. Cairo (snforge) to Solana / Anchor (on
Asymmetric Research's Crucible) was roughly one working session. The
engine is domain-general; the current portfolio is protocol and
smart-contract security.

## What we ship now

- **`cf-invariants`** — AI-suggested stateful invariant testing for
  Cairo 2.x on top of snforge. Twelve reference contracts deployed
  and Voyager-verified on Starknet Sepolia (suite expanded 6 → 12 on
  2026-06-04). Apache-2.0. See
  [caliperforge/cf-invariants](https://github.com/caliperforge/cf-invariants).
- **`cf-invariants-anchor`** — invariant-authoring layer on top of
  Crucible (Asymmetric Research's coverage-guided Solana fuzzer) for
  Solana / Anchor programs. Stateful invariants and AI-suggested
  invariants tagged in source; CI runs a clean / planted-bug twin
  every push.
- **`chimera-template-pack`** — reusable Foundry + Recon Chimera
  scaffold for EVM build-to-win contest entries.
- **`cf-invariants-jito`**, **`cf-invariants-jito-tippayment`**, and
  **`cf-invariants-jito-priorityfee`** — invariant harnesses for
  Jito tip-distribution, tip-payment, and priority-fee-distribution
  programs on Crucible. Sibling artifacts.

## Capabilities

- **Active language coverage:** Cairo, Rust / Anchor, Solidity,
  TypeScript.
- **Active chains:** Starknet, Solana, Base, Optimism Superchain.
- **What we author:** stateful-invariant suites, AI-suggested
  invariants tagged in source, CI-verified clean / planted-bug
  reference examples, contest-ready scaffolds, security tooling on
  top of incumbent fuzzers (snforge, Crucible).
- **What we don't claim:** coverage parity or superiority with the
  underlying fuzzing engines. We author the layer above them.

## Operator of record

Operated by **Michael Moffett**, accountable for every commit, PR,
grant application, and bounty claim made under this org. Reachable.
KYC-able. Accountable to a named human.

- Operator: Michael Moffett
- Direct: michael@caliperforge.com
- Team: team@caliperforge.com
- Web: [caliperforge.com](https://caliperforge.com)
- X: [@caliperforge](https://x.com/caliperforge)
- Farcaster: [@caliperforge](https://farcaster.xyz/caliperforge)
- Telegram: [@caliperforge](https://t.me/caliperforge)
- ENS: caliperforge.eth

## Contact

For grant collaboration, hired-gun engagements, security tooling
inquiries, or contribution questions: **team@caliperforge.com**.
