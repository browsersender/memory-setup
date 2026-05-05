//! Genesis Coin — a simple action economy.
//!
//! Wallets hold balances. Actions have costs. The ledger records everything.
//! Drop it into any project that needs usage tracking, credit systems, or action budgets.
//!
//! ```rust
//! use genesis_coin::Economy;
//!
//! let mut economy = Economy::new("./data");
//!
//! // Define what actions cost
//! economy.set_cost("api_call", 1);
//! economy.set_cost("export", 5);
//! economy.set_cost("premium_feature", 10);
//!
//! // Create a wallet and credit it
//! economy.create_wallet("user-123");
//! economy.credit("user-123", 100, "signup bonus");
//!
//! // Spend
//! let result = economy.spend("user-123", "api_call", "called /api/search");
//! assert!(result.is_ok());
//! assert_eq!(economy.balance("user-123"), Some(99));
//!
//! // Check the ledger
//! let history = economy.ledger("user-123", 10);
//! assert_eq!(history.len(), 2); // credit + spend
//! ```

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};

// ─── Core Types ─────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Wallet {
    pub id: String,
    pub balance: i64,
    pub total_earned: i64,
    pub total_spent: i64,
    pub created_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LedgerEntry {
    pub wallet_id: String,
    pub action: String,
    pub amount: i64,
    pub balance_after: i64,
    pub detail: String,
    pub timestamp: u64,
}

#[derive(Debug, Clone)]
pub enum SpendError {
    WalletNotFound(String),
    InsufficientBalance { wallet_id: String, balance: i64, cost: i64 },
    UnknownAction(String),
}

impl std::fmt::Display for SpendError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::WalletNotFound(id) => write!(f, "wallet '{}' not found", id),
            Self::InsufficientBalance { wallet_id, balance, cost } =>
                write!(f, "'{}' has {} coins, needs {}", wallet_id, balance, cost),
            Self::UnknownAction(action) => write!(f, "unknown action '{}' — set a cost first", action),
        }
    }
}

impl std::error::Error for SpendError {}

// ─── Economy ────────────────────────────────────────────────

pub struct Economy {
    wallets: HashMap<String, Wallet>,
    costs: HashMap<String, i64>,
    data_dir: PathBuf,
}

impl Economy {
    /// Create a new economy backed by files in `data_dir`.
    /// Loads existing wallets if the directory has data.
    pub fn new<P: AsRef<Path>>(data_dir: P) -> Self {
        let data_dir = data_dir.as_ref().to_path_buf();
        std::fs::create_dir_all(&data_dir).ok();

        let wallets = Self::load_wallets(&data_dir);
        let costs = Self::load_costs(&data_dir);

        Self { wallets, costs, data_dir }
    }

    /// Create an in-memory economy (no persistence).
    pub fn in_memory() -> Self {
        Self {
            wallets: HashMap::new(),
            costs: HashMap::new(),
            data_dir: PathBuf::from(""),
        }
    }

    // ── Action Costs ────────────────────────────────────────

    /// Set the cost for an action. Call this at startup to define your economy.
    pub fn set_cost(&mut self, action: &str, cost: i64) {
        self.costs.insert(action.to_string(), cost);
        self.save_costs();
    }

    /// Get the cost for an action. Returns None if not defined.
    pub fn cost(&self, action: &str) -> Option<i64> {
        self.costs.get(action).copied()
    }

    /// Get all defined action costs.
    pub fn all_costs(&self) -> &HashMap<String, i64> {
        &self.costs
    }

    // ── Wallets ─────────────────────────────────────────────

    /// Create a new wallet. No-op if it already exists.
    pub fn create_wallet(&mut self, id: &str) {
        if !self.wallets.contains_key(id) {
            self.wallets.insert(id.to_string(), Wallet {
                id: id.to_string(),
                balance: 0,
                total_earned: 0,
                total_spent: 0,
                created_at: now(),
            });
            self.save_wallets();
        }
    }

