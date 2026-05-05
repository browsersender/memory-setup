# Genesis Coin

A simple action economy for any project. Wallets hold balances. Actions have costs. The ledger records everything.

## Usage

```rust
use genesis_coin::Economy;

let mut economy = Economy::new("./data");

// Define what actions cost
economy.set_cost("api_call", 1);
economy.set_cost("export", 5);
economy.set_cost("premium_feature", 10);

// Create a wallet and credit it
economy.credit("user-123", 100, "signup bonus");

// Spend coins on actions
economy.spend("user-123", "api_call", "called /api/search")?;
economy.spend("user-123", "export", "exported report")?;

// Check balance
assert_eq!(economy.balance("user-123"), Some(94));

// Find wallets running low
let low = economy.low_balance(50);

// Read transaction history
let history = economy.ledger("user-123", 10);
```

## Storage

Three files in your data directory:

| File | What |
|------|------|
| `wallets.json` | All wallets with balances |
| `costs.json` | Action cost definitions |
| `ledger.jsonl` | Every transaction, append-only |

Use `Economy::in_memory()` for no persistence (testing, ephemeral use).

## API

| Method | What |
|--------|------|
| `set_cost(action, cost)` | Define what an action costs |
| `create_wallet(id)` | Create a wallet (auto-created on credit too) |
| `credit(id, amount, detail)` | Add coins |
| `spend(id, action, detail)` | Spend coins on a defined action |
| `debit(id, amount, detail)` | Debit arbitrary amount |
| `balance(id)` | Check balance |
| `wallet(id)` | Full wallet details |
| `all_wallets()` | List all wallets |
| `low_balance(threshold)` | Wallets below threshold |
| `ledger(id, limit)` | Transaction history |
| `total_spent_on(action)` | Total spent across all wallets on an action |

## No Dependencies

Just `serde` and `serde_json`. No async. No database. No framework.
