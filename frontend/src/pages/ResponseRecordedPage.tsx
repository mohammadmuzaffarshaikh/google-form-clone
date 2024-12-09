import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ResponseRecordedPage = () => {
  return (
    <Card className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <CardHeader>
          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Your response has been recorded!
          </h3>
        </CardHeader>
        <CardContent>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Thank you for submitting the form. We appreciate your response.
          </h4>
        </CardContent>
      </div>
    </Card>
  );
};

export default ResponseRecordedPage;
