import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
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

const MiniIndex = lazy(() => import("./pages/MiniIndex"));

const VerdictShell = lazy(() =>
  import("./pages/verdict/VerdictLayout").then((m) => {
    const { default: VerdictLayout, VerdictThemeProvider } = m;
    return {
      default: function VerdictShell() {
        return (
          <VerdictThemeProvider>
            <VerdictLayout>
              <Outlet />
            </VerdictLayout>
          </VerdictThemeProvider>
        );
      },
    };
  }),
);
const VerdictIndex = lazy(() => import("./pages/verdict/VerdictIndex"));
const VerdictCase = lazy(() => import("./pages/verdict/VerdictCase"));
const VerdictCharts = lazy(() => import("./pages/verdict/VerdictCharts"));
const VerdictAbout = lazy(() => import("./pages/verdict/VerdictAbout"));
const VerdictScored = lazy(() => import("./pages/verdict/VerdictScored"));
const VerdictSubmit = lazy(() => import("./pages/verdict/VerdictSubmit"));

const LedgerShell = lazy(() =>
  import("./pages/ledger/LedgerLayout").then((m) => {
    const { default: LedgerLayout, LedgerThemeProvider } = m;
    return {
      default: function LedgerShell() {
        return (
          <LedgerThemeProvider>
            <LedgerLayout>
              <Outlet />
            </LedgerLayout>
          </LedgerThemeProvider>
        );
      },
    };
  }),
);
const LedgerIndex = lazy(() => import("./pages/ledger/LedgerIndex"));
const LedgerAction = lazy(() => import("./pages/ledger/LedgerAction"));
const LedgerCharts = lazy(() => import("./pages/ledger/LedgerCharts"));
const LedgerAbout = lazy(() => import("./pages/ledger/LedgerAbout"));

const ObservatoryShell = lazy(() =>
  import("./pages/observatory/ObservatoryLayout").then((m) => {
    const { default: ObservatoryLayout, ObservatoryThemeProvider } = m;
    return {
      default: function ObservatoryShell() {
        return (
          <ObservatoryThemeProvider>
            <ObservatoryLayout>
              <Outlet />
            </ObservatoryLayout>
          </ObservatoryThemeProvider>
        );
      },
    };
  }),
);
const ObservatoryIndex = lazy(() => import("./pages/observatory/ObservatoryIndex"));
const ObservatoryMethods = lazy(() => import("./pages/observatory/ObservatoryMethods"));

const ArenaShell = lazy(() =>
  import("./pages/arena/ArenaLayout").then((m) => {
    const { default: ArenaLayout, ArenaThemeProvider } = m;
    return {
      default: function ArenaShell() {
        return (
          <ArenaThemeProvider>
            <ArenaLayout>
              <Outlet />
            </ArenaLayout>
          </ArenaThemeProvider>
        );
      },
    };
  }),
);
const ArenaIndex = lazy(() => import("./pages/arena/ArenaIndex"));
const ArenaMethods = lazy(() => import("./pages/arena/ArenaMethods"));

const DistLabShell = lazy(() =>
  import("./pages/distlab/DistLabLayout").then((m) => {
    const { default: DistLabLayout, DistLabThemeProvider } = m;
    return {
      default: function DistLabShell() {
        return (
          <DistLabThemeProvider>
            <DistLabLayout>
              <Outlet />
            </DistLabLayout>
          </DistLabThemeProvider>
        );
      },
    };
  }),
);
const DistLabIndex = lazy(() => import("./pages/distlab/DistLabIndex"));
const DistLabMethods = lazy(() => import("./pages/distlab/DistLabMethods"));

const DocketShell = lazy(() =>
  import("./pages/docket/DocketLayout").then((m) => {
    const { default: DocketLayout, DocketThemeProvider } = m;
    return {
      default: function DocketShell() {
        return (
          <DocketThemeProvider>
            <DocketLayout>
              <Outlet />
            </DocketLayout>
          </DocketThemeProvider>
        );
      },
    };
  }),
);
const DocketIndex = lazy(() => import("./pages/docket/DocketIndex"));
const DocketMethods = lazy(() => import("./pages/docket/DocketMethods"));

function RouteFallback() {
  return <div className="min-h-screen bg-background" aria-busy="true" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
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

            <Route path="/mini" element={<MiniIndex />} />

            <Route path="/mini/verdict" element={<VerdictShell />}>
              <Route index element={<VerdictIndex />} />
              <Route path=":id" element={<VerdictCase />} />
              <Route path="charts" element={<VerdictCharts />} />
              <Route path="about" element={<VerdictAbout />} />
              <Route path="how-we-score" element={<VerdictScored />} />
              <Route path="submit" element={<VerdictSubmit />} />
            </Route>

            <Route path="/mini/ledger" element={<LedgerShell />}>
              <Route index element={<LedgerIndex />} />
              <Route path="charts" element={<LedgerCharts />} />
              <Route path="about" element={<LedgerAbout />} />
              <Route path=":id" element={<LedgerAction />} />
            </Route>

            <Route path="/mini/observatory" element={<ObservatoryShell />}>
              <Route index element={<ObservatoryIndex />} />
              <Route path="methods" element={<ObservatoryMethods />} />
            </Route>

            <Route path="/mini/arena" element={<ArenaShell />}>
              <Route index element={<ArenaIndex />} />
              <Route path="methods" element={<ArenaMethods />} />
            </Route>

            <Route path="/mini/lab" element={<DistLabShell />}>
              <Route index element={<DistLabIndex />} />
              <Route path="methods" element={<DistLabMethods />} />
            </Route>

            <Route path="/mini/docket" element={<DocketShell />}>
              <Route index element={<DocketIndex />} />
              <Route path="methods" element={<DocketMethods />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
