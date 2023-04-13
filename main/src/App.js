import React, { useState, useCallback, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { isMobile } from "react-device-detect";

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
            "csphotography": 2,
        };

        let page = pages[window.location.host.split(".")[0]]

        setPage(page ? page : 0);
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Navbar page={page} handlePageChange={handlePageChange} />

            <Box  sx={{ mb: isMobile ? 10 : 0 }}>
                {page === 0 && <HomePage />}
                {page === 1 && <DevPage />}
                {page === 2 && <PhotographyPage />}
            </Box>
        </ThemeProvider>
    );
}

export default App;
