import React, { useCallback } from "react";
import {
    ImageListItem,
    ImageListItemBar,
    IconButton,
} from "@mui/material";
import { isMobile } from "react-device-detect";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";

const LargeImage = (props) => {
    const { selectedImg, altText, setSelectedImg, setAltText } = props;

    const handleCloseClick = useCallback(
        (event) => {
            setSelectedImg(null);
            setAltText("");
        },
        [setSelectedImg, setAltText]
    );

    return (
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
                style={{ maxHeight: isMobile ? "100vh" : "80vh" }}
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
    );
};

export default LargeImage;
