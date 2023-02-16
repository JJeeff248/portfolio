import React, { useState, useCallback, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "./Navbar";
import HomePage from "./HomePage";
import DevPage from "./dev/DevPage";
import PhotographyPage from "./photography/PhotographyPage";
import { Box, Link } from "@mui/material";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router-dom";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const location = useLocation();
    const [page, setPage] = useState(0);

    const handlePageChange = useCallback(
        (newPage) => {
            setPage(newPage);
        },
        [setPage]
    );

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlPage = queryParams.get("page");

        setPage(urlPage ? parseInt(urlPage) : 0);

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

            <Box component={"div"} sx={{ width: "100%", display: "flex", justifyContent: "end", p: 2 }}>
                <Link
                    href="https://www.copyrighted.com/website/LREOjEhY1ICAuY6S"
                    target="_blank"
                    rel="noreferrer"
                    title="Copyrighted.com Registered & Protected"
                    style={{ textDecoration: "none" }}
                    sx={{ mb: isMobile ? (page === 2 ? 15 : 5) : 0 }}
                >
                    <Box
                        component="img"
                        src="https://static.copyrighted.com/badges/125x25/02_1.png"
                        srcSet="https://static.copyrighted.com/badges/125x25/02_1_2x.png 2x"
                        alt="Copyrighted.com Registered & Protected"
                        border="0"
                        width="125"
                        height="25"
                    />
                </Link>
            </Box>

            <script src="https://static.copyrighted.com/badges/helper.js"></script>
        </ThemeProvider>
    );
}

export default App;
