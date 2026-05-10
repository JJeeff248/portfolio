import { useState } from "react";
import {
    Box,
    IconButton,
    Modal,
    Tooltip,
    Snackbar,
    Alert,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { Photo, GalleryExif } from "./galleryData";
import { ModalImage, NavButton } from "./galleryStyled";

function formatExifLine(exif: GalleryExif): string[] {
    const lines: string[] = [];
    if (exif.camera) lines.push(exif.camera);
    if (exif.lens) lines.push(exif.lens);
    const exposure: string[] = [];
    if (exif.focalLengthMm != null) {
        exposure.push(`${exif.focalLengthMm}mm`);
    }
    if (exif.aperture != null) exposure.push(`ƒ/${exif.aperture}`);
    if (exif.exposureSeconds != null) {
        exposure.push(
            exif.exposureSeconds >= 1
                ? `${exif.exposureSeconds}s`
                : `1/${Math.round(1 / exif.exposureSeconds)}s`
        );
    }
    if (exif.iso != null) exposure.push(`ISO ${exif.iso}`);
    if (exposure.length > 0) lines.push(exposure.join(" · "));
    if (exif.capturedAt) lines.push(exif.capturedAt);
    if (exif.rawNote && lines.length === 0) lines.push(exif.rawNote);
    return lines;
}

interface GalleryLightboxProps {
    open: boolean;
    photoIndex: number | null;
    photos: Photo[];
    onClose: () => void;
    onPrev: (e: React.MouseEvent) => void;
    onNext: (e: React.MouseEvent) => void;
    onShare: (e: React.MouseEvent) => void;
    snackbarOpen: boolean;
    snackbarMessage: string;
    onSnackbarClose: () => void;
}

function GalleryLightbox({
    open,
    photoIndex,
    photos,
    onClose,
    onPrev,
    onNext,
    onShare,
    snackbarOpen,
    snackbarMessage,
    onSnackbarClose,
}: GalleryLightboxProps) {
    const current = photoIndex !== null ? photos[photoIndex] : null;
    const hasExif =
        current?.exif &&
        Object.keys(current.exif).length > 0 &&
        formatExifLine(current.exif).length > 0;

    const [exifOpen, setExifOpen] = useState(true);
    const [prevPhotoIndex, setPrevPhotoIndex] = useState<number | null>(photoIndex);
    if (prevPhotoIndex !== photoIndex) {
        setPrevPhotoIndex(photoIndex);
        setExifOpen(photoIndex !== null ? (photos[photoIndex]?.showExifDefault ?? true) : true);
    }

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="image-modal"
                sx={{
                    backdropFilter: "blur(5px)",
                    zIndex: 1050,
                }}
            >
                <ModalImage onClick={onClose}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: { xs: 10, sm: "-40px" },
                                right: { xs: 10, sm: 0 },
                                display: "flex",
                                gap: 1,
                                zIndex: 10,
                            }}
                        >
                            {photoIndex !== null && hasExif && (
                                <Tooltip
                                    title={
                                        exifOpen ? "Hide camera info" : "Show camera info"
                                    }
                                >
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExifOpen((v) => !v);
                                        }}
                                        sx={{
                                            color: "white",
                                            backgroundColor:
                                                "rgba(0, 0, 0, 0.4)",
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(0, 0, 0, 0.6)",
                                            },
                                        }}
                                    >
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Share image">
                                <IconButton
                                    onClick={onShare}
                                    sx={{
                                        color: "white",
                                        backgroundColor:
                                            "rgba(0, 0, 0, 0.4)",
                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(0, 0, 0, 0.6)",
                                        },
                                    }}
                                >
                                    {"share" in navigator ? (
                                        <ShareIcon />
                                    ) : (
                                        <ContentCopyIcon />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    color: "white",
                                    backgroundColor:
                                        "rgba(0, 0, 0, 0.4)",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(0, 0, 0, 0.6)",
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {photoIndex !== null && (
                            <>
                                <NavButton
                                    onClick={onPrev}
                                    sx={{
                                        left: { xs: 10, sm: 10 },
                                    }}
                                    aria-label="previous image"
                                >
                                    <ArrowBackIosNewIcon
                                        sx={{
                                            fontSize: { xs: 24, sm: 30 },
                                        }}
                                    />
                                </NavButton>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        height: {
                                            xs: "calc(75vh - 120px)",
                                            sm: "calc(80vh - 80px)",
                                        },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        sx={{
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                            boxShadow:
                                                "0 4px 20px rgba(0,0,0,0.2)",
                                        }}
                                        src={photos[photoIndex].src}
                                        alt={photos[photoIndex].title}
                                    />
                                </Box>
                                <NavButton
                                    onClick={onNext}
                                    sx={{
                                        right: { xs: 10, sm: 10 },
                                    }}
                                    aria-label="next image"
                                >
                                    <ArrowForwardIosIcon
                                        sx={{
                                            fontSize: { xs: 24, sm: 30 },
                                        }}
                                    />
                                </NavButton>
                                <Box
                                    sx={{
                                        backgroundColor:
                                            "rgba(0, 0, 0, 0.75)",
                                        color: "white",
                                        padding: { xs: 1.5, sm: 2 },
                                        paddingX: { xs: 2, sm: 3 },
                                        width: "auto",
                                        maxWidth: "90%",
                                        marginTop: 2,
                                        marginBottom: { xs: 4, sm: 0 },
                                        borderRadius: 1,
                                        textAlign: "center",
                                        boxShadow:
                                            "0 4px 8px rgba(0,0,0,0.2)",
                                        zIndex: 1,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: {
                                                xs: "0.9rem",
                                                sm: "1.25rem",
                                            },
                                            textShadow:
                                                "0 1px 2px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        {photos[photoIndex].title}
                                    </Typography>
                                </Box>

                                {hasExif && current?.exif && exifOpen && (
                                    <Box
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            backgroundColor:
                                                "rgba(0, 0, 0, 0.65)",
                                            color: "rgba(255,255,255,0.92)",
                                            padding: 1.5,
                                            paddingX: 2,
                                            maxWidth: "min(90%, 520px)",
                                            marginTop: 1,
                                            marginBottom: { xs: 3, sm: 0 },
                                            borderRadius: 1,
                                            textAlign: "left",
                                            alignSelf: "center",
                                        }}
                                    >
                                        {formatExifLine(current.exif).map(
                                            (line, i) => (
                                                <Typography
                                                    key={i}
                                                    variant="body2"
                                                    sx={{
                                                        opacity: 0.95,
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    {line}
                                                </Typography>
                                            )
                                        )}
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </ModalImage>
            </Modal>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={onSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{ mb: { xs: 7, sm: 0 } }}
            >
                <Alert
                    onClose={onSnackbarClose}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default GalleryLightbox;
