/* =========================================================
   SAKSHAM - USER DEFINED SKILL GROWTH SYSTEM
========================================================= */


/* =========================
   SKILL RECOMMENDATIONS
========================= */

const skillRecommendations = {

    "Digital Marketing": {
        icon: "📱",
        description:
            "Learn how to promote your products and reach more customers online.",
        benefit:
            "Can improve your online visibility and customer reach."
    },

    "E-Commerce": {
        icon: "🛒",
        description:
            "Learn how to sell products through online marketplaces.",
        benefit:
            "Helps you reach customers beyond your local market."
    },

    "Financial Management": {
        icon: "💰",
        description:
            "Learn budgeting, pricing, savings and business finance.",
        benefit:
            "Helps you manage your business finances effectively."
    },

    "Product Photography": {
        icon: "📸",
        description:
            "Learn how to take attractive product photographs.",
        benefit:
            "Better product presentation can help online selling."
    },

    "Sales": {
        icon: "🤝",
        description:
            "Improve customer communication, negotiation and selling skills.",
        benefit:
            "Can help increase customer reach and business opportunities."
    },

    "Business Management": {
        icon: "📊",
        description:
            "Develop planning, organization and business management skills.",
        benefit:
            "Helps you manage and grow your business."
    },

    "Social Media": {
        icon: "📱",
        description:
            "Learn how to use social platforms to promote your business.",
        benefit:
            "Can increase your online visibility and customer engagement."
    },

    "Communication": {
        icon: "💬",
        description:
            "Improve communication and customer interaction skills.",
        benefit:
            "Useful for customers, partnerships and business growth."
    },

    "Digital Skills": {
        icon: "💻",
        description:
            "Build essential digital skills for modern business.",
        benefit:
            "Can help you access digital opportunities and services."
    },

    "Agriculture": {
        icon: "🌱",
        description:
            "Develop modern agricultural and business practices.",
        benefit:
            "Can improve productivity and agricultural opportunities."
    }

};


/* =========================
   BUSINESS TYPE RECOMMENDATIONS
========================= */

const businessRecommendations = {

    "Handicraft": [
        "Digital Marketing",
        "E-Commerce",
        "Product Photography",
        "Sales"
    ],

    "Textile": [
        "Digital Marketing",
        "E-Commerce",
        "Product Photography",
        "Sales"
    ],

    "Food & Food Processing": [
        "Digital Marketing",
        "E-Commerce",
        "Financial Management",
        "Sales"
    ],

    "Agriculture": [
        "Digital Marketing",
        "Financial Management",
        "Sales",
        "E-Commerce"
    ],

    "Retail": [
        "Digital Marketing",
        "E-Commerce",
        "Financial Management",
        "Sales"
    ],

    "Services": [
        "Digital Marketing",
        "Business Management",
        "Communication",
        "Sales"
    ],

    "Digital Business": [
        "Digital Marketing",
        "E-Commerce",
        "Business Management",
        "Social Media"
    ],

    "Other": [
        "Digital Marketing",
        "Financial Management",
        "Business Management",
        "Sales"
    ]

};


/* =========================
   GET PROFILE
========================= */

function getProfile() {

    const savedProfile =
        localStorage.getItem(
            "sakshamProfile"
        );


    if (!savedProfile) {

        return null;

    }


    try {

        return JSON.parse(
            savedProfile
        );

    }

    catch(error) {

        console.error(
            "Could not load SAKSHAM profile.",
            error
        );

        return null;

    }

}


/* =========================
   GET USER SKILLS
========================= */

function getUserSkills() {

    const profile =
        getProfile();


    if (
        !profile ||
        !Array.isArray(profile.skills)
    ) {

        return [];

    }


    return profile.skills.filter(
        skill =>
            typeof skill === "string" &&
            skill.trim() !== ""
    );

}


/* =========================
   NORMALIZE SKILL
========================= */

function normalizeSkill(skill) {

    return skill
        .trim()
        .toLowerCase();

}


/* =========================
   GET RECOMMENDED SKILLS
========================= */

