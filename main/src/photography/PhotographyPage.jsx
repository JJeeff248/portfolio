import React, { useCallback, useMemo } from "react";
import { Container } from "@mui/system";
import {
    ImageList,
    ImageListItem
} from "@mui/material";
import LargeImage from "./LargeImage";

const PhotographyPage = () => {
    const [selectedImg, setSelectedImg] = React.useState(null);
    const [altText, setAltText] = React.useState("");

    const flexCenter = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const handleImageClick = useCallback(
        (event) => {
            setSelectedImg(event.target.src);
            setAltText(event.target.alt);
        },
        [setSelectedImg, setAltText]
    );

    const images = useMemo(() => {
        let imageDir = require.context(
            "./images/my_gallery",
            false,
            /\.jpg$/
        );
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
        <Container maxWidth={"md"} style={flexCenter} sx={{ mt: 2 }}>
            {selectedImg !== null ? (
                <LargeImage selectedImg={selectedImg} altText={altText} setSelectedImg={setSelectedImg} setAltText={setAltText} />
            ) : (
                <ImageList variant="masonry" cols={3} gap={8}>
                    {images}
                </ImageList>
            )}
        </Container>
    );
};

export default PhotographyPage;
