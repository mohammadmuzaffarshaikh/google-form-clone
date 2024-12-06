import * as zod from "zod";

export const responseSchema = zod.object({
  formId: zod.string(),
  response: zod.array(
    zod.object({
      elementId: zod.string(),
      value: zod.any(),
    })
  ),
});
