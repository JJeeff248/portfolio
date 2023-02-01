import React, { useCallback } from "react";
import { Tabs, Tab } from "@mui/material";
import { Container } from "@mui/system";
import Gallery from "./Gallery";
import About from "./About";
import Contact from "./Contact";

const PhotographyPage = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleChange = useCallback(
        (event, newValue) => {
            setSelectedTab(newValue);
        },
        [setSelectedTab]
    );

    return (
        <>
            <Container
                maxWidth={"lg"}
                sx={{ mt: 4, mb:10, flexGrow: 1, display: "flex" }}
            >
                <Tabs
                    orientation="vertical"
                    value={selectedTab}
                    onChange={handleChange}
                    sx={{ borderRight: 1, borderColor: "divider" }}
                >
                    <Tab label="Gallery" />
                    <Tab label="About" />
                    <Tab label="Contact" />
                </Tabs>
                {selectedTab === 0 && <Gallery />}
                {selectedTab === 1 && <About />}
                {selectedTab === 2 && <Contact />}
            </Container>
        </>
    );
};

export default PhotographyPage;
