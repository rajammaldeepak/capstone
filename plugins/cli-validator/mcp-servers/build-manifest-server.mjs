#!/usr/bin/env node
/**
 * build-manifest-server.mjs — zero-dependency MCP server (stdio transport).
 *
 * Speaks the MCP protocol directly (newline-delimited JSON-RPC 2.0), so no
 * npm install is required. Exposes two read-only tools that return the
 * capstone's dummy CLI data, simulating a build-system API.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

const TOOLS = [
  {
    name: "get_build_manifest",
    description:
      "Returns the latest build's raw CLI manifest (JSON): the current, actual state of SwitchOS CLI commands in the newest build.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_reference_guide",
    description:
      "Returns the currently published CLI reference guide (Markdown): the documented state of SwitchOS CLI commands.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

const FILES = {
  get_build_manifest: "latest-build-clis.json",
  get_reference_guide: "reference-guide.md",
};

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function handle(msg) {
  const { id, method, params } = msg;
  const isRequest = id !== undefined && id !== null;

  switch (method) {
    case "initialize":
      return send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: params?.protocolVersion ?? "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "build-manifest-server", version: "1.0.0" },
        },
      });

    case "ping":
      return send({ jsonrpc: "2.0", id, result: {} });

    case "tools/list":
      return send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });

    case "tools/call": {
      const file = FILES[params?.name];
      if (!file) {
        return send({
          jsonrpc: "2.0",
          id,
          error: { code: -32602, message: `Unknown tool: ${params?.name}` },
        });
      }
      try {
        const text = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
        return send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text }] } });
      } catch (err) {
        return send({
          jsonrpc: "2.0",
          id,
          result: {
            isError: true,
            content: [{ type: "text", text: `Could not read ${file}: ${err.message}` }],
          },
        });
      }
    }

    default:
      // Notifications (e.g. notifications/initialized) get no reply.
      if (isRequest) {
        send({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
      }
  }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  if (!line.trim()) return;
  try {
    handle(JSON.parse(line));
  } catch (err) {
    console.error("build-manifest-server: bad message:", err.message);
  }
});
