import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Landing from "./pages/Landing";

const WritingHome = lazy(() => import("./pages/WritingHome"));
const WeeklyBriefing = lazy(() => import("./pages/WeeklyBriefing"));
const PersonalPieces = lazy(() => import("./pages/PersonalPieces"));
const Others = lazy(() => import("./pages/Others"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const About = lazy(() => import("./pages/About"));
const WhyMOE = lazy(() => import("./pages/WhyMOE"));
const ChangedMyMind = lazy(() => import("./pages/ChangedMyMind"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Contact = lazy(() => import("./pages/Contact"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/writing" element={<WritingHome />} />
          <Route path="/writing/weekly" element={<WeeklyBriefing />} />
          <Route path="/writing/weekly/:slug" element={<ArticlePage />} />
          <Route path="/writing/personal" element={<PersonalPieces />} />
          <Route path="/writing/personal/:slug" element={<ArticlePage />} />
          <Route path="/writing/others" element={<Others />} />
          <Route path="/writing/others/:slug" element={<ArticlePage />} />
          <Route path="/writing/about" element={<About />} />
          <Route path="/writing/why" element={<WhyMOE />} />
          <Route path="/writing/changed-my-mind" element={<ChangedMyMind />} />
          <Route path="/writing/changelog" element={<Changelog />} />
          <Route path="/writing/contact" element={<Contact />} />
          <Route path="/writing/articles" element={<Navigate to="/writing/weekly" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
