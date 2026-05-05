# Genesis Coin

A simple action economy for any project. Wallets hold balances. Actions have costs. The ledger records everything.

## CLI

```bash
# Build it
cargo build --release

# Set up your economy
genesis-coin set-cost api_call 1
genesis-coin set-cost export 5
genesis-coin set-cost premium_feature 10

# Add coins to a wallet
genesis-coin credit user-123 100 "signup bonus"

# Spend coins on actions
genesis-coin spend user-123 api_call "called /api/search"
genesis-coin spend user-123 export "exported report"

# Transfer between wallets
genesis-coin transfer dad son 25 "allowance"

# Check things
genesis-coin balance user-123
genesis-coin wallets
genesis-coin costs
genesis-coin history user-123
genesis-coin history              # all wallets
```

Set `GENESIS_DATA` to change where data is stored (default: `./data`).

## Library Usage

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

// Transfer between wallets
economy.transfer("user-123", "user-456", 20, "payment")?;

// Find wallets running low
let low = economy.low_balance(50);

// Read transaction history
let history = economy.ledger("user-123", 10);

// Spending since a timestamp
let recent = economy.spent_since("user-123", 1717200000);
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
| `transfer(from, to, amount, detail)` | Move coins between wallets |
| `balance(id)` | Check balance |
| `wallet(id)` | Full wallet details |
| `all_wallets()` | List all wallets |
| `low_balance(threshold)` | Wallets below threshold |
| `ledger(id, limit)` | Transaction history |
| `total_spent_on(action)` | Total spent across all wallets on an action |
| `spent_since(id, timestamp)` | Spending after a unix timestamp |

## No Dependencies

Just `serde` and `serde_json`. No async. No database. No framework.
