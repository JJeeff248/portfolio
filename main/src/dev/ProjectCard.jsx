import React from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";

import GitHubIcon from '@mui/icons-material/GitHub';

const ProjectCard = (props) => {
    const { title, link, github, img, tags } = props;

    return (
        <Card variant="outlined" sx={{ width: 400, m: 1 }}>
            <CardMedia
                component={img ? "img" : "iframe"}
                src={img ? img : link}
                frameBorder="0"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                width={400}
                height={180}
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
                {link && <Button size="small" color="primary" href={link} target="_blank">View</Button> }
                {github && <Button size="small" color="primary" href={github} target="_blank"><GitHubIcon /></Button> }
            </CardActions>
        </Card>
    );
}

export default ProjectCard;