import React from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";

const AwardCard = (props) => {
    const { title, img, link, addition } = props;

    return (
        <Card sx={{ width: 250 }}>
            <CardMedia image={img} component="img" alt={title} height={150} />
            <CardContent sx={{ flexGrow: 1, minHeight: 110 }}>
                <Typography variant="h6" textAlign="left" mb={1}>{title}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }}>
                {addition && <Chip label={addition} />}
                {!addition && <Box sx={{ flexGrow: 1 }} />}
                <Button size="small" href={link} target="_blank">Learn More</Button>
            </CardActions>
        </Card>
    );
};

export default AwardCard;
