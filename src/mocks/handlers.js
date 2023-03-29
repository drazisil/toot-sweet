import { rest } from "msw";

export const handlers = [
  rest.get("/people", (req, res, ctx) => {
    const r = res(ctx.status(500), ctx.json({ a: "b" }));
    console.dir(r);
    return r;
  }),
];
