import type { EndpointConfig, UserSummary } from "../db/types";

export interface GeneratedLink {
  label: string;
  url: string;
}

export function generateVlessLinks(
  user: UserSummary,
  endpoints: EndpointConfig[],
  wsPath: string,
  workerHost: string
): GeneratedLink[] {
  const effectiveEndpoints =
    endpoints.length > 0
      ? endpoints
      : [
          {
            label: "Default Edge",
            address: workerHost,
            port: 443,
            sni: workerHost,
            host: workerHost,
          },
        ];

  return effectiveEndpoints.map((ep) => {
    const address = ep.address || workerHost;
    const port = ep.port || 443;
    const sni = ep.sni || workerHost;
    const host = ep.host || workerHost;
    const remark = `${user.name} [${ep.label}]`;

    const wsPathWithEd = wsPath.includes("ed=")
      ? wsPath
      : wsPath.includes("?")
      ? `${wsPath}&ed=2560`
      : `${wsPath}?ed=2560`;

    const params = new URLSearchParams({
      security: "tls",
      encryption: "none",
      type: "ws",
      headerType: "none",
      host: host,
      path: wsPathWithEd,
      sni: sni,
      fp: "chrome",
    });

    const vlessUrl = `vless://${user.uuid}@${address}:${port}?${params.toString()}#${encodeURIComponent(
      remark
    )}`;

    return {
      label: ep.label,
      url: vlessUrl,
    };
  });
}
