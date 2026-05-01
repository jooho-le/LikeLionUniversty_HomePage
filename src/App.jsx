import { Route, Routes } from "react-router-dom";
import MacShell from "./components/MacShell.jsx";
import Home from "./pages/Home.jsx";
import Intro from "./pages/Intro.jsx";
import AboutLikeLion from "./pages/AboutLikeLion.jsx";
import LikeLionInstagram from "./pages/LikeLionInstagram.jsx";
import LikeLionHomepage from "./pages/LikeLionHomepage.jsx";
import LikeLionPBL from "./pages/LikeLionPBL.jsx";
import BackendSession from "./pages/BackendSession.jsx";
import BackendContent from "./pages/BackendContent.jsx";
import BackendDiary from "./pages/BackendDiary.jsx";
import FrontendSession from "./pages/FrontendSession.jsx";
import FrontendContent from "./pages/FrontendContent.jsx";
import FrontendDiary from "./pages/FrontendDiary.jsx";
import PlanningDesignSession from "./pages/PlanningDesignSession.jsx";
import PlanningDesignContent from "./pages/PlanningDesignContent.jsx";
import PlanningDesignDiary from "./pages/PlanningDesignDiary.jsx";
import Profile from "./pages/Profile.jsx";
import GenerationSelect from "./pages/GenerationSelect.jsx";
import StaffProfile from "./pages/StaffProfile.jsx";
import MemberProfile from "./pages/MemberProfile.jsx";
import Projects from "./pages/Projects.jsx";
import GenerationProjects from "./pages/GenerationProjects.jsx";
import ProjectCardNews from "./pages/ProjectCardNews.jsx";
import Apply from "./pages/Apply.jsx";
import FAQ from "./pages/FAQ.jsx";
import ApplyForm from "./pages/ApplyForm.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <MacShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/intro/about" element={<AboutLikeLion />} />
        <Route path="/intro/about/instagram" element={<LikeLionInstagram />} />
        <Route path="/intro/about/homepage" element={<LikeLionHomepage />} />
        <Route path="/intro/about/pbl" element={<LikeLionPBL />} />
        <Route path="/intro/backend" element={<BackendSession />} />
        <Route path="/intro/backend/content" element={<BackendContent />} />
        <Route path="/intro/backend/diary" element={<BackendDiary />} />
        <Route path="/intro/frontend" element={<FrontendSession />} />
        <Route path="/intro/frontend/content" element={<FrontendContent />} />
        <Route path="/intro/frontend/diary" element={<FrontendDiary />} />
        <Route path="/intro/planning-design" element={<PlanningDesignSession />} />
        <Route path="/intro/planning-design/content" element={<PlanningDesignContent />} />
        <Route path="/intro/planning-design/diary" element={<PlanningDesignDiary />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/generation" element={<GenerationSelect />} />
        <Route path="/profile/staff" element={<StaffProfile />} />
        <Route path="/profile/members" element={<MemberProfile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/generation" element={<GenerationProjects />} />
        <Route path="/projects/card-news" element={<ProjectCardNews />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/faq" element={<FAQ />} />
        <Route path="/apply/form" element={<ApplyForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MacShell>
  );
}
