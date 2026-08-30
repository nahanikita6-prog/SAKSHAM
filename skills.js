/* =========================================================
   SAKSHAM - SKILL GROWTH SYSTEM
========================================================= */


/* =========================
   SKILL RECOMMENDATIONS
========================= */

const skillRecommendations = {

    "Digital Marketing": {
        icon: "📱",
        level: "High Priority",
        description:
            "Learn how to promote your products and reach more customers online.",
        benefit:
            "Can improve your visibility and unlock digital business opportunities."
    },

    "E-Commerce": {
        icon: "🛒",
        level: "High Priority",
        description:
            "Learn how to sell products through online marketplaces.",
        benefit:
            "Helps you reach customers beyond your local market."
    },

    "Financial Management": {
        icon: "💰",
        level: "Medium Priority",
        description:
            "Build skills in budgeting, pricing, savings and business finances.",
        benefit:
            "Helps you manage your business finances more effectively."
    },

    "Product Photography": {
        icon: "📸",
        level: "Medium Priority",
        description:
            "Learn how to take attractive and useful product photographs.",
        benefit:
            "Better product presentation can help online selling."
    },

    "Sales": {
        icon: "🤝",
        level: "Medium Priority",
        description:
            "Improve customer communication, negotiation and selling skills.",
        benefit:
            "Can help increase customer reach and business opportunities."
    },

    "Tailoring": {
        icon: "🧵",
        level: "Skill Building",
        description:
            "Develop practical tailoring and garment-making skills.",
        benefit:
            "Useful for textile, fashion and handicraft opportunities."
    },

    "Embroidery": {
        icon: "🪡",
        level: "Skill Building",
        description:
            "Improve embroidery techniques and product finishing.",
        benefit:
            "Useful for textile and handicraft-based businesses."
    },

    "Handicraft": {
        icon: "🎨",
        level: "Skill Building",
        description:
            "Develop traditional and creative handicraft skills.",
        benefit:
            "Can help you qualify for handicraft marketplaces and partnerships."
    },

    "Agriculture": {
        icon: "🌱",
        level: "Skill Building",
        description:
            "Develop modern agricultural and business practices.",
        benefit:
            "Can help improve productivity and access to agricultural opportunities."
    }
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

    catch (error) {

        console.error(
            "Could not load SAKSHAM profile.",
            error
        );

        return null;

    }

}


/* =========================
   GET OPPORTUNITIES
========================= */

function getOpportunities() {

    return [

        {
            title:
                "Textile Supplier Partnership",

            skills: [
                "Tailoring",
                "Embroidery",
                "Textile"
            ]

        },

        {
            title:
                "Handicraft Marketplace",

            skills: [
                "Handicraft",
                "Sales"
            ]

        },

        {
            title:
                "Women Entrepreneur Growth Fund",

            skills: [
                "Handicraft",
                "Sales",
                "Financial Management"
            ]

        },

        {
            title:
                "Rural Market Access Initiative",

            skills: [
                "Sales",
                "Handicraft",
                "E-Commerce"
            ]

        },

        {
            title:
                "Digital Skills Training Program",

            skills: [
                "Sales",
                "Digital Marketing"
            ]

        }

    ];

}


/* =========================
   FIND SKILL GAPS
========================= */

function findSkillGaps() {

    const profile =
        getProfile();


    /*
       If no profile exists,
       show general recommendations.
    */

    if (!profile) {

        return [
            "Digital Marketing",
            "E-Commerce",
            "Financial Management"
        ];

    }


    const userSkills =
        (profile.skills || [])
        .map(
            skill =>
                skill.toLowerCase()
        );


    const opportunities =
        getOpportunities();


    const missingSkills = [];


    opportunities.forEach(
        opportunity => {

            opportunity.skills.forEach(
                skill => {

                    const exists =
                        userSkills.includes(
                            skill.toLowerCase()
                        );


                    if (
                        !exists &&
                        !missingSkills.includes(
                            skill
                        )
                    ) {

                        missingSkills.push(
                            skill
                        );

                    }

                }
            );

        }
    );


    return missingSkills;

}


/* =========================
   COUNT OPPORTUNITIES
   EACH SKILL CAN UNLOCK
========================= */

