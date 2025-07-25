import * as meetingBaas from '@/server/meetingbaas';
import { experimental_createMCPClient as createMCPClient } from 'ai';

// Meeting BaaS environment header for MCP servers. For lower environments, it would be something like pre-prod-
// It would be empty for prod.
// It determines which API server will the MCP client connect to.
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || '';

// Keep track of active clients
type MCPClientType = Awaited<ReturnType<typeof createMCPClient>>;
let publicClient: MCPClientType | null = null;
let privateClient: MCPClientType | null = null;
let speakingClient: MCPClientType | null = null;
let docsClient: MCPClientType | null = null;

export async function getMCPTools() {
  const baasSession = await meetingBaas.auth();
  if (!baasSession?.jwt || !baasSession?.apiKey) {
    console.error('Failed to get auth credentials - missing JWT or API key');
    return {
      publicTools: {},
      privateTools: {},
      speakingTools: {},
      docsTools: {},
      allTools: {},
    };
  }

  let publicTools = {};
  let privateTools = {};
  let speakingTools = {};
  let docsTools = {};

  try {
    if (!privateClient) {
      privateClient = await createMCPClient({
        transport: {
          type: 'sse',
          url: `https://mcp-private.meetingbaas.com/sse`,
          headers: {
            Cookie: `jwt=${baasSession.jwt}`,
            'x-environment': environment,
          },
        },
        onUncaughtError: (error) => {
          console.error('Private MCP Client error:', error);
          privateClient = null;
        },
      });
    }

    if (privateClient) {
      privateTools = await privateClient.tools();
    }
  } catch (error) {
    console.error('Failed to connect to private MCP endpoint:', error);
    privateClient = null;
  }

  try {
    if (!publicClient) {
      publicClient = await createMCPClient({
        transport: {
          type: 'sse',
          url: `https://mcp.meetingbaas.com/sse`,
          headers: {
            'x-meeting-baas-api-key': baasSession.apiKey,
            'x-environment': environment,
          },
        },
        onUncaughtError: (error) => {
          console.error('Public MCP Client error:', error);
          publicClient = null;
        },
      });
    }

    if (publicClient) {
      publicTools = await publicClient.tools();
    }
  } catch (error) {
    console.error('Failed to connect to public MCP endpoint:', error);
    publicClient = null;
  }

  try {
    if (!speakingClient) {
      speakingClient = await createMCPClient({
        transport: {
          type: 'sse',
          url: `https://speaking-mcp.meetingbaas.com/sse`,
          headers: {
            'x-meeting-baas-api-key': baasSession.apiKey,
            'x-environment': environment,
          },
        },
        onUncaughtError: (error) => {
          console.error('Speaking MCP Client error:', error);
          speakingClient = null;
        },
      });
    }

    if (speakingClient) {
      speakingTools = await speakingClient.tools();
    }
  } catch (error) {
    console.error('Failed to connect to speaking MCP endpoint:', error);
    speakingClient = null;
  }

  try {
    if (!docsClient) {
      docsClient = await createMCPClient({
        transport: {
          type: 'sse',
          url: 'https://mcp-documentation.meetingbaas.com/sse', // No environment parameter needed for docs MCP server because it doesn't use the API server
          headers: {
            'x-environment': environment,
          },
        },
        onUncaughtError: (error) => {
          console.error('Docs MCP Client error:', error);
          docsClient = null;
        },
      });
    }

    if (docsClient) {
      docsTools = await docsClient.tools();
    }
  } catch (error) {
    console.error('Failed to connect to docs MCP endpoint:', error);
    docsClient = null;
  }

  return {
    publicTools,
    privateTools,
    speakingTools,
    docsTools,
    allTools: {
      ...publicTools,
      ...privateTools,
      ...speakingTools,
      ...docsTools,
    },
  };
}

export async function closeMCPClients() {
  if (publicClient) {
    await publicClient.close();
    publicClient = null;
  }
  if (privateClient) {
    await privateClient.close();
    privateClient = null;
  }
  if (speakingClient) {
    await speakingClient.close();
    speakingClient = null;
  }
  if (docsClient) {
    await docsClient.close();
    docsClient = null;
  }
}
