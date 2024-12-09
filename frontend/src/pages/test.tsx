import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFetchForm } from "@/hooks/useFetchForm";
import { useParams } from "react-router-dom";

const FormRenderer = () => {
  const { formId } = useParams();
  const { isLoading, formData } = useFetchForm(formId || "");
  const renderElement = (element: any) => {
    switch (element.inputType) {
      case "Text":
        return (
          <div key={element._id} className="space-y-2">
            <Label htmlFor={element._id}>{element.title}</Label>
            <Input
              id={element._id}
              type="text"
              placeholder={element.placeholder}
              required={element.isRequired}
            />
          </div>
        );
      case "Email":
        return (
          <div key={element._id} className="space-y-2">
            <Label htmlFor={element._id}>{element.title}</Label>
            <Input
              id={element._id}
              type="email"
              placeholder={element.placeholder}
              required={element.isRequired}
            />
          </div>
        );
      case "Textarea":
        return (
          <div key={element._id} className="space-y-2">
            <Label htmlFor={element._id}>{element.title}</Label>
            <Textarea
              id={element._id}
              placeholder={element.placeholder}
              required={element.isRequired}
            />
          </div>
        );
      case "Dropdown":
        return (
          <div key={element._id} className="space-y-2">
            <Label>{element.title}</Label>
            <Select required={element.isRequired}>
              <SelectTrigger>
                <span>{element.placeholder || "Select an option"}</span>
              </SelectTrigger>
              <SelectContent>
                {element.options.map((option: string, index: number) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "Checkbox":
        return (
          <div key={element._id} className="space-y-2">
            <Label>{element.title}</Label>
            <div className="space-y-1">
              {element.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${element._id}-${index}`}
                    required={element.isRequired}
                  />
                  <Label htmlFor={`${element._id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case "Radio":
        return (
          <div key={element._id} className="space-y-2">
            <Label>{element.title}</Label>
            <div className="space-y-1">
              {element.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name={element._id}
                    id={`${element._id}-${index}`}
                    value={option}
                    required={element.isRequired}
                  />
                  <Label htmlFor={`${element._id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case "File":
        return (
          <div key={element._id} className="space-y-2">
            <Label htmlFor={element._id}>{element.title}</Label>
            <Input id={element._id} type="file" required={element.isRequired} />
          </div>
        );
      case "Date":
        return (
          <div key={element._id} className="space-y-2">
            <Label htmlFor={element._id}>{element.title}</Label>
            <Input id={element._id} type="date" required={element.isRequired} />
          </div>
        );
      default:
        return null;
    }
  };
  if(isLoading && !formData){
    return <div>loading...</div>
  }
  return (
    <form className="space-y-6">
      <h1 className="text-xl font-bold">{formData.formName}</h1>
      <p className="text-gray-600">{formData.formDescription}</p>
      {formData.elements.map((element: any) => renderElement(element))}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default FormRenderer;
