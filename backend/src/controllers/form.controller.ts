import { Request, Response } from "express";
import FormModel, { IForm } from "../models/form.model";
import FormElementsModel from "../models/formElements.model";
import { createFormSchema, updateFormSchema } from "../schemas/form.zod";
import UserResponseModel from "../models/userResponse.model";

const createForm = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = createFormSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: error,
      });
      return;
    }

    // Validate elements array
    if (!Array.isArray(data?.elements) || data.elements.length === 0) {
      res.status(400).json({
        success: false,
        message: "Form must have at least one element.",
      });
      return;
    }

    // Insert form elements
    const formElements = await FormElementsModel.insertMany(data?.elements);
    const formElementsId: string[] = formElements.map((element) => element._id);

    // Create form
    const form: IForm = new FormModel({
      formName: data?.formName,
      formDescription: data?.formDescription || null,
      elements: formElementsId,
    });

    if (data?.isPublished) {
      form.isPublished = true;
      form.link = `http://localhost:5173/forms/response/${form._id}`;
    }

    const createdForm = await form.save();

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      form: createdForm,
      formLink: createdForm.link,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
    return;
  }
};

const updateForm = async (req: Request, res: Response) => {
  try {
    // 1. Parse and validate the request body using Zod
    const { success, error, data } = updateFormSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: error.errors,
      });
      return;
    }
    if (data?.elements && data.elements.length === 0) {
      res.status(400).json({
        success: false,
        message: "Form must have at least one element.",
      });
      return;
    }

    // 2. Check if the form exists
    const formId = req.params.id;
    const existingForm = await FormModel.findById(formId);
    if (!existingForm) {
      res.status(404).json({
        success: false,
        message: "Form not found",
      });
      return;
    }

    // 3. Delete all previous elements attached to the form and also responses.
    if (existingForm.elements && existingForm.elements.length > 0) {
      await FormElementsModel.deleteMany({
        _id: { $in: existingForm.elements },
      });
      await UserResponseModel.deleteMany({
        formId: formId,
      });
    }

    // 4. Create new elements and get their IDs
    let formElementsId: string[] = [];

    const formElements = await FormElementsModel.insertMany(data?.elements);
    formElementsId = formElements.map((element) => element._id);

    // 5. Update the form with new data
    existingForm.formName = data?.formName || existingForm.formName;
    existingForm.formDescription =
      data?.formDescription || existingForm.formDescription;
    existingForm.elements = formElementsId;
    existingForm.isPublished = data?.isPublished ?? existingForm.isPublished;

    // Generate a new link if the form is published
    if (existingForm.isPublished) {
      existingForm.link = `http://localhost:5173/forms/response/${existingForm._id}`;
    } else {
      existingForm.link = null;
    }

    // Save the updated form
    const updatedForm = await existingForm.save();

    // Respond with the updated form
    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      form: updatedForm,
      formLink: updatedForm.link,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
    return;
  }
};

const deleteForm = async (req: Request, res: Response) => {
  try {
    // 1. Check if the form exists
    const formId = req.params.id;
    const existingForm = await FormModel.findById(formId);
    if (!existingForm) {
      res.status(404).json({
        success: false,
        message: "Form not found",
      });
      return;
    }

    // 2. Delete all previous elements attached to the form
    if (existingForm.elements && existingForm.elements.length > 0) {
      await FormElementsModel.deleteMany({
        _id: { $in: existingForm.elements },
      });
      await UserResponseModel.deleteMany({
        formId: formId,
      });
    }

    //  3. Delete the form
    await FormModel.deleteOne({ _id: formId });

    res.status(204).json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
    return;
  }
};

const getAllForms = async (req: Request, res: Response) => {
  try {
    // Parse query parameters and set default values
    const limit = parseInt(req.query.limit as string) || 10; // Default limit: 10
    const page = parseInt(req.query.page as string) || 1; // Default page: 1

    if (limit <= 0 || page <= 0) {
      res.status(400).json({
        success: false,
        message:
          "Invalid pagination parameters. 'limit' and 'page' must be greater than 0.",
      });
      return;
    }

    // Calculate the total number of forms and total pages
    const totalForms = await FormModel.countDocuments();
    if (totalForms === 0) {
      res.status(404).json({
        success: false,
        message: "No forms found! Please create one.",
      });
      return;
    }

    const totalPages = Math.ceil(totalForms / limit);

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated forms
    const forms: IForm[] = (await FormModel.find().skip(skip).limit(limit)).reverse();

    res.status(200).json({
      success: true,
      forms,
      pagination: {
        totalForms,
        totalPages,
        currentPage: page,
        limit,
      },
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

const getForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.id;
    const form: IForm = await FormModel.findOne({ _id: formId }).populate(
      "elements"
    );
    if (!form) {
      res.status(404).json({
        success: false,
        message: "Form not found.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      form,
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

export { createForm, updateForm, deleteForm, getAllForms, getForm };
