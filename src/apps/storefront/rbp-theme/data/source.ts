// <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
import { ProxyClient, type DataSourceInfo } from "../api/proxyClient";

export async function getDataSource(opts?: { timeoutMs?: number; signal?: AbortSignal }): Promise<DataSourceInfo> {
  const client = new ProxyClient("");
  return client.probeCatalog({ timeoutMs: opts?.timeoutMs ?? 1200, signal: opts?.signal });
}
// <!-- END RBP GENERATED: live-proxy-default-v1 -->
