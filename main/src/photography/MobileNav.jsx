import React, { useCallback } from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import { isMobile } from "react-device-detect";

const MobileNav = (props) => {
    const { selectedTab, handlePageChange } = props;

    const handleChange = useCallback(
        (event, newValue) => {
            handlePageChange(newValue);
        },
        [handlePageChange]
    );

    return isMobile ? (
        <AppBar
            position={"fixed"}
            sx={{ top: "auto", bottom: 50, boxShadow: "none" }}
        >
            <Toolbar>
                <Tabs
                    value={selectedTab}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    sx={{ width: "100%" }}
                >
                    <Tab label="Gallery" />
                    <Tab label="About" />
                    <Tab label="Contact" />
                </Tabs>
            </Toolbar>
        </AppBar>
    ) : (
        <Tabs
            orientation="vertical"
            value={selectedTab}
            onChange={handleChange}
            sx={{ borderRight: 1, borderColor: "divider" }}
        >
            <Tab label="Gallery" value={0} />
            <Tab label="About" value={1} />
            <Tab label="Contact" value={2} />
        </Tabs>
    );
};

export default MobileNav;