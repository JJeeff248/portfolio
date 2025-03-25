import awsCert from "../assets/aws-logo.png";
import moj from "../assets/moj-logo.png";
import scouts from "../assets/scouts-logo.png";

export interface Award {
    title: string;
    issuer?: string;
    date: string;
    description?: string;
    image?: string;
    url?: string;
    tags?: string[];
}

export const awards: Award[] = [
    {
        title: "AWS Certified Cloud Practitioner",
        date: "2023",
        image: awsCert,
        url: "https://www.credly.com/badges/abd5711a-990c-4b6b-a43e-bf6cf300bb03/public_url"
    },
    {
        title: "Certificate of Approval (Security Guard)",
        date: "2021",
        image: moj,
        tags: ["ID: 21-082641"],
        url: "https://forms.justice.govt.nz/search/PSPLA/"
    },
    {
        title: "Queen's Scout Award",
        date: "2021",
        image: scouts,
    }
]; 