import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SSHConnectionManager } from "../services/ssh-connection-manager.js";
import { Logger } from "../utils/logger.js";

/**
 * Register execute command tool
 */
export function registerExecuteCommandTool(server: McpServer): void {
  const sshManager = SSHConnectionManager.getInstance();

  server.tool(
    "execute-command",
    "Execute command on connected server and get output result",
    {
      cmdString: z.string().describe("Command to execute"),
      connectionName: z.string().optional().describe("SSH connection name (optional, default is 'default')"),
    },
    async ({ cmdString, connectionName }) => {
      try {
        const result = await sshManager.executeCommand(cmdString, connectionName);
        return {
          content: [{ type: "text", text: result }],
        };
      } catch (error: unknown) {
        const errorMessage = Logger.handleError(error, "Failed to execute command");
        return {
          content: [{ type: "text", text: errorMessage }],
          isError: true,
        };
      }
    }
  );
}
