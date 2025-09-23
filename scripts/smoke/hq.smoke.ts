// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import http from "node:http";

function curl(path: string): Promise<{ status: number; body: string }>{
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "localhost", port: 8083, path, method: "GET" }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (d) => chunks.push(d));
      res.on("end", () => resolve({ status: res.statusCode || 0, body: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("error", reject);
    req.end();
  });
}

(async () => {
  const a = await curl("/healthz");
  if (a.status !== 200) throw new Error("/healthz not 200");
  console.log("/healthz", a.status, a.body.slice(0, 200));
  const b = await curl("/app/doctor");
  console.log("/app/doctor", b.status);
  console.log("OK");
})().catch((e) => { console.error(e); process.exit(1); });
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
