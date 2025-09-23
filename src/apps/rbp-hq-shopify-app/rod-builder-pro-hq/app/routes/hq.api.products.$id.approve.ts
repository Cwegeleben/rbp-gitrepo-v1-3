// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import type { ActionFunctionArgs } from "@remix-run/node";
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import { markApproved } from "../libs/products";
export const action = async ({ params }: ActionFunctionArgs) => {
  const id = params.id || "0";
  const res = markApproved(id);
  return Response.json(res);
};
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
