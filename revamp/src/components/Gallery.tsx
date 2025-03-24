import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    Modal,
    IconButton,
    Paper,
    Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Masonry from "@mui/lab/Masonry";
import Layout from "./Layout";

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

const ImageCard = styled(Card)(({ theme }) => ({
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

const ModalImage = styled(Box)(({ theme }) => ({
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

const NavButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
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
    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [loading, setLoading] = useState<Record<number, boolean>>({});
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

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

    const handleImageClick = (index: number) => {
        setSelectedImage(index);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handlePrevImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedImage((prev) => {
            if (prev === null) return null;
            return prev === 0 ? photos.length - 1 : prev - 1;
        });
    };

    const handleNextImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedImage((prev) => {
            if (prev === null) return null;
            return prev === photos.length - 1 ? 0 : prev + 1;
        });
    };

    const handleImageLoad = (
        index: number,
        event: React.SyntheticEvent<HTMLImageElement>
    ) => {
        const img = event.currentTarget;
        setLoading((prev) => ({ ...prev, [index]: false }));
        setImageLoaded((prev) => ({ ...prev, [index]: true }));
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
                    }}
                >
                    <Typography variant="h1" component="h1" gutterBottom>
                        Photography
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
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
                                    onLoad={(e) => handleImageLoad(index, e)}
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
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{
                                position: "absolute",
                                top: "-40px",
                                right: 0,
                                color: "white",
                                backgroundColor: "rgba(0, 0, 0, 0.4)",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                },
                                zIndex: 10,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

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
        </Layout>
    );
}

export default Gallery;
