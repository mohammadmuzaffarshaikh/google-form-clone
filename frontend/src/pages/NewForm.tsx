import { useState } from "react";
import axios from "axios";
import { Plus, Trash2, GripVertical, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "./Layout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface FormElement {
  title: string;
  inputType: string;
  isRequired: boolean;
  placeholder?: string;
  options?: string[];
}

const inputTypes = [
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
];

const multiOptionTypes = [
  "Dropdown",
  "MultiSelectDropdown",
  "Checkbox",
  "Radio",
];

export default function NewForm() {
  const router = useNavigate();
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const { toast } = useToast();
  const [elements, setElements] = useState<FormElement[]>([
    {
      title: "",
      inputType: "Text",
      isRequired: false,
      placeholder: "",
    },
  ]);
  const [isPublished, setIsPublished] = useState(true);

  const addElement = () => {
    setElements([
      ...elements,
      {
        title: "",
        inputType: "Text",
        isRequired: false,
        placeholder: "",
      },
    ]);
  };

  const removeElement = (index: number) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const updateElement = (
    index: number,
    field: keyof FormElement,
    value: any
  ) => {
    const newElements = [...elements];
    newElements[index] = { ...newElements[index], [field]: value };

    // Reset options when changing input type
    if (field === "inputType") {
      if (multiOptionTypes.includes(value)) {
        newElements[index].options = [""];
      } else {
        delete newElements[index].options;
      }
    }

    setElements(newElements);
  };

  const addOption = (elementIndex: number) => {
    const newElements = [...elements];
    if (!newElements[elementIndex].options) {
      newElements[elementIndex].options = [];
    }
    newElements[elementIndex].options?.push("");
    setElements(newElements);
  };

  const updateOption = (
    elementIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newElements = [...elements];
    if (newElements[elementIndex].options) {
      newElements[elementIndex].options![optionIndex] = value;
      setElements(newElements);
    }
  };

  const removeOption = (elementIndex: number, optionIndex: number) => {
    const newElements = [...elements];
    if (newElements[elementIndex].options) {
      newElements[elementIndex].options = newElements[
        elementIndex
      ].options!.filter((_, i) => i !== optionIndex);
      setElements(newElements);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        formName,
        formDescription,
        isPublished,
        elements,
      };

      const response = await axios.post(
        "http://localhost:3000/api/forms",
        payload
      );
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Form created successfully",
        });
        router("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create form",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container space-y-4 max-w-6xl">
        <div className="flex items-center mb-4">
          <ChevronRight className="ml-1" />
          <h2 className="text-2xl font-semibold">New Form</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Form title"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
              />
              <Textarea
                placeholder="Form description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="border-none px-0 focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isPublished}
                onCheckedChange={() => setIsPublished((prev) => !prev)}
              />
              <Label>Publish</Label>
            </div>
          </CardContent>
        </Card>

        {elements.map((element, elementIndex) => (
          <Card key={elementIndex}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="text-muted-foreground" />
                  <div className="flex-1 space-y-4">
                    <Input
                      placeholder="Question"
                      value={element.title}
                      onChange={(e) =>
                        updateElement(elementIndex, "title", e.target.value)
                      }
                    />
                    <div className="flex gap-4">
                      <Select
                        value={element.inputType}
                        onValueChange={(value) =>
                          updateElement(elementIndex, "inputType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select input type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inputTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!multiOptionTypes.includes(element.inputType) && (
                        <Input
                          placeholder="Placeholder text"
                          value={element.placeholder || ""}
                          onChange={(e) =>
                            updateElement(
                              elementIndex,
                              "placeholder",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>

                    {multiOptionTypes.includes(element.inputType) && (
                      <div className="space-y-2">
                        {element.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  elementIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeOption(elementIndex, optionIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(elementIndex)}
                        >
                          Add Option
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={element.isRequired}
                        onCheckedChange={(checked) =>
                          updateElement(elementIndex, "isRequired", checked)
                        }
                      />
                      <Label>Required</Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeElement(elementIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button variant="outline" onClick={addElement}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
          <Button onClick={handleSubmit}>Create Form</Button>
        </div>
      </div>
    </Layout>
  );
}
