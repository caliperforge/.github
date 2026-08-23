# CaliperForge

**Verifiable, auditable, correctable.**

AI research studio specializing in security & invariants.  ·  [**caliperforge.com**](https://caliperforge.com)

CaliperForge researches autonomous systems you can verify, audit, and correct. Every shipped harness carries a clean reference where the invariant holds, a planted-bug twin where it fires, and a CI-asserted record of what our own gates caught. The receipts are the proof. See [**what we caught**](https://caliperforge.com/what-we-caught).

AI involvement is disclosed at point of use; full policy at [caliperforge.com/ai-disclosure](https://caliperforge.com/ai-disclosure).

## How we work

One operator (Michael Moffett, named below) orchestrates a small team of specialized AI agents: a Rust / Anchor specialist, an audit engineer, a content reviewer, and others as the work calls for them. Each agent is scoped, has a defined output discipline, and cross-checks the others before anything leaves the workspace. The operator reviews every load-bearing decision, runs cold-environment reproductions, and ships under his own name as operator-of-record.

Specialization velocity is the working pattern: a new chain, a new VM, a new specialist and a CI-verified tool with it, in days rather than months. Solana / Anchor on Asymmetric Research's Crucible is the current lane: four third-party programs ported onto shared rails, each on its own repo with its own CI, the fourth CI-green within 48 hours of the first. The current portfolio is protocol and smart-contract security.

## What we ship

Pinned below, Solana first. Everything else is on the [repository list](https://github.com/orgs/caliperforge/repositories).

- **`cf-invariants`** — the AI invariant-author for Crucible and Trident on Solana / Anchor. A sidecar to the ecosystem's fuzzers, not a new one.
- **`solana-invariant-atlas`** — recurring Solana bug classes as clean / planted twin pairs on real programs, multi-seed reachability certified in CI.
- **`x402-regression-base`** — planted-twin regression harness for the x402 agentic-payments settlement threat model. Reference facilitator deployed and exercised on Base mainnet and Sepolia; receipts in `docs/basescan/`.
- **`uniswap-v4-invariants`** — defender-side invariant harness for Uniswap v4 hooks, on real v4-core.
- **`invariant-atlas`** — six historical DeFi exploits across four VMs, each reconstructed as a same-source clean / planted twin. Defender-side, pre-deploy.
- **`cf-modeleval`** — planted-twin discrimination-power harness for AI safety properties, across three providers.

## Receipts

- **5** Solana programs CI-green: Jito tip-distribution, tip-payment, priority-fee-distribution, the Pyth Solana Receiver, and an Anchor reference
- **4** VMs covered by the cross-VM exploit atlas
- **1** operator of record

What our own gates caught, published with provenance, at [caliperforge.com/what-we-caught](https://caliperforge.com/what-we-caught).

## Capabilities

- **Active chains:** Solana, Ethereum / EVM, Base.
- **Languages:** Rust / Anchor, Solidity, Cairo.
- **What we author:** stateful-invariant suites, AI-suggested invariants tagged in source, CI-verified clean / planted-bug reference examples, security tooling on top of incumbent fuzzers (Crucible, Trident, snforge).
- **What we don't claim:** coverage parity or superiority with the underlying fuzzing engines. We author the layer above them.

## Operator of record

Operated by **Michael Moffett**, accountable for every commit, PR, grant application, and bounty claim made under this org.

- Direct: michael@caliperforge.com
- Web: [caliperforge.com](https://caliperforge.com)
- X: [@caliperforge](https://x.com/caliperforge) · Farcaster: [@caliperforge](https://farcaster.xyz/caliperforge) · Telegram: [@caliperforge](https://t.me/caliperforge)
- ENS: caliperforge.eth

## Contact

For grant collaboration, hired-gun engagements, security tooling inquiries, or contribution questions: **michael@caliperforge.com**.
