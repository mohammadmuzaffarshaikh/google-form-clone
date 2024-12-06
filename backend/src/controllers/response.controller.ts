import { Request, Response } from "express";
import { responseSchema } from "../schemas/response.zod";
import UserResponseModel from "../models/userResponse.model";
import FormModel from "../models/form.model";

const addResponse = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate the request body
    const parseResult = responseSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: parseResult.error.errors,
      });
      return;
    }

    const { formId, response } = parseResult.data;

    // Step 2: Check if the form exists and is published
    const existingForm = await FormModel.findById(formId).select("isPublished");
    if (!existingForm || !existingForm.isPublished) {
      res.status(404).json({
        success: false,
        message: "Form not found or is not published.",
      });
    }

    // Step 3: Save the user response
    const userResponse = new UserResponseModel({
      formId,
      response,
    });

    await userResponse.save();

    // Step 4: Respond with success
    res.status(201).json({
      success: true,
      message: "Your response has been submitted successfully.",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
};

const getAllResponses = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;

    // 1. Check if the form exists
    const form = await FormModel.findById(formId).populate("elements");
    if (!form) {
      res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    // 2. Fetch form data and elements
    const formData = {
      _id: form._id,
      formName: form.formName,
      formDescription: form.formDescription,
    };

    const formElements = form.elements.map((element: any) => ({
      _id: element._id,
      title: element.title,
      isRequired: element.isRequired,
    }));

    // 3. Fetch all responses associated with the formId
    const responses = await UserResponseModel.find({ formId });

    // Transform responses into the required format
    const formattedResponses = responses.map((response) => {
      return {
        _id: response._id,
        response: response.response.map((item: any) => ({ value: item.value })),
      };
    });

    // 4. Send response
    res.status(200).json({
      success: true,
      formData,
      formElements,
      responses: formattedResponses,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
};

const getSpecificResponse = async (req: Request, res: Response) => {
  try {
    const { responseId } = req.params;

    // 1. Fetch the specific response and populate the required fields
    const data = await UserResponseModel.findById(responseId)
      .populate({
        path: "formId",
        select: "formName formDescription", // Selecting only `formName` and `formDescription`
      })
      .populate({
        path: "response.elementId",
        select: "title", // Selecting only the `title` field from the FormElements
      });

    // 2. Check if data exists
    if (!data) {
      res.status(404).json({
        success: false,
        message: "Response not found.",
      });
    }

    // 3. Send response
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
};

export { addResponse, getAllResponses, getSpecificResponse };
