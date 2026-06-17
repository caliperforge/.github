# CaliperForge

**Verifiable, auditable, correctable.**

AI research studio specializing in security & invariants.  ·  [**caliperforge.com**](https://caliperforge.com)

CaliperForge researches autonomous systems you can verify, audit, and correct.
Every shipped harness carries a clean reference where the invariant holds, a
planted-bug twin where it fires, and a CI-asserted record of what our own
gates caught. The receipts are the proof, not a claim — see
[**what we caught**](https://caliperforge.com/what-we-caught).

AI involvement is disclosed at point of use; full policy at
[caliperforge.com/ai-disclosure](https://caliperforge.com/ai-disclosure)
and in [./AI_DISCLOSURE.md](./AI_DISCLOSURE.md).

## How we work

One operator (Michael Moffett, named below) orchestrates a small team of
specialized AI agents — an audit engineer, a Cairo specialist, a Rust /
Anchor specialist, a grant writer, a content reviewer, and others as the
work calls for them. Each agent is scoped, has a defined output discipline,
and cross-checks the others before anything leaves the workspace. The
operator reviews every load-bearing decision, runs cold-environment
reproductions, and ships under his own name as operator-of-record.

Specialization velocity is the working pattern: a new chain, a new VM, a
new specialist and a CI-verified tool with it, in days rather than months.
Cairo (snforge) → Solana / Anchor (on Asymmetric Research's Crucible) was
roughly one working session. The engine is domain-general; the current
portfolio is protocol and smart-contract security.

## What we ship now

- **`invariant-atlas`** — the Exploit→Invariant Atlas: six historical
  DeFi exploits across four VMs (Cairo, Move/Sui, Solana, EVM), each
  reconstructed as a same-source clean / planted twin where an
  invariant property *would have* caught the bug class in pre-deploy
  CI. First cross-VM, defender-side, pre-deploy CI benchmark of this
  shape; clean passes / planted fires, both asserted on every push.
  Apache-2.0. See
  [caliperforge/invariant-atlas](https://github.com/caliperforge/invariant-atlas).

- **`cf-invariants`** — AI-suggested stateful invariant testing for
  Cairo 2.x on top of snforge. **Twelve** reference contracts deployed
  and Voyager-verified on Starknet Sepolia. Apache-2.0. See
  [caliperforge/cf-invariants](https://github.com/caliperforge/cf-invariants).
- **`cf-invariants-anchor`** — invariant-authoring layer on top of
  Crucible (Asymmetric Research's coverage-guided Solana fuzzer) for
  Solana / Anchor programs. Stateful invariants and AI-suggested
  invariants tagged in source; CI runs a clean / planted-bug twin
  every push.
- **`chimera-template-pack`** — reusable Foundry + Recon Chimera
  scaffold for EVM build-to-win contest entries.
- **`hyperevm-safety`** — open-source library of invariants and
  CI-runnable property tests for HyperEVM lending protocols that
  consume HyperCore oracle reads. Six HyperCore-boundary invariants
  in v0.1 (oracle staleness, mark / oracle deviation, szDecimals
  round-trip, precompile gas DoS, CoreWriter solvency window,
  Chainlink-compat invariant catching adapters that defeat
  staleness). All six run as CI-runnable property tests against a
  clean reference under fuzz. Three fire `INVARIANT VIOLATED` on the
  same CI run — the szDecimals round-trip (D-3) and Chainlink-compat
  (D-6) planted twins, and the JELLY (Mar 2025) mark-price
  manipulation reproduction (covering oracle staleness and mark /
  oracle deviation, D-1/D-2) against a minimal lending-market
  reference. Precompile gas DoS (D-4) and CoreWriter solvency window
  (D-5) carry inline broken-reference tests demonstrating the bug
  class deterministically. Built on `hyper-evm-lib` and the
  CaliperForge `chimera-template-pack`. Apache-2.0. See
  [caliperforge/hyperevm-safety](https://github.com/caliperforge/hyperevm-safety).
- **`cf-invariants-verus-bridge-conservation`** — CI-verified reference
  for the cross-side conservation invariant class in lock/mint bridges,
  anchored on the Verus–Ethereum bridge exploit of 2026-05-18 (reported
  losses USD 11.58M, per Halborn). The conservation rule existed in
  prose; this repo lifts it to a one-line property:
  `sum_locked_eth − sum_released_eth == sum_minted_verus − sum_burned_verus`.
  Clean reference holds (0 violations); planted-bug twin breaks it
  (counterexample emitted; `invariants_violated: 1` on the scorecard).
  CI matrix asserts both outcomes on every push. Not an audit; not a
  forensic report. Chimera-pattern harness (Recon Chimera + Foundry,
  Echidna), tracking the CaliperForge `chimera-template-pack` pinning.
  Apache-2.0. See
  [caliperforge/cf-invariants-verus-bridge-conservation](https://github.com/caliperforge/cf-invariants-verus-bridge-conservation).
- **`cf-invariants-jito`**, **`cf-invariants-jito-tippayment`**, and
  **`cf-invariants-jito-priorityfee`** — invariant harnesses for
  Jito tip-distribution, tip-payment, and priority-fee-distribution
  programs on Crucible. Sibling artifacts.
- **`cf-invariants-pyth`** — invariant-fuzzing harness for the Pyth
  Solana Receiver, run on Crucible. Ports the upstream program from
  `anchor-lang` 0.32.1 to 1.0.1; two invariant classes against a clean
  reference and planted-bug twins, asserted on every push. Apache-2.0.
  See [caliperforge/cf-invariants-pyth](https://github.com/caliperforge/cf-invariants-pyth).

## Receipts

- **12** Cairo contracts Voyager-verified
- **5** Solana programs CI-green (Jito tip-distribution; Jito
  tip-payment; Jito priority-fee-distribution; Pyth Solana Receiver;
  Anchor reference)
- **1** operator of record

What our own gates caught — published with provenance — at
[caliperforge.com/what-we-caught](https://caliperforge.com/what-we-caught).

## Capabilities

- **Active language coverage:** Cairo, Rust / Anchor, Solidity, Move,
  TypeScript.
- **Active chains:** Starknet, Solana, Sui, Base, Optimism Superchain,
  HyperEVM.
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
