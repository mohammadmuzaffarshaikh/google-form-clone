import * as zod from "zod";

export const createFormSchema = zod.object({
  formName: zod.string(),
  formDescription: zod.string().optional(),
  isPublished: zod.boolean().default(true),
  elements: zod.array(
    zod.object({
      title: zod.string(),
      options: zod.array(zod.string()).optional(),
      isRequired: zod.boolean().default(false),
      placeholder: zod.string().optional(),
      inputType: zod.enum([
        "Text",
        "Textarea",
        "Email",
        "Phone",
        "Dropdown",
        "MultiSelectDropdown",
        "Checkbox",
        "Radio",
        "File",
        "Date",
      ]),
    })
  ),
});

export const updateFormSchema = zod.object({
  formName: zod.string().optional(),
  formDescription: zod.string().optional(),
  isPublished: zod.boolean().default(true),
  elements: zod
    .array(
      zod.object({
        title: zod.string(),
        options: zod.array(zod.string()).optional(),
        isRequired: zod.boolean().default(false),
        placeholder: zod.string().optional(),
        inputType: zod.enum([
          "Text",
          "Textarea",
          "Email",
          "Phone",
          "Dropdown",
          "MultiSelectDropdown",
          "Checkbox",
          "Radio",
          "File",
          "Date",
        ]),
      })
    )
    .optional(),
});
