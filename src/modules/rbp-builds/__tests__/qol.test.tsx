// <!-- BEGIN RBP GENERATED: BuildsQoL -->
import { duplicateBuild, reorderItems, clearBuild, exportBuildJson, importBuildFromJson, isQoLEnabled } from "../0.2.0/actions";

jest.mock("../../../shared/sdk/client", () => ({
  apiSend: jest.fn(),
  apiGet: jest.fn().mockResolvedValue({ flags: { "builds.qol.v1": true } })
}));

const { apiSend, apiGet } = require("../../../shared/sdk/client");

describe("Builds QoL actions", () => {
  const base = { id: "b1", title: "Demo", handle: "demo", items: [ { label: "Seat", quantity: 1 }, { label: "Guides", quantity: 2 } ] };

  beforeEach(() => { jest.resetAllMocks(); apiGet.mockResolvedValue({ flags: { "builds.qol.v1": true } }); });

  test("flag gating", async () => {
    expect(isQoLEnabled({ flags: { "builds.qol.v1": true } })).toBe(true);
    expect(isQoLEnabled({ flags: { } })).toBe(false);
  });

  test("duplicate switches active on success", async () => {
    apiSend.mockResolvedValue({ id: "b2" });
    let active = ""; const setActive = (id:string)=>{ active = id; };
    const res = await duplicateBuild(base, { toast: ()=>{}, setActiveBuild: setActive, refresh: ()=>{} });
    expect(res.ok).toBe(true);
    expect(active).toBe("b2");
  });

  test("duplicate error shows failure", async () => {
    apiSend.mockRejectedValue(new Error("500"));
    const res = await duplicateBuild(base, { toast: ()=>{}, setActiveBuild: ()=>{}, refresh: ()=>{} });
    expect(res.ok).toBe(false);
  });

  test("reorder optimistic + rollback on error", async () => {
    // First call rejects to force rollback
    apiSend.mockRejectedValueOnce(new Error("500"));
    let itemsLocal: any[]|null = null;
    let rolledBack = false;
    const r1 = await reorderItems(base, 1, 'up', { toast: ()=>{}, onLocalUpdate: (its)=>itemsLocal=its, onRollback: ()=>{ rolledBack = true; itemsLocal=null; }, refresh: ()=>{} });
    expect(r1.ok).toBe(false);
    expect(rolledBack).toBe(true);

  // Then succeed
  apiSend.mockResolvedValueOnce({});
  const b = { ...base };
  const r2 = await reorderItems(b, 1, 'up', { toast: ()=>{}, onLocalUpdate: (its: any[])=>itemsLocal=its, onRollback: ()=>{}, refresh: ()=>{} });
  expect(r2.ok).toBe(true);
  expect((itemsLocal as any)?.[0].label).toBe("Guides");
  });

  test("clear confirm + empty on success", async () => {
    apiSend.mockResolvedValue({});
    let itemsLocal: any[]|null = null; let rolledBack=false;
    const res = await clearBuild(base, { toast: ()=>{}, onLocalUpdate: (its)=>itemsLocal=its, onRollback: ()=>{rolledBack=true;}, refresh: ()=>{}, confirm: ()=>true });
    expect(res.ok).toBe(true);
    expect(itemsLocal).toEqual([]);
    expect(rolledBack).toBe(false);
  });

  test("export triggers download callback", () => {
    let saved: { name: string; data: string }|null = null;
  exportBuildJson(base, { toast: ()=>{}, download: (filename: string, data: string)=>{ saved = { name: filename, data }; } });
  expect((saved as any)?.name).toBe("demo.json");
  const parsed = JSON.parse((saved as any)!.data);
    expect(parsed.id).toBe("b1");
    expect(Array.isArray(parsed.items)).toBe(true);
  });

  test("import validates and creates", async () => {
    apiSend.mockResolvedValue({ id: "b3" });
    let active = ""; const set = (id:string)=>active=id;
    const text = JSON.stringify({ name: "X", items: [{ label: "Seat", quantity:1 }] });
    const res = await importBuildFromJson(text, { toast: ()=>{}, setActiveBuild: set, refresh: ()=>{} });
    expect(res.ok).toBe(true);
    expect(active).toBe("b3");
  });

  test("import invalid json fails", async () => {
    const res = await importBuildFromJson("not-json", { toast: ()=>{}, setActiveBuild: ()=>{}, refresh: ()=>{} });
    expect(res.ok).toBe(false);
  });
});
// <!-- END RBP GENERATED: BuildsQoL -->
