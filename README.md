# mcp-server-valuation

[![npm version](https://img.shields.io/npm/v/mcp-server-valuation.svg)](https://www.npmjs.com/package/mcp-server-valuation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Protocol-blue)](https://modelcontextprotocol.io)

Model Context Protocol (MCP) server for multi-asset valuation, M&A deal metrics, and enterprise digital asset appraisal.

---

## ⚡ Features & Tools

- **`value_digital_asset`**: Calculates valuation models for digital assets, premium domains, and web properties based on liquid floors and enterprise multiples.
- **`calc_ebitda_multiple`**: Calculates target acquisition value based on annual revenue/EBITDA and industry-standard multiples.

---

## 🚀 Quick Start (Running with AI Clients)

### Claude Desktop Integration

Add this snippet to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "valuation": {
      "command": "npx",
      "args": ["-y", "mcp-server-valuation"]
    }
  }
}
```

### Cursor IDE / Windsurf Integration

Under MCP Settings, add a new stdio transport:
- **Command:** `npx -y mcp-server-valuation`

---

## 📦 Local Installation & Development

```bash
npm install -g mcp-server-valuation
```

Or run directly via stdio:
```bash
npx mcp-server-valuation
```

---

## 📄 License

MIT License. Developed for the global AI agent ecosystem.
