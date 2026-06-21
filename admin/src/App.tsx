import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GalleryAdminPage from "./pages/GalleryAdminPage";
import { darkTheme } from "./theme";

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <GalleryAdminPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </AuthContextProvider>
        </ThemeProvider>
    );
}

export default App;
