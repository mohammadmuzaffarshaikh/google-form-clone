import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  Copy,
  Edit,
  ChevronRight,
  ChartPie,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Layout from "./Layout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Form {
  _id: string;
  formName: string;
  formDescription: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  link: string;
}

interface ApiResponse {
  success: boolean;
  forms: Form[];
  pagination: {
    totalForms: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
// Todo: Search Functionality.
export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `http://localhost:3000/api/forms?page=${page}&limit=6&search=${searchTerm}`
        );
        setForms(response.data.forms);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch forms");
        setLoading(false);
        console.error(err);
      }
    };

    fetchForms();
  }, [page, searchTerm, refresh]);

  const templates = [{ title: "Blank form", icon: Plus, link: "/new-form" }];

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied to clipboard!" });
  };

  const deleteForm = async (formId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/forms/${formId}`
      );
      if (response.status === 204) {
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        toast({
          title: "Failure",
          description: "Not able to delete form.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center mb-4">
          <ChevronRight className="ml-1" />
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms"
              className="pl-8"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Templates Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Start a new form</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => navigate(template.link)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <template.icon className="h-12 w-12 text-primary" />
                    <p className="text-sm font-medium text-center">
                      {template.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Forms Section */}
        <div>
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="recent">Recent forms</TabsTrigger>
              </TabsList>
            </div>
            {/* Previous Forms */}
            <TabsContent value="recent">
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {loading ? (
                    <p>Loading forms...</p>
                  ) : error ? (
                    <p className="text-destructive">{error}</p>
                  ) : (
                    forms.map((form) => (
                      <Card
                        key={form._id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {form.formName}
                          </CardTitle>
                          <CardDescription>
                            Created{" "}
                            {format(new Date(form.createdAt), "MMM d, yyyy")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {form.formDescription}
                          </p>
                          <div className="flex items-center space-x-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(form.link)}
                            >
                              <Copy />
                              Copy Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/edit/${form._id}`)}
                            >
                              <Edit /> Edit Form
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/responses/${form._id}`)}
                            >
                              <ChartPie /> Responses
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteForm(form._id)}
                            >
                              <Trash2 /> Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
              {/* Pagination */}
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => setPage(page - 1)}
                        />
                      </PaginationItem>
                    )}
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={page === index + 1}
                          onClick={() => setPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() => setPage(page + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
