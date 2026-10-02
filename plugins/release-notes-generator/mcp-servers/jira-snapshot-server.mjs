#!/usr/bin/env node
/**
 * jira-snapshot-server.mjs
 *
 * A minimal MCP server that serves a locally bundled snapshot of real
 * Jira ticket data — avoiding a live OAuth connection to Atlassian's
 * cloud MCP server, which can be unreliable in some environments.
 * In a production setup, get_jira_tickets would call a live Jira API
 * instead of reading a bundled file.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

const server = new Server(
  { name: "jira-snapshot-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_jira_tickets",
      description:
        "Returns a snapshot of Jira tickets for the KAN project, including key, summary, status, and description for each.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === "get_jira_tickets") {
    const text = fs.readFileSync(
      path.join(DATA_DIR, "kan-tickets-snapshot.json"),
      "utf8"
    );
    return { content: [{ type: "text", text }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
