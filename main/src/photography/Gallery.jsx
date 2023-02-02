import React from "react";
import { Container } from "@mui/system";
import { ImageList } from "@mui/material";
import LargeImage from "./LargeImage";

const Gallery = (props) => {
    const { selectedImg, setSelectedImg, setAltText, altText, images } = props;

    const flexCenter = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    return (
        <Container maxWidth={"ld"} style={flexCenter} >
            {selectedImg !== null ? (
                <LargeImage
                    selectedImg={selectedImg}
                    altText={altText}
                    setSelectedImg={setSelectedImg}
                    setAltText={setAltText}
                />
            ) : (
                <ImageList variant="masonry" cols={3} gap={8}>
                    {images}
                </ImageList>
            )}
        </Container>
    );
};

export default Gallery;
