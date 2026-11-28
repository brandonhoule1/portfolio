# Cloudflare Free contact endpoint rate limit

This is a production configuration item for the next approved deployment. It is intentionally not applied by the local code change.

- Rule expression: `http.request.uri.path eq "/api/contact"`
- Counting characteristic: visitor IP address
- Threshold: 5 requests in 10 seconds
- Mitigation: block for 10 seconds
- Plan constraint: the Free rule is path-based and applies to all methods at this path; requests are counted approximately and shared IPs can affect multiple visitors.
- Validation: after configuration, send six invalid requests without a Turnstile token within one 10-second window; confirm the threshold request is blocked and none reaches Gmail. Then wait for the mitigation window and confirm the endpoint becomes reachable again.
