#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";


function valueDigitalAsset(assetName, assetType) {
  const clean = assetName.trim().toLowerCase();
  let baseVal = 2500;
  if (assetType === 'domain') {
    const sld = clean.split('.')[0] || clean;
    if (sld.length <= 4) baseVal = 15000;
    else if (sld.length <= 7) baseVal = 5500;
    if (clean.endsWith('.com')) baseVal *= 1.8;
  } else if (assetType === 'saas') {
    baseVal = 25000;
  } else {
    baseVal = 4000;
  }

  const wholesale = Math.round(baseVal * 0.35);
  const retail = Math.round(baseVal);
  const strategic = Math.round(baseVal * 2.8);

  return {
    asset: clean,
    type: assetType,
    estimated_wholesale_liquid_usd: wholesale,
    estimated_fair_market_usd: retail,
    strategic_enterprise_upside_usd: strategic,
    valuation_model: 'Discounted secondary liquid band + enterprise upside multiplier'
  };
}

function calcMultiples(revenue, ebitda, industry = 'saas') {
  const multiples = {
    saas: { rev: 5.5, ebitda: 20 },
    ecommerce: { rev: 1.5, ebitda: 5 },
    agency: { rev: 1.2, ebitda: 4 },
    content: { rev: 2.5, ebitda: 8 }
  };
  const m = multiples[industry.toLowerCase()] || multiples.saas;
  const revValuation = Math.round(revenue * m.rev);
  const ebitdaValuation = Math.round(ebitda * m.ebitda);

  return {
    industry: industry,
    implied_valuation_by_revenue_usd: revValuation,
    implied_valuation_by_ebitda_usd: ebitdaValuation,
    recommended_deal_range_usd: {
      conservative: Math.min(revValuation, ebitdaValuation),
      aggressive: Math.max(revValuation, ebitdaValuation)
    }
  };
}


const server = new Server(
  {
    name: "mcp-server-valuation",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const TOOLS = [
      {
            "name": "value_digital_asset",
            "description": "Calculates valuation models for digital assets, premium domains, and web properties based on liquid floors and enterprise multiples.",
            "inputSchema": {
                  "type": "object",
                  "properties": {
                        "asset_name": {
                              "type": "string",
                              "description": "Name or identifier of the asset (e.g. cloudcompute.com, saas-tool)"
                        },
                        "asset_type": {
                              "type": "string",
                              "description": "Type: domain, saas, brand, or content_site"
                        }
                  },
                  "required": [
                        "asset_name",
                        "asset_type"
                  ]
            }
      },
      {
            "name": "calc_ebitda_multiple",
            "description": "Calculates target acquisition value based on annual revenue/EBITDA and industry-standard multiples.",
            "inputSchema": {
                  "type": "object",
                  "properties": {
                        "annual_revenue_usd": {
                              "type": "number",
                              "description": "Annual recurring revenue in USD"
                        },
                        "ebitda_usd": {
                              "type": "number",
                              "description": "Earnings before interest, taxes, depreciation in USD"
                        },
                        "industry": {
                              "type": "string",
                              "description": "Industry vertical: saas, ecommerce, agency, content"
                        }
                  },
                  "required": [
                        "annual_revenue_usd",
                        "ebitda_usd"
                  ]
            }
      }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {

    if (name === 'value_digital_asset') {
      const res = valueDigitalAsset(args.asset_name, args.asset_type);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }

    if (name === 'calc_ebitda_multiple') {
      const res = calcMultiples(args.annual_revenue_usd, args.ebitda_usd, args.industry);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Error: ${error.message}` }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  process.exit(1);
});
