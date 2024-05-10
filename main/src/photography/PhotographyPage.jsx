import React, { useCallback, useMemo } from "react";
import { Container } from "@mui/system";
import { ImageListItem } from "@mui/material";
import { isMobile } from "react-device-detect";

import Gallery from "./Gallery";
import About from "./About";
import MobileNav from "./MobileNav";
import imageNames from "./imageNames";

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
        let images = [];
        imageNames.forEach((key) => {
            let alt_text = key.replace(/\.webp$/, "").split("_");
            alt_text[0] = "";
            alt_text = alt_text.join(" ");
            images.push(
                <ImageListItem key={key} onClick={handleImageClick}>
                    <img
                        src={"https://static.chris-sa.com/gallery/" + key}
                        alt={alt_text}
                    />
                </ImageListItem>
            );
        });
        images.sort();
        return images;
    }, [handleImageClick]);

    return (
        <Container
            maxWidth={"lg"}
            sx={{ mt: 4, flexGrow: 1, display: "flex", mb: isMobile ? 15 : 6 }}
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
        </Container>
    );
};

export default PhotographyPage;
