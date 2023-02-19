import React from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";


const ProjectCard = (props) => {
    const { title, link, tags } = props;

    return (
        <Card variant="outlined" sx={{ width: 350, m: 1 }}>
            <CardMedia
                component="iframe"
                src={link}
                frameBorder="0"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                // make aspect ratio 16:9
                width={350}
                height={170}
                scrolling="no"
                sx={{ overFlow: "hidden" }}
            />
            <CardContent>
                    {tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                    ))
                }
                <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                    {title}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button size="small" color="primary" href={link} target="_blank">View Project</Button>
            </CardActions>
        </Card>
    );
}

export default ProjectCard;