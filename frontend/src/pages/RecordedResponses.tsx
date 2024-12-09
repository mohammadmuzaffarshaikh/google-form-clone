import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "./Layout";
import { ChevronRight } from "lucide-react";

interface FormDetails {
  _id: string;
  formName: string;
  formDescription: string;
}

interface FormElement {
  _id: string;
  title: string;
  isRequired: boolean;
}

interface ResponseItem {
  value: string | string[];
  elementId: string;
}

interface Response {
  _id: string;
  response: ResponseItem[];
}

function RecordedResponses() {
  const { formId } = useParams();
  const [formDetails, setFormDetails] = useState<FormDetails>({
    _id: "",
    formName: "",
    formDescription: "",
  });
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResponseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/responses/${formId}`
        );
        if (response.status === 200) {
          setFormDetails(response.data.formData);
          setFormElements(response.data.formElements);
          setResponses(response.data.responses);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error);
          toast({
            title: "Not able to fetch responses at the moment.",
            variant: "destructive",
          });
        }
      }
    };

    fetchResponseData();
  }, [formId]);

  const getCellClassName = (isRequired: boolean, value: string) => {
    if (isRequired && value === "") return "bg-red-100 dark:bg-red-900";
    if (!isRequired && value !== "") return "bg-green-100 dark:bg-green-900";
    return "";
  };

  const getResponseValue = (response: Response, elementId: string) => {
    const item = response.response.find((item) => item.elementId === elementId);
    if(Array.isArray(item?.value)){
        item.value = item.value.join(", ");
    }
    return item ? item.value : "";
  };

  return (
    <Layout>
      <div className="flex items-center mb-4">
          <ChevronRight className="ml-1" />
          <h2 className="text-2xl font-semibold">Responses</h2>
        </div>  
      <div className="flex justify-center">
        <div className="container mx-10 max-w-6xl">
          <Card className="mb-6 max-w-full">
            <CardHeader>
              <CardTitle>{formDetails.formName}</CardTitle>
              <CardDescription>{formDetails.formDescription}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="max-w-full">
            <CardHeader>
              <CardTitle>Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-w-full whitespace-nowrap rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                        <TableHead>Sr.no</TableHead>
                      {formElements.map((element) => (
                        <TableHead key={element._id} className="min-w-[150px]">
                          {element.title}
                          {element.isRequired && (
                            <Badge variant="outline" className="ml-2">
                              Required
                            </Badge>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response, index) => (
                        
                      <TableRow
                        key={response._id}
                        onClick={() =>
                          navigate(`/forms/responses/${formId}/${response._id}`)
                        }
                      >
                        <TableCell className="text-center">{index + 1}</TableCell>
                        {formElements.map((element) => {
                          const value = getResponseValue(response, element._id);
                          return (
                            <TableCell
                              key={element._id}
                              className={getCellClassName(
                                element.isRequired,
                                value
                              )}
                            >
                              {value || (
                                <span className="text-muted-foreground italic">
                                  {element.isRequired
                                    ? "No response"
                                    : "Optional - No response"}
                                </span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 dark:bg-red-900 mr-2"></div>
                  <span>Missing required field</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900 mr-2"></div>
                  <span>Filled optional field</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default RecordedResponses;