    /// Get a wallet's current balance. None if wallet doesn't exist.
    pub fn balance(&self, id: &str) -> Option<i64> {
        self.wallets.get(id).map(|w| w.balance)
    }

    /// Get a wallet. None if it doesn't exist.
    pub fn wallet(&self, id: &str) -> Option<&Wallet> {
        self.wallets.get(id)
    }

    /// List all wallets.
    pub fn all_wallets(&self) -> Vec<&Wallet> {
        self.wallets.values().collect()
    }

    /// Wallets with balance below threshold.
    pub fn low_balance(&self, threshold: i64) -> Vec<&Wallet> {
        self.wallets.values().filter(|w| w.balance < threshold && w.total_spent > 0).collect()
    }

    // ── Transactions ────────────────────────────────────────

    /// Add coins to a wallet. Creates the wallet if it doesn't exist.
    pub fn credit(&mut self, wallet_id: &str, amount: i64, detail: &str) -> i64 {
        self.create_wallet(wallet_id);

        let balance = {
            let wallet = self.wallets.get_mut(wallet_id).unwrap();
            wallet.balance += amount;
            wallet.total_earned += amount;
            wallet.balance
        };

        self.append_ledger(&LedgerEntry {
            wallet_id: wallet_id.to_string(),
            action: "credit".to_string(),
            amount,
            balance_after: balance,
            detail: detail.to_string(),
            timestamp: now(),
        });

        self.save_wallets();
        balance
    }

    /// Spend coins on an action. Fails if wallet doesn't exist,
    /// action isn't defined, or balance is insufficient.
    pub fn spend(&mut self, wallet_id: &str, action: &str, detail: &str) -> Result<i64, SpendError> {
        let cost = self.costs.get(action).copied()
            .ok_or_else(|| SpendError::UnknownAction(action.to_string()))?;

        let balance = {
            let wallet = self.wallets.get_mut(wallet_id)
                .ok_or_else(|| SpendError::WalletNotFound(wallet_id.to_string()))?;

            if wallet.balance < cost {
                return Err(SpendError::InsufficientBalance {
                    wallet_id: wallet_id.to_string(),
                    balance: wallet.balance,
                    cost,
                });
            }

            wallet.balance -= cost;
            wallet.total_spent += cost;
            wallet.balance
        };

        self.append_ledger(&LedgerEntry {
            wallet_id: wallet_id.to_string(),
            action: action.to_string(),
            amount: -cost,
            balance_after: balance,
            detail: detail.to_string(),
            timestamp: now(),
        });

        self.save_wallets();
        Ok(balance)
    }

    /// Debit an arbitrary amount (not tied to an action cost).
    pub fn debit(&mut self, wallet_id: &str, amount: i64, detail: &str) -> Result<i64, SpendError> {
        let balance = {
            let wallet = self.wallets.get_mut(wallet_id)
                .ok_or_else(|| SpendError::WalletNotFound(wallet_id.to_string()))?;

            if wallet.balance < amount {
                return Err(SpendError::InsufficientBalance {
                    wallet_id: wallet_id.to_string(),
                    balance: wallet.balance,
                    cost: amount,
                });
            }

            wallet.balance -= amount;
            wallet.total_spent += amount;
            wallet.balance
        };

        self.append_ledger(&LedgerEntry {
            wallet_id: wallet_id.to_string(),
            action: "debit".to_string(),
            amount: -amount,
            balance_after: balance,
            detail: detail.to_string(),
            timestamp: now(),
        });

        self.save_wallets();
        Ok(balance)
    }

    // ── Ledger ���─────────────────────────────────────��───────

    /// Read the last N ledger entries for a wallet (or all wallets if empty).
    pub fn ledger(&self, wallet_id: &str, limit: usize) -> Vec<LedgerEntry> {
        let path = self.data_dir.join("ledger.jsonl");
        let content = std::fs::read_to_string(path).unwrap_or_default();

        content.lines().rev()
            .filter_map(|l| serde_json::from_str::<LedgerEntry>(l).ok())
            .filter(|e| wallet_id.is_empty() || e.wallet_id == wallet_id)
            .take(limit)
            .collect()
    }

