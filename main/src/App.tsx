import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import ProjectDetails from "./components/ProjectDetails";
import Gallery from "./components/Gallery";
import NotFound from "./components/NotFound";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route
                    path="/projects/:projectId"
                    element={<ProjectDetails />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
