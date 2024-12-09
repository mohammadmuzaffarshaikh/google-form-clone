import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Layout from "./Layout";

interface FormData {
  _id: string;
  formName: string;
  formDescription: string;
}

interface ResponseItem {
  elementId: {
    _id: string;
    title: string;
  };
  value: string;
  _id: string;
}

interface SpecificResponseData {
  _id: string;
  formId: FormData;
  response: ResponseItem[];
  submittedOn: string;
  createdAt: string;
  updatedAt: string;
}

function SpecificResponse() {
  const { formId, responseId } = useParams();
  const [responseData, setResponseData] = useState<SpecificResponseData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/responses/${formId}/${responseId}`
        );
        if (response.status === 200 && response.data.success) {
          setResponseData(response.data.data);
        } else {
          setError("Failed to fetch response data");
        }
      } catch (err) {
        setError("An error occurred while fetching the response");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponseData();
  }, [formId, responseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !responseData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Failed to load response data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{responseData.formId.formName}</CardTitle>
            <CardDescription>
              {responseData.formId.formDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  Response ID: {responseData._id}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Submitted on:{" "}
                  {format(new Date(responseData.submittedOn), "PPpp")}
                </span>
              </div>
              <Separator />
              <ScrollArea className="h-[60vh]">
                {responseData.response.map((item) => (
                  <div key={item._id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {item.elementId.title}
                    </h3>
                    <p className="bg-muted p-3 rounded-md">
                      {Array.isArray(item.value)
                        ? item.value.join(", ")
                        : item.value}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default SpecificResponse;
