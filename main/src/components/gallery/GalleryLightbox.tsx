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
import type { Photo } from "./galleryData";
import { ModalImage, NavButton } from "./galleryStyled";

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
                            <Tooltip title="Share image">
                                <IconButton
                                    onClick={onShare}
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(0, 0, 0, 0.4)",
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
                                    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
                                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                                        color: "white",
                                        padding: { xs: 1.5, sm: 2 },
                                        paddingX: { xs: 2, sm: 3 },
                                        width: "auto",
                                        maxWidth: "90%",
                                        marginTop: 2,
                                        marginBottom: { xs: 4, sm: 0 },
                                        borderRadius: 1,
                                        textAlign: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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
