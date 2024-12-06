import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for User Response
interface IUserResponse extends Document {
  _id: Types.ObjectId;
  formId: Types.ObjectId; // Reference to the associated Form
  submittedOn: Date; // Date when the response was submitted
  response: Array<{
    elementId: Types.ObjectId; // Reference to the FormElement being answered
    value: any; // Flexible to store different types of values
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserResponseSchema: Schema<IUserResponse> = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form", // Reference to the FormSchema
      required: true,
    },
    submittedOn: {
      type: Date,
      default: Date.now, // Default to the current date when the response is submitted
    },
    response: [
      {
        elementId: {
          type: mongoose.Schema.Types.ObjectId, // ID of the form element being answered
          ref: "FormElements", // Reference to FormElementsSchema
          required: true,
        },
        value: {
          type: mongoose.Schema.Types.Mixed, // Flexible to handle different data types (e.g., text, file link, date)
          required: true,
        },
      },
    ],
  },
  { timestamps: true, collection: "UserResponse" } // Automatically adds createdAt and updatedAt fields
);

// Model creation
const UserResponseModel =
  mongoose.models.UserResponse ||
  mongoose.model<IUserResponse>("UserResponse", UserResponseSchema);

export default UserResponseModel;
