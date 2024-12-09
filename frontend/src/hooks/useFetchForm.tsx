import axios from "axios";
import { useEffect, useState } from "react";

interface form {
  _id: string;
  formName: string;
  formDescription: string;
  elements: {
    _id: string;
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
    options: string[];
    isRequired: boolean;
    placeholder: string;
  }[];
  isPublished: boolean;
  link: string;
}

export const useFetchForm = (formId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<form>();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/forms/${formId}`
      );
      if (response.status === 200) {
        setFormData(response.data.form);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, formData };
};
