import React, { useCallback } from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import { isMobile } from "react-device-detect";

const Navbar = (props) => {
    const { page, handlePageChange } = props;

    const handleChange = useCallback ((event, newValue) => { handlePageChange(newValue); }, [handlePageChange]);

    return (
        <AppBar position={isMobile ? "fixed" : "static"} sx={isMobile ? { top: 'auto', bottom: 0 } : null}>
            <Toolbar>
                <Tabs value={page} onChange={handleChange} aria-label="nav tabs example">
                    <Tab label="Home" />
                    <Tab label="Programming" />
                    <Tab label="Photography" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;