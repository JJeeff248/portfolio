const getFeedback = async () => {
    const response = await fetch("https://api.chris-sa.com/cotiss");
    const data = await response.json();
    const feedback = data.feedback;
    const rating = data.rating;

    const feedbackContainer = document.getElementById("feedback-container");
    const feedbackIcon = feedbackContainer.querySelector("ion-icon");
    const feedbackText = feedbackContainer.querySelector("p");

    if (rating === 1) {
        feedbackIcon.setAttribute("name", "thumbs-down-outline");
    } else if (rating === 2) {
        feedbackIcon.setAttribute("name", "remove-outline");
    } else if (rating === 3) {
        feedbackIcon.setAttribute("name", "thumbs-up-outline");
    }

    feedbackText.textContent = feedback;
};

const postFeedback = async (feedback, rating) => {
    return await fetch("https://api.chris-sa.com/cotiss", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback, rating }),
    }).then((response) => {
        console.log(response);
        if (response.ok) return 200;
    }).catch((error) => {
        return null;
    });
};

window.addEventListener("load", () => {
    getFeedback();

    document.getElementById("feedback-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const feedback = e.target.feedback.value;
        const rating = e.target.rating.value;

        // Check both are valid
        if (feedback.trim().length <= 0 || rating < 1 || rating > 3) {
            return;
        }

        const toast = document.getElementById("feedback-toast");

        const status = await postFeedback(feedback, rating);

        if (status === 200) {
            e.target.reset();

            toast.querySelector("ion-icon").setAttribute("name", "checkmark-circle-outline");
            toast.querySelector("p").textContent = "Thanks for your feedback!";
            toast.setAttribute("success", true);
            toast.setAttribute("open", true);
            
        } else {
            toast.querySelector("ion-icon").setAttribute("name", "close-circle-outline");
            toast.querySelector("p").textContent = "Something went wrong!";
            toast.setAttribute("success", false);
            toast.setAttribute("open", true);
        }
        
        setTimeout(() => {
            toast.removeAttribute("open");
        }, 2000);
    });
});

// eslint-disable-next-line no-unused-vars
const closeToast = () => {
    console.log("closeToast");
    const toast = document.getElementById("feedback-toast");
    toast.removeAttribute("open");
}
