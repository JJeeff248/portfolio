import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GalleryAdminPage from "./pages/GalleryAdminPage";

const theme = createTheme({
    palette: { mode: "light" },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
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
