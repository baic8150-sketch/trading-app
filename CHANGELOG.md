# Changelog

## [0.2.0] - 2026-06-14

### 新增功能 / New Features

- **初始资金设置 / Initial Balance Setting**
  - Dashboard 页面新增 "Account Settings" 区块，提供初始资金输入框
  - 用户可输入任意金额并点击 Save 保存，数值持久化到 localStorage
  - Dashboard page now has an "Account Settings" section with an initial balance input
  - Value is saved to localStorage and survives page refreshes

- **重置账户 / Reset Account**
  - 新增 "Reset Account" 按钮，点击前弹出确认框防止误触
  - 确认后清空持仓、均价、交易记录，并将余额恢复为设定的初始资金
  - Added a "Reset Account" button with a confirmation dialog to prevent accidental resets
  - On confirm: clears position, average price, trade logs, and restores balance to the saved initial amount

- **Markets 页面实时行情 / Live Markets Data**
  - Markets 页面从 Binance API 拉取 BTC/ETH/BNB/SOL/DOGE 实时价格和 24h 涨跌幅，每 5 秒刷新
  - Markets page fetches live price and 24h change for BTC/ETH/BNB/SOL/DOGE from Binance, refreshing every 5 seconds

- **Trading 页面增强 / Trading Page Enhancements**
  - 交易状态（余额、持仓、均价、交易记录）提升至 App 层统一管理
  - 新增持仓均价（Avg Price）、持仓市值（Value）和未实现盈亏（PnL）显示
  - Trading state (balance, position, avg price, logs) lifted to App for cross-page consistency
  - Added Avg Price, position Value, and unrealized PnL display in the trading panel

- **Portfolio 页面 / Portfolio Page**
  - 展示实时现金余额、BTC 持仓数量及市值、当前 BTC 价格、总资产
  - Displays live cash balance, BTC holdings and market value, current BTC price, and total assets

- **数据持久化 / Data Persistence**
  - balance、position、avgPrice、logs、initialBalance 全部持久化到 localStorage，刷新页面数据不丢失
  - balance, position, avgPrice, logs, and initialBalance are all persisted to localStorage across page reloads

### 修复 / Bug Fixes

- **Dashboard BTC Price 显示 Loading / Dashboard BTC Price stuck on "Loading..."**
  - 之前 Dashboard 的 BTC Price 卡片是硬编码字符串，从不更新
  - 现在接收 App 层的实时 price prop，与 Trading 页面数据来源一致
  - The BTC Price card was hardcoded and never updated; now receives the live `price` prop from App

- **Dashboard Total Balance 显示固定值 / Dashboard Total Balance showed hardcoded value**
  - 之前显示固定的 "10,000 USDT"，现在显示真实余额
  - Previously showed a hardcoded "10,000 USDT"; now reflects the actual real-time balance

---

## [0.1.0] - Initial Commit

- 项目初始化，基础框架搭建（Sidebar 导航、Trading 页面 K 线图、BTC 实时价格）
- Initial project setup: sidebar navigation, Trading page with candlestick chart, live BTC price ticker
