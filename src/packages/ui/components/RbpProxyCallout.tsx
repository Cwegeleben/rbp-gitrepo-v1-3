// <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
import React from "react";

export type RbpProxyCalloutProps = {
  blocked: boolean;
  usingMock: boolean;
  onToggleMock: (next: boolean) => void;
};

export function RbpProxyCallout({ blocked, usingMock, onToggleMock }: RbpProxyCalloutProps) {
  if (!blocked) return null;
  return (
    <div role="region" aria-label="RBP proxy status" style={{
      border: "1px solid #f5c2c7",
      background: "#f8d7da",
      color: "#58151c",
      padding: 12,
      borderRadius: 6,
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <strong>RBP modules are unavailable in Theme Editor</strong>
      </div>
      <p style={{ marginTop: 8, marginBottom: 8 }}>
        The storefront password can block App Proxy requests. You have two options:
      </p>
      <ul style={{ marginTop: 0 }}>
        <li>
          Open your theme's Share preview, then reload this page to restore proxy access.
        </li>
        <li>
          Toggle mock data to continue building without proxy.
        </li>
      </ul>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <a href="#share-preview" onClick={(e) => e.preventDefault()} aria-label="Learn how to open Share preview">Share preview help</a>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            aria-label="Use mock data"
            checked={usingMock}
            onChange={(e) => onToggleMock(e.currentTarget.checked)}
          />
          Use mock data
        </label>
      </div>
    </div>
  );
}

export default RbpProxyCallout;
// <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
