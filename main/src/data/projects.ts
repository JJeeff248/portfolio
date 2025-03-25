import helpamate from "../assets/helpamate.png";
import chapschallenge from "../assets/chaps-challenge.png";
import twentythreefiftynine from "../assets/2359.png";

export interface Project {
    title: string;
    description: string;
    image: string;
    link: string;
    skills: string[];
    longDescription?: string;
    features?: string[];
    htmlPath?: string;
    externalUrl?: string;
    githubUrl?: string;
}

export const projects: Project[] = [
    {
        title: "Twenty Three Fifty Nine",
        description:
            "A grade tracking website for university students.",
        longDescription: `23:59 was created over a summer in collaboration with my friend Abdul. We wanted a
        project that could help us and others in the future and develop our skills as software engineers.
        
        23:59 is a grade tracking tool where users can create templates for courses that other students can then use.
        This saves time and allows users to update course templates when the course changes. `,
        image: twentythreefiftynine,
        features: [
            "Course templates for everyone to use",
            "Grade calculations",
            "Easy to use interface",
        ],
        link: "/projects/twentythreefiftynine",
        githubUrl: "https://github.com/Twenty-Three-Fifty-Nine/grade-tracker",
        skills: ["ReactJS", "AWS", "DynamoDB", "Lambdas", "SES"],
    },
    {
        title: "Teach Python",
        description: "A website for learning Python programming",
        image: "/projects/teach-python/images/HeaderImg.jpg",
        link: "/projects/teach-python",
        htmlPath: "/projects/teach-python/index.html",
        skills: ["Python", "HTML", "CSS", "JavaScript"],
        githubUrl: "https://github.com/user/teach-python",
        longDescription:
            `Teach Python is an learning website designed to help users get started with Python programming.
            It was created as one of my later projects in high-school where we had to design and create a website
            to teach users something.`,
        features: [
            "Easy to follow",
            "Code snippets with syntax highlighting"
        ],
    },
    {
        title: "Help a Mate",
        description:
            "A fundraising platform to help individuals raise funds for causes",
        image: helpamate,
        link: "/projects/helpamate",
        externalUrl: "http://helpamate.chris-sa.com/",
        skills: ["PHP", "GCP", "Docker", "JavaScript", "SQL"],
        githubUrl: "https://github.com/JJeeff248/HelpAMate",
        longDescription:
            `Help a Mate is a platform that enables individuals to create fundraising campaigns for various causes.
            The page was created as my final year high-school project and involved designing, gathering feedback and itterating on the design.
            The project included setting up an SQL database with different permission levels and linking everything together with PHP.
            
            It is now hosted in a docker container on Google Cloud`,
        features: [
            "Campaign creation and management",
            "Progress tracking with visual indicators",
            "User profiles and campaign listings",
            "Responsive design for all devices",
            "Mock donation system for demonstration purposes",
        ],
    },
    {
        title: "Chap's Challenge",
        description: "A puzzle game created in Java",
        longDescription: `This project was completed in my second year of university as a group of 5.
        It is a version of Chips Challenge recreated, with permission, with our own styles and music.
        
        This was a great learning experience wokring in a team where people had different roles and
        we had to organise our development and merging strategy.`,
        image: chapschallenge,
        link: "/projects/chapschallenge",
        githubUrl: "https://github.com/jjeeff248/chaps-challenge",
        features: [
            "Create and share challenges",
            "View and participate in challenges",
            "Leaderboard for tracking progress",
            "Responsive design for all devices",
        ],
        skills: ["Java", "XML", "GIT"],
    },
];
