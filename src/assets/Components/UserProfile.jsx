import NavbarForAdmin from "./NavbarForAdmin";
import NavBarForPhotographyCompany from "./NavBarForPhotographyCompany";
import { Routes, Route } from "react-router-dom";
import Cases from "./pages/Cases";
import Agents from "./pages/Agents";
import Companies from "./pages/Companies";
import Edit from "./pages/Edit";
import AddCase from "./pages/AddCase";
import AssignCase from "./pages/AssignCase";
import AddAgent from "./pages/AddAgent";
import EditAgent from "./pages/EditAgent";
import './UserProfile.css' 
import UploadMedia from "./pages/UploadMedia";
import Photo from "./pages/Media/Photo";
import Video from "./pages/Media/Video";
import FloorPlan from "./pages/Media/FloorPlan";
import NavbarForAgent from "./NavbarForAgent";
import Agent from "./pages/Agent";
import AssignedCases from "./pages/AssignedCases";
import SelectMedia from "./pages/SelectMedia";
import PhotoSelection from "./pages/Media/PhotoSelection";
import VideoSelection from "./pages/Media/VideoSelection";
import FloorPlanSelection from "./pages/Media/FloorPlanSelection";

export default function UserProfile({ user }) {
    if (!user) return null;
    const isAdmin = user.roles?.includes("Admin");
    
    if (isAdmin) {
        return (
            <div className="home-container">
                <NavbarForAdmin />
                <Routes>
                    <Route path="cases" element={<Cases user={user}/>} />
                    <Route path="agents" element={<Agents />} />
                    <Route path="edit/:id" element={<Edit />} />
                    <Route path="addCase" element={<AddCase user={user}/>} />
                    <Route path="assignCase/:id" element={<AssignCase />} />
                    <Route path="editAgent/:id" element={<EditAgent />} />
                    <Route path="addAgent" element={<AddAgent />} />
                </Routes>
            </div>
        );
    } 
    
    const isPhotographyCompany = user.roles?.includes("PhotographyCompany");
    
    if (isPhotographyCompany) {
        return (
            <div className="home-container">
                <NavBarForPhotographyCompany />
                <Routes>
                    <Route path="cases" element={<Cases user={user}/>} />
                    <Route path="agents" element={<Agents />} />
                    <Route path="companies" element={<Companies user={user}/>} />
                    <Route path="edit/:id" element={<Edit />} />
                    <Route path="addCase" element={<AddCase user={user}/>} />
                    <Route path="assignCase/:id" element={<AssignCase user={user}/>} />
                    <Route path="editAgent/:id" element={<EditAgent />} />
                    <Route path="uploadMedia/:id" element={<UploadMedia />} />
                    <Route path="photo/:id" element={<Photo user={user}/>} />
                    <Route path="video/:id" element={<Video user={user}/>} />
                    <Route path="floorPlan/:id" element={<FloorPlan user={user}/>} />
                    <Route path="addAgent" element={<AddAgent />} />
                </Routes>
            </div>
        );
    }

    const isAgent = user.roles?.includes("Agent");
    
    if (isAgent) {
        return (
            <div className="home-container">
                <NavbarForAgent />
                <Routes>
                    <Route path="assignedcases" element={<AssignedCases user={user}/>} />
                    <Route path="agent" element={<Agent user={user}/>} />
                    <Route path="edit/:id" element={<Edit />} />
                    <Route path="addCase" element={<AddCase user={user}/>} />
                    <Route path="assignCase/:id" element={<AssignCase user={user}/>} />
                    <Route path="editAgent/:id" element={<EditAgent />} />
                    <Route path="selectMedia/:id" element={<SelectMedia />} />
                    <Route path="photoSelection/:id" element={<PhotoSelection user={user}/>} />
                    <Route path="videoSelection/:id" element={<VideoSelection user={user}/>} />
                    <Route path="floorPlanSelection/:id" element={<FloorPlanSelection user={user}/>} />
                </Routes>
            </div>
        );
    }
}    