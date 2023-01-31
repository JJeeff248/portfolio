import React, { useState, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./Navbar";
import HomePage from "./HomePage";

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
        
        </ThemeProvider>
    );
}

export default App;
