import React, { useState, useCallback, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "./Navbar";
import HomePage from "./HomePage";
import DevPage from "./dev/DevPage";
import PhotographyPage from "./photography/PhotographyPage";
import { useLocation } from "react-router-dom";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const location = useLocation();
    const [page, setPage] = useState(1);

    const handlePageChange = useCallback(
        (newPage) => {
            setPage(newPage);
        },
        [setPage]
    );

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlPage = queryParams.get("page");

        setPage(urlPage ? parseInt(urlPage) : 1);

        queryParams.delete("page");
        window.history.replaceState({}, "", `${location.pathname}`);
    }, [location.pathname, location.search]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Navbar page={page} handlePageChange={handlePageChange} />

            {page === 0 && <HomePage />}
            {page === 1 && <DevPage />}
            {page === 2 && <PhotographyPage />}
        </ThemeProvider>
    );
}

export default App;
