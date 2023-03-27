import React, { useState, useCallback, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "./Navbar";
import HomePage from "./HomePage";
import DevPage from "./dev/DevPage";
import PhotographyPage from "./photography/PhotographyPage";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [page, setPage] = useState(0);

    const handlePageChange = useCallback(
        (newPage) => {
            setPage(newPage);
        },
        [setPage]
    );

    useEffect(() => {
        const pages = {
            "chris-sa": 0,
            "dev": 1,
            "photography": 2,
        };
        
        setPage(pages[window.location.host.split(".")[0]]);
    }, []);

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
