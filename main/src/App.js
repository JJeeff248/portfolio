import React, { useState, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "./Navbar";
import HomePage from "./HomePage";
import DevPage from "./DevPage";
import PhotographyPage from "./PhotographyPage";

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
