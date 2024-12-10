import MultipleSelector from "@/components/ui/multiple-selector";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "../hooks/use-toast";
import { format } from "date-fns";
import { useFetchForm } from "@/hooks/useFetchForm";

interface FormElement {
  _id: string;
  title: string;
  inputType: string;
  options: string[];
  isRequired: boolean;
  placeholder?: string;
}

interface FormResponse {
  elementId: string;
  value: string | string[];
}

export default function ResponseForm() {
  const { formId } = useParams();
  const { isLoading, formData } = useFetchForm(formId || "");
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (elementId: string, value: string | string[]) => {
    setResponses((prev) => {
      const existing = prev.findIndex((r) => r.elementId === elementId);
      if (existing !== -1) {
        const newResponses = [...prev];
        newResponses[existing].value = value;
        return newResponses;
      }
      return [...prev, { elementId, value }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const missingRequired = formData?.elements.filter((element) => {
        if (!element.isRequired) return false;
        const response = responses.find((r) => r.elementId === element._id);
        return !response || !response.value;
      });

      if (missingRequired && missingRequired.length > 0) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const submitResponse = await axios.post(
        "http://localhost:3000/api/responses",
        {
          formId: formData?._id,
          response: responses,
        }
      );
      if (submitResponse.status === 201) {
        toast({
          title: "Success",
          description: "Your response has been submitted",
        });
        navigate("/forms/response/recorded");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading form...</p>
      </div>
    );
  }

  const renderFormElement = (element: FormElement) => {
    const { _id, title, inputType, options, isRequired, placeholder } = element;

    switch (inputType) {
      case "Text":
      case "Email":
        return (
          <div className="space-y-2">
            <Label htmlFor={_id}>
              {title}
              {isRequired && "*"}
            </Label>
            <Input
              id={_id}
              type={inputType.toLowerCase()}
              placeholder={placeholder}
              required={isRequired}
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "Phone":
        return (
          <div className="space-y-2">
            <Label htmlFor={_id}>
              {title}
              {isRequired && "*"}
            </Label>
            <Input
              id={_id}
              type="number"
              placeholder={placeholder}
              required={isRequired}
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "Textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={_id}>
              {title}
              {isRequired && "*"}
            </Label>
            <Textarea
              id={_id}
              placeholder={placeholder}
              required={isRequired}
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "Dropdown":
        return (
          <div className="space-y-2">
            <Label>
              {title}
              {isRequired && "*"}
            </Label>
            <Select onValueChange={(value) => handleInputChange(_id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "MultiSelectDropdown": {
        const Options = element.options.map((option) => ({
          label: option,
          value: option,
        }));
        return (
          <div className="space-y-2">
            <Label>
              {title}
              {isRequired && "*"}
            </Label>
            <MultipleSelector
              defaultOptions={Options}
              placeholder={element.placeholder || "Select Multiple options"}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
              onChange={(options) => {
                const values = options.map((option) => option.value);
                handleInputChange(element._id, values);
              }}
            />
          </div>
        );
      }

      case "Checkbox": {
        return (
          <div className="space-y-2">
            <Label>
              {title}
              {isRequired && "*"}
            </Label>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${_id}-${option}`}
                    onCheckedChange={(checked) => {
                      const currentResponse = responses.find(
                        (r) => r.elementId === _id
                      );
                      const values = currentResponse?.value || [];

                      const updatedValues = checked
                        ? [...values, option] // Add the option if checked
                        : values.filter((val) => val !== option); // Remove the option if unchecked

                      handleInputChange(_id, updatedValues); // Update as an array
                    }}
                    checked={
                      responses
                        .find((r) => r.elementId === _id)
                        ?.value?.includes(option) || false
                    }
                  />
                  <Label htmlFor={`${_id}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "Radio":
        return (
          <div className="space-y-2">
            <Label>
              {title}
              {isRequired && "*"}
            </Label>
            <RadioGroup
              onValueChange={(value) => handleInputChange(_id, value)}
            >
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${_id}-${option}`} />
                  <Label htmlFor={`${_id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "Date":
        return (
          <div className="space-y-2">
            <Label htmlFor={_id}>
              {title}
              {isRequired && "*"}
            </Label>
            <Input
              id={_id}
              type="date"
              required={isRequired}
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "File":
        return (
          <div className="space-y-2">
            <Label htmlFor={_id}>
              {title}
              {isRequired && "*"}
            </Label>
            <Input
              id={_id}
              type="file"
              required={isRequired}
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  handleInputChange(_id, file.name);
                }
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{formData.formName}</CardTitle>
            <CardDescription>{formData.formDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.elements.map((element) => (
              <div key={element._id}>{renderFormElement(element)}</div>
            ))}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResponses([])}
              >
                Clear form
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
