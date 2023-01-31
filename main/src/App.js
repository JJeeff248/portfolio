import React, { useState, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./Navbar";

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
            

        </p>
        
        </ThemeProvider>
    );
}

export default App;
