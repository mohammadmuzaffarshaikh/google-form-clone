import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Form Elements
interface IFormElement extends Document {
  _id: Types.ObjectId;
  title: string;
  inputType:
    | "Text"
    | "Textarea"
    | "Email"
    | "Phone"
    | "Dropdown"
    | "MultiSelectDropdown"
    | "Checkbox"
    | "Radio"
    | "File"
    | "Date";
  options: string[]; // Array of options (only for Dropdown, Multi Select Dropdown, and Radio)
  isRequired: boolean; // Indicates if the field is required
  placeholder?: string; // Optional placeholder text for text-based inputs
}

const FormElementsSchema: Schema<IFormElement> = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: {
    type: String,
    required: true, // Every element must have a title (question text)
    trim: true,
  },
  inputType: {
    type: String,
    enum: [
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
    ],
    required: true,
  },
  options: {
    type: [String],
    default: [], // Default to an empty array for input types like dropdown, radio, etc.
    validate: {
      validator: function (v) {
        return this.inputType === "Dropdown" ||
          this.inputType === "MultiSelectDropdown" ||
          this.inputType === "Radio" ||
          this.inputType === "Checkbox"
          ? Array.isArray(v) && v.length > 0
          : true;
      },
      message:
        "options are required for dropdown, multi-select dropdown, and radio types.",
    },
  },
  isRequired: {
    type: Boolean,
    default: false, // Defaults to optional fields
  },
  placeholder: {
    type: String, // Optional placeholder text for text-based inputs
    trim: true,
  },
});

// Model creation
const FormElementsModel =
  mongoose.models.FormElements ||
  mongoose.model<IFormElement>("FormElements", FormElementsSchema);

export default FormElementsModel;
