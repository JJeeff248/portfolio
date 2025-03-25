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
            "A grade tracking website to minimize the time spent inputting course details.",
        image: twentythreefiftynine,
        features: [
            "Course templates for everyone to use",
            "Grade calculations",
            "Easy to use interface",
            "Responsive design for all devices",
        ],
        link: "/projects/twentythreefiftynine",
        githubUrl: "https://github.com/Twenty-Three-Fifty-Nine/grade-tracker",
        skills: ["PHP", "GCP", "Docker", "JavaScript", "SQL"],
    },
    {
        title: "Teach Python",
        description: "An interactive platform for learning Python programming",
        image: "/projects/teach-python/images/HeaderImg.jpg",
        link: "/projects/teach-python",
        htmlPath: "/projects/teach-python/index.html",
        skills: ["Python", "HTML", "CSS", "JavaScript"],
        githubUrl: "https://github.com/user/teach-python",
        longDescription:
            "Teach Python is an interactive learning platform designed to help users master Python programming through hands-on exercises, real-world projects, and comprehensive tutorials. The platform features a modern, user-friendly interface and provides immediate feedback on code execution.",
        features: [
            "Interactive code editor with real-time execution",
            "Comprehensive Python tutorials and exercises",
            "Progress tracking and achievement system",
            "Community features for sharing and collaboration",
            "Mobile-responsive design for learning on the go",
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
            "Help a Mate is a platform that enables individuals to create fundraising campaigns for various causes. Users can create campaigns, share their stories, set funding goals, and track progress. Visitors can browse campaigns and contribute to causes they care about.",
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
        description: "A platform for creating and sharing challenges",
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
