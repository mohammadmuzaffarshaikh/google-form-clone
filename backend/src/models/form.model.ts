import mongoose, { Schema, Document, Types } from "mongoose";

export interface IForm extends Document {
  _id: Types.ObjectId;
  formName: string;
  formDescription?: string;
  elements: Types.ObjectId[]; // Reference to the FormElements schema
  isPublished: boolean;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema: Schema<IForm> = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    formName: {
      type: String,
      required: true,
      trim: true,
    },
    formDescription: {
      type: String,
      trim: true,
    },
    elements: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "FormElements" }], // Referencing FormElements model
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      required: function () {
        return this.isPublished;
      }, // Only required if the form is published
    },
  },
  {
    collection: "Form",
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const FormModel =
  mongoose.models.FormModel || mongoose.model<IForm>("Form", FormSchema);

export default FormModel;