function countSkillBenefits(
    skill
) {

    const opportunities =
        getOpportunities();


    let count = 0;


    opportunities.forEach(
        opportunity => {

            const containsSkill =
                opportunity.skills.some(
                    requiredSkill =>
                        requiredSkill
                            .toLowerCase()
                        ===
                        skill.toLowerCase()
                );


            if (containsSkill) {

                count++;

            }

        }
    );


    return count;

}


/* =========================
   CREATE SKILL CARD
========================= */

function createSkillCard(
    skill
) {

    const information =
        skillRecommendations[
            skill
        ] || {

            icon: "📚",

            level:
                "Recommended",

            description:
                "Develop this skill to improve your business opportunities.",

            benefit:
                "May help you qualify for additional opportunities."

        };


    const opportunityCount =
        countSkillBenefits(
            skill
        );


    return `

        <div class="skill-growth-card">

            <div class="skill-growth-icon">

                ${information.icon}

            </div>


            <div class="skill-growth-content">

                <div class="skill-growth-header">

                    <h3>
                        ${skill}
                    </h3>


                    <span class="skill-priority">

                        ${information.level}

                    </span>

                </div>


                <p>

                    ${information.description}

                </p>


                <div class="skill-benefit">

                    🎯 Helps unlock
                    <strong>
                        ${opportunityCount}
                    </strong>
                    opportunity
                    ${opportunityCount !== 1 ? "ies" : "y"}

                </div>


                <p class="skill-benefit-text">

                    ${information.benefit}

                </p>


                <button
                    class="primary-btn skill-learning-btn"
                    onclick="startLearning('${skill}')">

                    Start Learning →

                </button>

            </div>

        </div>

    `;

}


/* =========================
   SHOW SKILL GROWTH
========================= */

function displaySkillGrowth() {

    const container =
        document.getElementById(
            "skill-growth-container"
        );


    if (!container) {

        console.warn(
            "skill-growth-container not found."
        );

        return;

    }


    const profile =
        getProfile();


    const skillGaps =
        findSkillGaps();


    /*
       No profile
    */

    if (!profile) {

        container.innerHTML = `

            <div class="skill-empty-state">

                <div style="font-size:50px">
                    🧠
                </div>


                <h2>
                    Create Your SAKSHAM Profile
                </h2>


                <p>
                    Create your profile first so
                    SAKSHAM can recommend skills
                    based on your opportunities.
                </p>


                <button
                    class="primary-btn"
                    onclick="startJourney()">

                    Create Profile →

                </button>

            </div>

        `;

        return;

    }


    /*
       No missing skills
    */

    if (skillGaps.length === 0) {

        container.innerHTML = `

            <div class="skill-empty-state">

                <div style="font-size:55px">
                    🎉
                </div>


                <h2>
                    Great Job, ${profile.name}!
                </h2>


                <p>
                    You currently have the skills
                    needed for the available opportunities.
                </p>

            </div>

        `;

        return;

    }


    /*
       Create cards
    */

    container.innerHTML =

        skillGaps
        .map(
            skill =>
                createSkillCard(
                    skill
                )
        )
        .join("");

}


/* =========================
   START LEARNING
========================= */

function startLearning(
    skill
) {

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
            `Learning module for ${skill} is coming soon.`
        );

        return;

    }


    const information =
        skillRecommendations[
            skill
        ] || {

            icon: "📚",

            description:
                "Build this skill to improve your opportunities."

        };


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:60px">

                ${information.icon}

            </div>


            <h2>
                Learn ${skill}
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
            onclick="markSkillLearning('${skill}')">

            Mark Skill as Learning →

        </button>

    `;


    modal.style.display =
        "flex";

}


/* =========================
   MARK SKILL AS LEARNING
========================= */

function markSkillLearning(
    skill
) {

    let learningSkills =
        JSON.parse(
            localStorage.getItem(
                "sakshamLearningSkills"
            )
        ) || [];


    if (
        !learningSkills.includes(
            skill
        )
    ) {

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


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:60px">
                🚀
            </div>


            <h2>
                Learning Started!
            </h2>


            <p>

                You've added

                <strong>
                    ${skill}
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

        displaySkillGrowth();

        console.log(
            "SAKSHAM Skill Growth loaded 🚀"
        );

    }
);