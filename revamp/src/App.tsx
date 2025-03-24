import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import ProjectDetails from "./components/ProjectDetails";
import Gallery from "./components/Gallery";

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
            </Routes>
        </Router>
    );
}

export default App;
