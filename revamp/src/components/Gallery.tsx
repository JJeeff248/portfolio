import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    Modal,
    IconButton,
    Paper,
    Skeleton,
    Tooltip,
    Snackbar,
    Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Masonry from "@mui/lab/Masonry";
import Layout from "./Layout";
import { useLocation } from "react-router-dom";

const imageNames = [
    "00_Bee_sitting_on_a_purple_flower.webp",
    "01_Sunset_over_Makara_hills_with_windmill_silhouettes.webp",
    "02_Capybara_at_Wellington_zoo.webp",
    "08_Fruit_Splash.webp",
    "09_A_leaf.webp",
    "10_Happy_otter_napping.webp",
    "11_Tui_hanging_upside_down_in_a_kowhai_tree.webp",
    "12_Gas_burner_in_love.webp",
    "13_Stunning_seagull.webp",
    "14_Crab_chilling_under_some_water.webp",
    "15_The_glowing_man.webp",
    "16_Wood_fire_burning_hot.webp",
    "17_Huka_falls.webp",
    "18_Fly_on_a_tree.webp",
    "19_Morning_frost_on_a_green_wooden_railing.webp",
    "20_Train_Platform.webp",
    "21_Otters_sleeping.webp",
    "22_Is_there_a_ghost.webp",
    "23_Donkey_at_a_petting_zoo.webp",
];

const baseUrl = "https://static.chris-sa.com/gallery/";

interface Photo {
    src: string;
    title: string;
    aspectRatio?: number;
}

const ImageCard = styled(Card)(() => ({
    width: "100%",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.3s ease",
    position: "relative",
    "&:hover": {
        transform: "scale(1.03)",
    },
    "&:hover .image-caption": {
        opacity: 1,
    },
}));

const ModalImage = styled(Box)(() => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const NavButton = styled(IconButton)(() => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "white",
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    zIndex: 10,
}));

const ImageCaption = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: theme.spacing(1),
    transition: "opacity 0.3s ease",
    opacity: 0,
}));