    /// Total spent across all wallets on a specific action.
    pub fn total_spent_on(&self, action: &str) -> i64 {
        let path = self.data_dir.join("ledger.jsonl");
        let content = std::fs::read_to_string(path).unwrap_or_default();
        content.lines()
            .filter_map(|l| serde_json::from_str::<LedgerEntry>(l).ok())
            .filter(|e| e.action == action && e.amount < 0)
            .map(|e| -e.amount)
            .sum()
    }

    /// All ledger entries for a wallet since a unix timestamp.
    pub fn spent_since(&self, wallet_id: &str, since: u64) -> Vec<LedgerEntry> {
        let path = self.data_dir.join("ledger.jsonl");
        let content = std::fs::read_to_string(path).unwrap_or_default();
        content.lines()
            .filter_map(|l| serde_json::from_str::<LedgerEntry>(l).ok())
            .filter(|e| e.wallet_id == wallet_id && e.timestamp >= since && e.amount < 0)
            .collect()
    }

    /// Transfer coins from one wallet to another.
    pub fn transfer(&mut self, from: &str, to: &str, amount: i64, detail: &str) -> Result<(), SpendError> {
        let from_wallet = self.wallets.get(from)
            .ok_or_else(|| SpendError::WalletNotFound(from.to_string()))?;

        if from_wallet.balance < amount {
            return Err(SpendError::InsufficientBalance {
                wallet_id: from.to_string(),
                balance: from_wallet.balance,
                cost: amount,
            });
        }

        self.create_wallet(to);
        let ts = now();

        let from_balance = {
            let w = self.wallets.get_mut(from).unwrap();
            w.balance -= amount;
            w.total_spent += amount;
            w.balance
        };

        let to_balance = {
            let w = self.wallets.get_mut(to).unwrap();
            w.balance += amount;
            w.total_earned += amount;
            w.balance
        };

        self.append_ledger(&LedgerEntry {
            wallet_id: from.to_string(),
            action: "transfer_out".to_string(),
            amount: -amount,
            balance_after: from_balance,
            detail: format!("→ {}: {}", to, detail),
            timestamp: ts,
        });

        self.append_ledger(&LedgerEntry {
            wallet_id: to.to_string(),
            action: "transfer_in".to_string(),
            amount,
            balance_after: to_balance,
            detail: format!("← {}: {}", from, detail),
            timestamp: ts,
        });

        self.save_wallets();
        Ok(())
    }

    // ── Persistence ─────────────────────────────────────────

    fn save_wallets(&self) {
        if self.data_dir.as_os_str().is_empty() { return; }
        if let Ok(json) = serde_json::to_string_pretty(&self.wallets) {
            std::fs::write(self.data_dir.join("wallets.json"), json).ok();
        }
    }

    fn save_costs(&self) {
        if self.data_dir.as_os_str().is_empty() { return; }
        if let Ok(json) = serde_json::to_string_pretty(&self.costs) {
            std::fs::write(self.data_dir.join("costs.json"), json).ok();
        }
    }

    fn append_ledger(&self, entry: &LedgerEntry) {
        if self.data_dir.as_os_str().is_empty() { return; }
        if let Ok(line) = serde_json::to_string(entry) {
            use std::io::Write;
            if let Ok(mut f) = std::fs::OpenOptions::new()
                .create(true).append(true)
                .open(self.data_dir.join("ledger.jsonl")) {
                let _ = writeln!(f, "{}", line);
            }
        }
    }

    fn load_wallets(dir: &Path) -> HashMap<String, Wallet> {
        std::fs::read_to_string(dir.join("wallets.json"))
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    }

    fn load_costs(dir: &Path) -> HashMap<String, i64> {
        std::fs::read_to_string(dir.join("costs.json"))
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    }
}

