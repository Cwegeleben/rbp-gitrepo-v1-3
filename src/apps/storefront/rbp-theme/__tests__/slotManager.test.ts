// <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
import { GROUPS, type GroupName, type RbpPart } from "../lib/rbpProxyClient";

type SlotState = Partial<Record<GroupName, RbpPart | null>>;

function replaceSlot(state: SlotState, g: GroupName, p: RbpPart): SlotState {
  return { ...state, [g]: p };
}
function removeSlot(state: SlotState, g: GroupName): SlotState {
  return { ...state, [g]: null };
}
function resetAll(): SlotState { return {}; }

describe("slot manager", () => {
  const part = { id: "x", sku: "S", title: "T", price: 1, group: "Blanks" } as RbpPart;
  it("replace/new/remove", () => {
    let s: SlotState = {};
    s = replaceSlot(s, GROUPS[0], part);
    expect(s[GROUPS[0]]).toBe(part);
    s = removeSlot(s, GROUPS[0]);
    expect(s[GROUPS[0]]).toBe(null);
    s = resetAll();
    expect(Object.keys(s).length).toBe(0);
  });
});
// <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
