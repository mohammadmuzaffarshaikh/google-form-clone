import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import NewForm from "./pages/NewForm";
import EditForm from "./pages/EditForm";
import ResponseForm from "./pages/ResponseForm";
import ResponseRecordedPage from "./pages/ResponseRecordedPage";
import RecordedResponses from "./pages/RecordedResponses";
import SpecificResponse from "./pages/SpecificResponse";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-form" element={<NewForm />} />
          <Route path="/edit/:formId" element={<EditForm />} />
          <Route path="/responses/:formId" element={<RecordedResponses />} />
          <Route
            path="/forms/responses/:formId/:responseId"
            element={<SpecificResponse />}
          />

          <Route path="/forms/response/:formId" element={<ResponseForm />} />
          <Route
            path="/forms/response/recorded"
            element={<ResponseRecordedPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