function getRecommendedSkills() {

    const profile =
        getProfile();


    if (!profile) {

        return [
            "Digital Marketing",
            "E-Commerce",
            "Financial Management"
        ];

    }


    const businessType =
        profile.businessType;


    let recommendations =
        businessRecommendations[
            businessType
        ] || [
            "Digital Marketing",
            "Financial Management",
            "Business Management",
            "Sales"
        ];


    const userSkills =
        getUserSkills()
        .map(normalizeSkill);


    return recommendations.filter(
        skill =>
            !userSkills.includes(
                normalizeSkill(skill)
            )
    );

}


/* =========================
   SKILL LEVEL
========================= */

function calculateSkillLevel(
    index,
    total
) {

    if (total === 1) {

        return 85;

    }


    const levels = [
        90,
        82,
        75,
        68,
        62,
        58,
        55,
        52
    ];


    return levels[
        index % levels.length
    ];

}


/* =========================
   DISPLAY USER SKILLS
========================= */

function displayUserSkills() {

    const container =
        document.getElementById(
            "user-skills-container"
        );


    if (!container) return;


    const skills =
        getUserSkills();


    if (skills.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🛠️
                </div>

                <h3>
                    No Skills Added Yet
                </h3>

                <p>
                    Go to My Profile and add your
                    skills to see your skill growth here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        skills.map(
            (skill, index) => {

                const level =
                    calculateSkillLevel(
                        index,
                        skills.length
                    );


                return `

                    <div class="user-skill">

                        <div class="skill-top">

                            <span class="skill-name">
                                ${escapeHTML(skill)}
                            </span>

                            <span class="skill-level">
                                ${level}%
                            </span>

                        </div>


                        <div class="progress-bar">

                            <div
                                class="progress"
                                style="width:${level}%">
                            </div>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   DISPLAY SKILL GAPS
========================= */

function displaySkillGaps() {

    const container =
        document.getElementById(
            "skill-gaps-container"
        );


    if (!container) return;


    const recommendations =
        getRecommendedSkills();


    if (recommendations.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🎉
                </div>

                <h3>
                    You're Doing Great!
                </h3>

                <p>
                    You already have the recommended
                    skills for your current business type.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        recommendations.map(
            (skill, index) => {

                const information =
                    skillRecommendations[
                        skill
                    ] || {

                        icon: "📚",

                        description:
                            "Develop this skill to improve your business opportunities.",

                        benefit:
                            "May help you qualify for additional opportunities."

                    };


                const priority =
                    index === 0
                    ? "HIGH PRIORITY"
                    : "MEDIUM";


                return `

                    <div class="skill-growth-card">

                        <div class="skill-growth-header">

                            <h3>
                                ${information.icon}
                                ${escapeHTML(skill)}
                            </h3>

                            <span class="skill-priority">
                                ${priority}
                            </span>

                        </div>


                        <p>
                            ${information.description}
                        </p>


                        <div class="skill-benefit">

                            🎯 Recommended for your
                            business profile.

                        </div>


                        <p>
                            ${information.benefit}
                        </p>


                        <button
                            class="skill-learning-btn"
                            onclick="startLearning('${escapeAttribute(skill)}')">

                            Start Learning →

                        </button>

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   DISPLAY LEARNING
========================= */

function displayLearning() {

    const container =
        document.getElementById(
            "skill-growth-container"
        );


    if (!container) return;


    const recommendations =
        getRecommendedSkills();


    if (recommendations.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🎓
                </div>

                <h3>
                    Keep Growing!
                </h3>

                <p>
                    Continue developing the skills
                    you already have.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        recommendations.slice(0, 4)
        .map(
            skill => {

                const information =
                    skillRecommendations[
                        skill
                    ] || {

                        icon: "📚",

                        description:
                            "Develop this skill to support your business growth."

                    };


                return `

                    <div class="skill-growth-card">

                        <div class="skill-growth-header">

                            <h3>
                                ${information.icon}
                                ${escapeHTML(skill)}
                            </h3>

                        </div>


                        <p>
                            ${information.description}
                        </p>


                        <button
                            class="skill-learning-btn"
                            onclick="startLearning('${escapeAttribute(skill)}')">

                            Explore →

                        </button>

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   UPDATE OVERVIEW
========================= */

function updateOverview() {

    const skills =
        getUserSkills();


    const recommendations =
        getRecommendedSkills();


    const skillCount =
        document.getElementById(
            "strongSkillsCount"
        );


    const gapCount =
        document.getElementById(
            "skillGapCount"
        );


    if (skillCount) {

        skillCount.textContent =
            skills.length;

    }


    if (gapCount) {

        gapCount.textContent =
            recommendations.length;

    }


    const improvement =
        Math.min(
            recommendations.length * 6,
            30
        );


    const improvementText =
        "+" + improvement + "%";


    const matchImprovement =
        document.getElementById(
            "matchImprovement"
        );


    const impactNumber =
        document.getElementById(
            "impactNumber"
        );


    if (matchImprovement) {

        matchImprovement.textContent =
            improvementText;

    }


    if (impactNumber) {

        impactNumber.textContent =
            improvementText;

    }

}


/* =========================
   START LEARNING
========================= */

function startLearning(skill) {

    const modal =
        document.getElementById(
            "modal"
        );


    const content =
        document.getElementById(
            "modal-content"
        );


    if (!modal || !content) {

        alert(
            "Learning module for " +
            skill +
            " is coming soon."
        );

        return;

    }


    const information =
        skillRecommendations[
            skill
        ] || {

            icon: "📚",

            description:
                "Build this skill to improve your business opportunities."

        };


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:55px">
                ${information.icon}
            </div>

            <h2>
                Learn ${escapeHTML(skill)}
            </h2>

            <p>
                ${information.description}
            </p>

        </div>


        <div style="
            background:#edf5ef;
            padding:20px;
            border-radius:12px;
            margin:20px 0;
        ">

            <h3>
                Your Learning Path
            </h3>

            <p>
                1️⃣ Understand the basics
            </p>

            <p>
                2️⃣ Practice the skill
            </p>

            <p>
                3️⃣ Apply it to your business
            </p>

            <p>
                4️⃣ Update your SAKSHAM profile
            </p>

        </div>


        <button
            class="primary-btn"
            onclick="markSkillLearning('${escapeAttribute(skill)}')">

            Mark as Learning →

        </button>

    `;


    modal.style.display =
        "flex";

}


/* =========================
   MARK LEARNING
========================= */

function markSkillLearning(skill) {

    let learningSkills =
        JSON.parse(
            localStorage.getItem(
                "sakshamLearningSkills"
            )
        ) || [];


    const exists =
        learningSkills.some(
            item =>
                normalizeSkill(item) ===
                normalizeSkill(skill)
        );


    if (!exists) {

        learningSkills.push(
            skill
        );

    }


    localStorage.setItem(
        "sakshamLearningSkills",
        JSON.stringify(
            learningSkills
        )
    );


    const content =
        document.getElementById(
            "modal-content"
        );


    if (!content) return;


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:55px">
                🚀
            </div>

            <h2>
                Learning Started!
            </h2>

            <p>
                You've added
                <strong>
                    ${escapeHTML(skill)}
                </strong>
                to your learning plan.
            </p>

            <p>
                Keep learning and update your
                skills when you're ready.
            </p>

            <button
                class="primary-btn"
                onclick="closeModal()">

                Done ✓

            </button>

        </div>

    `;

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =========================
   LOGOUT
========================= */

function logout() {

    window.location.href =
        "../index.html";

}


/* =========================
   SIDEBAR
========================= */

function updateSidebar() {

    const profile =
        getProfile();


    if (!profile) return;


    const name =
        profile.name ||
        "Entrepreneur";


    const businessType =
        profile.businessType ||
        "Entrepreneur";


    const sidebarName =
        document.getElementById(
            "sidebarUserName"
        );


    const sidebarAvatar =
        document.getElementById(
            "sidebarAvatar"
        );


    const sidebarBusinessType =
        document.getElementById(
            "sidebarBusinessType"
        );


    if (sidebarName) {

        sidebarName.textContent =
            name;

    }


    if (sidebarAvatar) {

        sidebarAvatar.textContent =
            name
            .charAt(0)
            .toUpperCase();

    }


    if (sidebarBusinessType) {

        sidebarBusinessType.textContent =
            businessType +
            " Entrepreneur";

    }

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================
   OUTSIDE MODAL CLICK
========================= */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "modal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();

        }

    }
);


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateSidebar();

        displayUserSkills();

        displaySkillGaps();

        displayLearning();

        updateOverview();

        console.log(
            "SAKSHAM User Defined Skill Growth loaded 🚀"
        );

    }
);