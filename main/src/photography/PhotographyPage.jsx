import React, { useCallback, useMemo } from "react";
import { Container } from "@mui/system";
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
} from "@mui/material";
import { isMobile } from "react-device-detect";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";

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

    const handleCloseClick = useCallback(
        (event) => {
            setSelectedImg(null);
            setAltText("");
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
                <ImageListItem key={altText}>
                    <IconButton
                        onClick={handleCloseClick}
                        aria-label={`close`}
                        sx={{
                            color: "rgba(255, 255, 255, 0.54)",
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={selectedImg}
                        alt={altText}
                        loading="lazy"
                        style={
                            {maxHeight: isMobile ? "100vh" : "80vh",}
                        }
                    />
                    <ImageListItemBar
                        title={altText}
                        actionIcon={
                            <IconButton
                                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                aria-label={`star ${altText}`}
                            >
                                <StarBorderIcon />
                            </IconButton>
                        }
                    />
                </ImageListItem>
            ) : (
                <ImageList variant="masonry" cols={3} gap={8}>
                    {images}
                </ImageList>
            )}
        </Container>
    );
};

export default PhotographyPage;
