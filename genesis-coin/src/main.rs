use genesis_coin::Economy;
use std::env;
use std::path::PathBuf;

fn data_dir() -> PathBuf {
    let dir = env::var("GENESIS_DATA").unwrap_or_else(|_| "./data".to_string());
    PathBuf::from(dir)
}

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();

    if args.is_empty() {
        print_help();
        return;
    }

    let mut economy = Economy::new(data_dir());

    match args[0].as_str() {
        "credit" => {
            if args.len() < 3 {
                eprintln!("Usage: genesis-coin credit <wallet> <amount> [detail]");
                std::process::exit(1);
            }
            let wallet = &args[1];
            let amount: i64 = args[2].parse().unwrap_or_else(|_| {
                eprintln!("Amount must be a number");
                std::process::exit(1);
            });
            let detail = args.get(3).map(|s| s.as_str()).unwrap_or("cli credit");
            let balance = economy.credit(wallet, amount, detail);
            println!("{} +{} → balance: {}", wallet, amount, balance);
        }

        "spend" => {
            if args.len() < 3 {
                eprintln!("Usage: genesis-coin spend <wallet> <action> [detail]");
                std::process::exit(1);
            }
            let wallet = &args[1];
            let action = &args[2];
            let detail = args.get(3).map(|s| s.as_str()).unwrap_or("cli spend");
            match economy.spend(wallet, action, detail) {
                Ok(balance) => println!("{} spent on '{}' → balance: {}", wallet, action, balance),
                Err(e) => { eprintln!("Error: {}", e); std::process::exit(1); }
            }
        }

        "transfer" => {
            if args.len() < 4 {
                eprintln!("Usage: genesis-coin transfer <from> <to> <amount> [detail]");
                std::process::exit(1);
            }
            let from = &args[1];
            let to = &args[2];
            let amount: i64 = args[3].parse().unwrap_or_else(|_| {
                eprintln!("Amount must be a number");
                std::process::exit(1);
            });
            let detail = args.get(4).map(|s| s.as_str()).unwrap_or("cli transfer");
            match economy.transfer(from, to, amount, detail) {
                Ok(()) => {
                    let fb = economy.balance(from).unwrap_or(0);
                    let tb = economy.balance(to).unwrap_or(0);
                    println!("{} → {} ({} coins) | {}: {} | {}: {}", from, to, amount, from, fb, to, tb);
                }
                Err(e) => { eprintln!("Error: {}", e); std::process::exit(1); }
            }
        }

        "balance" => {
            if args.len() < 2 {
                eprintln!("Usage: genesis-coin balance <wallet>");
                std::process::exit(1);
            }
            match economy.balance(&args[1]) {
                Some(b) => println!("{}: {}", args[1], b),
                None => { eprintln!("Wallet '{}' not found", args[1]); std::process::exit(1); }
            }
        }

        "wallets" => {
            let mut wallets = economy.all_wallets();
            wallets.sort_by(|a, b| b.balance.cmp(&a.balance));
            if wallets.is_empty() {
                println!("No wallets yet.");
            } else {
                println!("{:<20} {:>10} {:>10} {:>10}", "WALLET", "BALANCE", "EARNED", "SPENT");
                println!("{}", "-".repeat(54));
                for w in wallets {
                    println!("{:<20} {:>10} {:>10} {:>10}", w.id, w.balance, w.total_earned, w.total_spent);
                }
            }
        }

        "costs" => {
            let costs = economy.all_costs();
            if costs.is_empty() {
                println!("No actions defined yet.");
            } else {
                println!("{:<30} {:>10}", "ACTION", "COST");
                println!("{}", "-".repeat(42));
                let mut sorted: Vec<_> = costs.iter().collect();
                sorted.sort_by_key(|(_, c)| *c);
                for (action, cost) in sorted {
                    println!("{:<30} {:>10}", action, cost);
                }
            }
        }

        "set-cost" => {
            if args.len() < 3 {
                eprintln!("Usage: genesis-coin set-cost <action> <cost>");
                std::process::exit(1);
            }
            let action = &args[1];
            let cost: i64 = args[2].parse().unwrap_or_else(|_| {
                eprintln!("Cost must be a number");
                std::process::exit(1);
            });
            economy.set_cost(action, cost);
            println!("'{}' now costs {} coins", action, cost);
        }

        "history" => {
            let wallet = args.get(1).map(|s| s.as_str()).unwrap_or("");
            let limit: usize = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(20);
            let entries = economy.ledger(wallet, limit);
            if entries.is_empty() {
                println!("No history.");
            } else {
                for e in entries {
                    let sign = if e.amount >= 0 { "+" } else { "" };
                    println!("[{}] {:<15} {:>6}{:<6} bal:{:<6} {}",
                        e.wallet_id, e.action, sign, e.amount, e.balance_after, e.detail);
                }
            }
        }

        "help" | "--help" | "-h" => print_help(),

        other => {
            eprintln!("Unknown command: {}", other);
            print_help();
            std::process::exit(1);
        }
    }
}

fn print_help() {
    println!("Genesis Coin — action economy CLI");
    println!();
    println!("USAGE:");
    println!("  genesis-coin <command> [args...]");
    println!();
    println!("COMMANDS:");
    println!("  credit   <wallet> <amount> [detail]    Add coins to a wallet");
    println!("  spend    <wallet> <action> [detail]    Spend coins on an action");
    println!("  transfer <from> <to> <amount> [detail] Move coins between wallets");
    println!("  balance  <wallet>                      Check a wallet's balance");
    println!("  wallets                                List all wallets");
    println!("  set-cost <action> <cost>               Define what an action costs");
    println!("  costs                                  List all action costs");
    println!("  history  [wallet] [limit]              Show transaction history");
    println!("  help                                   Show this help");
    println!();
    println!("ENVIRONMENT:");
    println!("  GENESIS_DATA    Data directory (default: ./data)");
}
