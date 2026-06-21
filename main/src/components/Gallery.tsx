import { useMemo, useState } from "react";
import {
    Container,
    Typography,
    Box,
    CardMedia,
    Paper,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import Layout from "./Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { getPhotoIndexBySlug } from "./gallery/galleryData";
import { useGalleryManifest } from "./gallery/useGalleryManifest";
import { ImageCard, ImageCaption } from "./gallery/galleryStyled";
import GalleryLightbox from "./gallery/GalleryLightbox";

function Gallery() {
    const location = useLocation();
    const navigate = useNavigate();
    const { photos } = useGalleryManifest();

    const rawPhoto = useMemo(
        () => new URLSearchParams(location.search).get("photo"),
        [location.search]
    );
    const photoIndex = useMemo(
        () => getPhotoIndexBySlug(photos, rawPhoto?.trim() ?? null),
        [photos, rawPhoto]
    );

    const openModal = photoIndex !== null;

    const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>(
        {}
    );
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const goToPhotoParam = (slug: string) => {
        navigate(
            {
                pathname: location.pathname,
                search: `?photo=${encodeURIComponent(slug)}`,
                hash: "",
            },
            { replace: true }
        );
    };

    const handleImageClick = (slug: string) => {
        goToPhotoParam(slug);
    };

    const handleCloseModal = () => {
        navigate(
            {
                pathname: location.pathname,
                search: "",
                hash: "",
            },
            { replace: true }
        );
    };

    const handlePrevImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (photoIndex === null || photos.length === 0) return;
        const newIndex =
            photoIndex === 0 ? photos.length - 1 : photoIndex - 1;
        goToPhotoParam(photos[newIndex].slug);
    };

    const handleNextImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (photoIndex === null || photos.length === 0) return;
        const newIndex =
            photoIndex === photos.length - 1 ? 0 : photoIndex + 1;
        goToPhotoParam(photos[newIndex].slug);
    };

    const handleImageLoad = (slug: string) => {
        setImageLoaded((prev) => ({ ...prev, [slug]: true }));
    };

    const handleShare = async (event: React.MouseEvent) => {
        event.stopPropagation();

        if (photoIndex === null) return;

        const title = photos[photoIndex].title;
        const slug = photos[photoIndex].slug;

        const shareUrl = `${window.location.origin}${window.location.pathname}?photo=${encodeURIComponent(slug)}`;

        try {
            if ("share" in navigator) {
                await navigator.share({
                    title: title,
                    text: `Check out this photo: ${title}`,
                    url: shareUrl,
                });
                setSnackbarMessage("Shared successfully!");
                setSnackbarOpen(true);
            } else {
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
            <Container
                maxWidth="lg"
                sx={{
                    py: 4,
                    px: { xs: 2, sm: 3 },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        padding: { xs: 2, sm: 4 },
                        marginBottom: 6,
                        textAlign: "center",
                        borderRadius: 2,
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? "linear-gradient(135deg, hsl(180, 20.00%, 3.00%) 0%, hsl(170, 20.00%, 6.90%) 100%)"
                                : "linear-gradient(135deg,hsl(180, 20.00%, 96.00%) 0%,hsl(180, 37.50%, 93.20%) 100%)",
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        }}
                    >
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

                <Masonry
                    columns={{ xs: 2, sm: 2, md: 3 }}
                    spacing={{ xs: 2, sm: 3 }}
                >
                    {photos.map((photo, index) => (
                        <Box
                            key={photo.slug}
                            sx={{
                                width: "100%",
                                display: "block",
                                maxWidth: "100%",
                            }}
                        >
                            <ImageCard
                                onClick={() => handleImageClick(photo.slug)}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        aspectRatio: photo.aspectRatio,
                                        overflow: "hidden",
                                        borderRadius: 2,
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === "dark"
                                                ? "hsl(180, 10%, 12%)"
                                                : "hsl(180, 10%, 88%)",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={photo.src}
                                        alt={photo.title}
                                        loading={index < 6 ? "eager" : "lazy"}
                                        fetchPriority={
                                            index < 3 ? "high" : "auto"
                                        }
                                        onLoad={() =>
                                            handleImageLoad(photo.slug)
                                        }
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            opacity: imageLoaded[photo.slug]
                                                ? 1
                                                : 0,
                                            transition: "opacity 0.3s ease",
                                        }}
                                    />
                                </Box>
                                {imageLoaded[photo.slug] && (
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

            <GalleryLightbox
                open={openModal}
                photoIndex={photoIndex}
                photos={photos}
                onClose={handleCloseModal}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
                onShare={handleShare}
                snackbarOpen={snackbarOpen}
                snackbarMessage={snackbarMessage}
                onSnackbarClose={handleSnackbarClose}
            />
        </Layout>
    );
}

export default Gallery;
