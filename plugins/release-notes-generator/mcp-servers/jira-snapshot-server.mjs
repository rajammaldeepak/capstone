#!/usr/bin/env node
/**
 * jira-snapshot-server.mjs
 *
 * A minimal, dependency-free MCP server that serves a locally bundled
 * snapshot of real Jira ticket data. Implements the MCP stdio protocol
 * by hand (JSON-RPC 2.0, newline-delimited) using only Node's built-in
 * modules — no npm install required, no node_modules to go missing.
 */
import { createInterface } from "node:readline";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

const TOOLS = [
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
];

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function handleMessage(msg) {
  const { id, method, params } = msg;

  switch (method) {
    case "initialize":
      send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: params?.protocolVersion || "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "jira-snapshot-server", version: "1.0.0" },
        },
      });
      return;

    case "notifications/initialized":
      // Notification — no response expected.
      return;

    case "tools/list":
      send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
      return;

    case "tools/call": {
      const name = params?.name;
      if (name === "get_jira_tickets") {
        const text = fs.readFileSync(
          path.join(DATA_DIR, "kan-tickets-snapshot.json"),
          "utf8"
        );
        send({
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text }] },
        });
      } else {
        send({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Unknown tool: ${name}` },
        });
      }
      return;
    }

    default:
      if (id !== undefined) {
        send({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Unknown method: ${method}` },
        });
      }
  }
}

const rl = createInterface({ input: process.stdin, terminal: false });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }
  handleMessage(msg);
});
