import React, { useCallback, useMemo } from "react";
import { Container } from "@mui/system";
import { ImageListItem } from "@mui/material";

import Gallery from "./Gallery";
import About from "./About";
import Contact from "./Contact";
import MobileNav from "./MobileNav";

const PhotographyPage = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const [selectedImg, setSelectedImg] = React.useState(null);
    const [altText, setAltText] = React.useState("");

    const handleImageClick = useCallback(
        (event) => {
            setSelectedImg(event.target.src);
            setAltText(event.target.alt);
        },
        [setSelectedImg, setAltText]
    );

    const images = useMemo(() => {
        let imageDir = require.context("./images/my_gallery", false, /\.jpg$/);
        let images = [];
        imageDir.keys().forEach((key) => {
            key = key.replace(/^.*[\\/]/, "");
            let alt_text = key.replace(/\.jpg$/, "").replace(/_/g, " ");
            images.push(
                <ImageListItem key={key} onClick={handleImageClick}>
                    <img
                        src={require(`./images/my_gallery/${key}`)}
                        alt={alt_text}
                    />
                </ImageListItem>
            );
        });
        images.sort(() => Math.random() - 0.5);
        return images;
    }, [handleImageClick]);

    return (
        <>
            <Container
                maxWidth={"lg"}
                sx={{ mt: 4, flexGrow: 1, display: "flex", mb: 6 }}
            >
                <MobileNav
                    selectedTab={selectedTab}
                    handlePageChange={setSelectedTab}
                />

                {selectedTab === 0 && (
                    <Gallery
                        images={images}
                        selectedImg={selectedImg}
                        setSelectedImg={setSelectedImg}
                        setAltText={setAltText}
                        altText={altText}
                    />
                )}
                {selectedTab === 1 && <About />}
                {selectedTab === 2 && <Contact />}
            </Container>
        </>
    );
};

export default PhotographyPage;