function Gallery() {
    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [loading, setLoading] = useState<Record<number, boolean>>({});
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Process image names to get titles
    useEffect(() => {
        const processedPhotos = imageNames.map((name) => {
            const title = name.split(".")[0].substring(3).replace(/_/g, " ");
            return {
                src: `${baseUrl}${name}`,
                title,
            };
        });
        setPhotos(processedPhotos);

        // Initialize loading state for all images
        const initialLoadingState: Record<number, boolean> = {};
        processedPhotos.forEach((_, index) => {
            initialLoadingState[index] = true;
        });
        setLoading(initialLoadingState);

        // Initialize loaded state
        const initialLoadedState: Record<number, boolean> = {};
        processedPhotos.forEach((_, index) => {
            initialLoadedState[index] = false;
        });
        setImageLoaded(initialLoadedState);
    }, []);

    // Check for hash parameter and open modal if present
    useEffect(() => {
        const hash = location.hash;
        if (hash && hash.startsWith("#photo=")) {
            const photoIndex = parseInt(hash.substring(7), 10);
            if (
                !isNaN(photoIndex) &&
                photoIndex >= 0 &&
                photoIndex < imageNames.length
            ) {
                setSelectedImage(photoIndex);
                setOpenModal(true);
            }
        }
    }, [location.hash, photos]);

    const handleImageClick = (index: number) => {
        setSelectedImage(index);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        // Clear the hash when closing the modal
        if (location.hash.startsWith("#photo=")) {
            window.history.pushState(
                "",
                document.title,
                window.location.pathname + window.location.search
            );
        }
        setOpenModal(false);
    };

    const handlePrevImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedImage((prev) => {
            if (prev === null) return null;
            const newIndex = prev === 0 ? photos.length - 1 : prev - 1;
            updateUrlHash(newIndex);
            return newIndex;
        });
    };

    const handleNextImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedImage((prev) => {
            if (prev === null) return null;
            const newIndex = prev === photos.length - 1 ? 0 : prev + 1;
            updateUrlHash(newIndex);
            return newIndex;
        });
    };

    const updateUrlHash = (index: number) => {
        window.history.replaceState(null, "", `#photo=${index}`);
    };

    const handleImageLoad = (index: number) => {
        setLoading((prev) => ({ ...prev, [index]: false }));
        setImageLoaded((prev) => ({ ...prev, [index]: true }));
    };

    const handleShare = async (event: React.MouseEvent) => {
        event.stopPropagation();

        if (selectedImage === null) return;

        const title = photos[selectedImage].title;

        // Create a shareable URL that points back to this gallery with the correct photo selected
        const shareUrl = `${window.location.origin}${window.location.pathname}#photo=${selectedImage}`;

        try {
            // Try using the Web Share API first
            if ("share" in navigator) {
                await navigator.share({
                    title: title,
                    text: `Check out this photo: ${title}`,
                    url: shareUrl,
                });
                setSnackbarMessage("Shared successfully!");
                setSnackbarOpen(true);
            } else {
                // Fallback to copying the URL to clipboard
                if ("clipboard" in navigator) {
                    await (
                        navigator as Navigator & {
                            clipboard: {
                                writeText(text: string): Promise<void>;
                            };
                        }
                    ).clipboard.writeText(shareUrl);
                    setSnackbarMessage("Link copied to clipboard!");
                    setSnackbarOpen(true);
                } else {
                    setSnackbarMessage(
                        "Sharing not supported on this browser."
                    );
                    setSnackbarOpen(true);
                }
            }
        } catch (error) {
            console.error("Error sharing:", error);
            setSnackbarMessage("Failed to share. Try copying the URL instead.");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        padding: 4,
                        marginBottom: 6,
                        textAlign: "center",
                        borderRadius: 2,
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? "linear-gradient(135deg, hsl(180, 20.00%, 3.00%) 0%, hsl(170, 20.00%, 6.90%) 100%)"
                                : "linear-gradient(135deg,hsl(180, 20.00%, 96.00%) 0%,hsl(180, 37.50%, 93.20%) 100%)",
                    }}
                >
                    <Typography variant="h1" component="h1" gutterBottom>
                        Photography
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: (theme) => theme.palette.text.primary,
                        }}
                    >
                        A collection of moments captured through my lens
                    </Typography>
                </Paper>

                <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
                    {photos.map((photo, index) => (
                        <Box
                            key={index}
                            sx={{ width: "100%", display: "block" }}
                        >
                            <ImageCard onClick={() => handleImageClick(index)}>
                                {loading[index] && (
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height={200}
                                        animation="wave"
                                    />
                                )}
                                <CardMedia
                                    component="img"
                                    image={photo.src}
                                    alt={photo.title}
                                    onLoad={() => handleImageLoad(index)}
                                    sx={{
                                        width: "100%",
                                        display: imageLoaded[index]
                                            ? "block"
                                            : "none",
                                    }}
                                />
                                {imageLoaded[index] && (
                                    <ImageCaption className="image-caption">
                                        <Typography variant="body2">
                                            {photo.title}
                                        </Typography>
                                    </ImageCaption>
                                )}
                            </ImageCard>
                        </Box>
                    ))}
                </Masonry>
            </Container>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="image-modal"
                sx={{ backdropFilter: "blur(5px)" }}
            >
                <ModalImage onClick={handleCloseModal}>
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
                                top: "-40px",
                                right: 0,
                                display: "flex",
                                gap: 1,
                                zIndex: 10,
                            }}
                        >
                            <Tooltip title="Share image">
                                <IconButton
                                    onClick={handleShare}
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
                                onClick={handleCloseModal}
                                sx={{
                                    color: "white",
                                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {selectedImage !== null && (
                            <>
                                <NavButton
                                    onClick={handlePrevImage}
                                    sx={{ left: 10 }}
                                    aria-label="previous image"
                                >
                                    <ArrowBackIosNewIcon />
                                </NavButton>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        height: "calc(80vh - 80px)",
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
                                        src={photos[selectedImage].src}
                                        alt={photos[selectedImage].title}
                                    />
                                </Box>
                                <NavButton
                                    onClick={handleNextImage}
                                    sx={{ right: 10 }}
                                    aria-label="next image"
                                >
                                    <ArrowForwardIosIcon />
                                </NavButton>
                                <Box
                                    sx={{
                                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                                        color: "white",
                                        padding: 2,
                                        paddingX: 3,
                                        width: "auto",
                                        maxWidth: "90%",
                                        marginTop: 2,
                                        borderRadius: 1,
                                        textAlign: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 500,
                                            textShadow:
                                                "0 1px 2px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        {photos[selectedImage].title}
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
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Layout>
    );
}

export default Gallery;