fn now() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_economy() {
        let mut e = Economy::in_memory();
        e.set_cost("api_call", 1);
        e.set_cost("export", 5);

        e.create_wallet("user-1");
        assert_eq!(e.balance("user-1"), Some(0));

        e.credit("user-1", 100, "signup bonus");
        assert_eq!(e.balance("user-1"), Some(100));

        let bal = e.spend("user-1", "api_call", "called /search").unwrap();
        assert_eq!(bal, 99);

        let bal = e.spend("user-1", "export", "exported report").unwrap();
        assert_eq!(bal, 94);
    }

    #[test]
    fn test_insufficient_balance() {
        let mut e = Economy::in_memory();
        e.set_cost("expensive", 1000);
        e.create_wallet("broke");
        e.credit("broke", 5, "tiny credit");

        let result = e.spend("broke", "expensive", "can't afford this");
        assert!(result.is_err());
        assert_eq!(e.balance("broke"), Some(5)); // unchanged
    }

    #[test]
    fn test_unknown_action() {
        let mut e = Economy::in_memory();
        e.create_wallet("user");
        e.credit("user", 100, "credit");

        let result = e.spend("user", "nonexistent", "should fail");
        assert!(result.is_err());
    }

    #[test]
    fn test_auto_create_on_credit() {
        let mut e = Economy::in_memory();
        e.credit("new-user", 50, "auto-created");
        assert_eq!(e.balance("new-user"), Some(50));
    }

    #[test]
    fn test_low_balance_alert() {
        let mut e = Economy::in_memory();
        e.set_cost("action", 10);
        e.credit("rich", 1000, "loaded");
        e.credit("poor", 5, "barely anything");
        e.spend("poor", "action", "this should fail").ok();
        e.credit("poor", 20, "more");
        e.spend("poor", "action", "now it works").unwrap();

        let low = e.low_balance(50);
        assert_eq!(low.len(), 1);
        assert_eq!(low[0].id, "poor");
    }

    #[test]
    fn test_transfer() {
        let mut e = Economy::in_memory();
        e.credit("dad", 100, "startup");
        e.credit("son", 10, "startup");

        e.transfer("dad", "son", 25, "allowance").unwrap();
        assert_eq!(e.balance("dad"), Some(75));
        assert_eq!(e.balance("son"), Some(35));
    }

    #[test]
    fn test_transfer_insufficient() {
        let mut e = Economy::in_memory();
        e.credit("sender", 10, "not much");
        e.credit("receiver", 0, "empty");

        let result = e.transfer("sender", "receiver", 50, "too much");
        assert!(result.is_err());
        assert_eq!(e.balance("sender"), Some(10));
    }

    #[test]
    fn test_transfer_creates_recipient() {
        let mut e = Economy::in_memory();
        e.credit("sender", 100, "has coins");

        e.transfer("sender", "new-user", 30, "welcome gift").unwrap();
        assert_eq!(e.balance("sender"), Some(70));
        assert_eq!(e.balance("new-user"), Some(30));
    }

    #[test]
    fn test_debit_arbitrary() {
        let mut e = Economy::in_memory();
        e.credit("user", 100, "start");

        let bal = e.debit("user", 37, "custom charge").unwrap();
        assert_eq!(bal, 63);
    }

    #[test]
    fn test_multiple_actions() {
        let mut e = Economy::in_memory();
        e.set_cost("cheap", 1);
        e.set_cost("medium", 5);
        e.set_cost("expensive", 25);
        e.credit("user", 100, "start");

        e.spend("user", "cheap", "x").unwrap();
        e.spend("user", "cheap", "x").unwrap();
        e.spend("user", "medium", "x").unwrap();
        e.spend("user", "expensive", "x").unwrap();

        assert_eq!(e.balance("user"), Some(68));

        let w = e.wallet("user").unwrap();
        assert_eq!(w.total_spent, 32);
        assert_eq!(w.total_earned, 100);
    }
}
