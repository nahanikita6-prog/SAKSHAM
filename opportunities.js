/* =========================================================
   SAKSHAM - OPPORTUNITIES
   USER-DEFINED MATCHING SYSTEM
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let allOpportunities = [];

let selectedOpportunity = null;

let currentUserProfile = null;

let savedOpportunities =
    JSON.parse(
        localStorage.getItem("sakshamSavedOpportunities")
    ) || [];


/* =========================================================
   LOAD USER PROFILE
========================================================= */

function loadUserProfile() {

    const savedProfile =
        localStorage.getItem("sakshamProfile");

    if (!savedProfile) {

        console.log(
            "No sakshamProfile found."
        );

        return null;
    }

    try {

        return JSON.parse(savedProfile);

    } catch (error) {

        console.error(
            "Could not read sakshamProfile:",
            error
        );

        return null;
    }
}


/* =========================================================
   GET USER SKILLS
========================================================= */

function getUserSkills(profile) {

    if (!profile) return [];


    let skills =
        profile.skills ||
        profile.preferredSkills ||
        profile.preferred_skills ||
        [];


    if (Array.isArray(skills)) {

        return skills
            .map(skill =>
                String(skill)
                    .trim()
                    .toLowerCase()
            )
            .filter(Boolean);

    }


    if (typeof skills === "string") {

        return skills
            .split(",")
            .map(skill =>
                skill
                    .trim()
                    .toLowerCase()
            )
            .filter(Boolean);

    }


    return [];

}


/* =========================================================
   GET USER BUSINESS TYPE
========================================================= */

function getUserBusinessType(profile) {

    if (!profile) return "";

    return String(
        profile.businessType ||
        profile.business ||
        profile.category ||
        ""
    )
    .trim()
    .toLowerCase();

}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   MATCH SCORE
========================================================= */

/*
   REAL USER-DEFINED MATCHING

   Score is based on:

   1. Required skills
   2. User's actual skills
   3. Business/category relevance
   4. Opportunity text relevance

   No hard-coded opportunity scores.
*/

function calculateMatchScore(
    opportunity,
    profile
) {

    if (!opportunity || !profile) {

        return 0;

    }


    const userSkills =
        getUserSkills(profile);


    const businessType =
        getUserBusinessType(profile);


    const requiredSkills =
        Array.isArray(
            opportunity.required_skills
        )
            ? opportunity.required_skills
            : [];


    const normalizedRequiredSkills =
        requiredSkills
            .map(skill =>
                normalizeText(skill)
            )
            .filter(Boolean);


    let score = 0;


    /* =====================================================
       SKILL MATCH
    ===================================================== */

    if (
        normalizedRequiredSkills.length > 0 &&
        userSkills.length > 0
    ) {

        let matchedSkills = 0;


        normalizedRequiredSkills.forEach(
            requiredSkill => {

                const skillMatch =
                    userSkills.some(
                        userSkill => {

                            const normalizedUserSkill =
                                normalizeText(
                                    userSkill
                                );

                            return (
                                normalizedUserSkill ===
                                    requiredSkill ||

                                normalizedUserSkill.includes(
                                    requiredSkill
                                ) ||

                                requiredSkill.includes(
                                    normalizedUserSkill
                                )
                            );

                        }
                    );


                if (skillMatch) {

                    matchedSkills++;

                }

            }
        );


        const skillPercentage =
            matchedSkills /
            normalizedRequiredSkills.length;


        /*
           Skills account for 70% of the score.
        */

        score +=
            skillPercentage * 70;

    }


    /* =====================================================
       BUSINESS / CATEGORY MATCH
    ===================================================== */

    const opportunityCategory =
        normalizeText(
            opportunity.category
        );


    const opportunityBusiness =
        normalizeText(
            opportunity.business_type ||
            opportunity.business ||
            opportunity.target_business ||
            ""
        );


    if (businessType) {

        if (
            opportunityCategory &&
            (
                opportunityCategory.includes(
                    businessType
                ) ||
                businessType.includes(
                    opportunityCategory
                )
            )
        ) {

            score += 20;

        }
        else if (
            opportunityBusiness &&
            (
                opportunityBusiness.includes(
                    businessType
                ) ||
                businessType.includes(
                    opportunityBusiness
                )
            )
        ) {

            score += 20;

        }

    }


    /* =====================================================
       GENERAL PROFILE TEXT MATCH
    ===================================================== */

    const opportunityText =
        normalizeText(
            [
                opportunity.title,
                opportunity.description,
                opportunity.organization,
                opportunity.category
            ]
            .filter(Boolean)
            .join(" ")
        );


    if (
        businessType &&
        opportunityText.includes(
            normalizeText(businessType)
        )
    ) {

        score += 10;

    }


    /* =====================================================
       NO SKILLS / NO BUSINESS DATA
    ===================================================== */

    /*
       If the user hasn't added enough information,
       don't pretend they have a high match.
    */

    if (
        userSkills.length === 0 &&
        !businessType
    ) {

        return 0;

    }


    return Math.min(
        100,
        Math.round(score)
    );

}


/* =========================================================
   LOAD OPPORTUNITIES FROM SUPABASE
========================================================= */

async function loadOpportunities() {

    const grid =
        document.getElementById(
            "opportunityGrid"
        );


    if (!grid) {

        console.error(
            "Opportunity grid not found."
        );

        return;

    }


    grid.innerHTML = `

        <div style="
            grid-column:1/-1;
            text-align:center;
            padding:60px 20px;
        ">

            <div style="font-size:45px;">
                ⏳
            </div>

            <h3>
                Finding Opportunities...
            </h3>

            <p style="color:#68736c;">
                SAKSHAM is matching opportunities
                with your profile.
            </p>

        </div>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("opportunities")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Supabase error:",
                error
            );

            showDatabaseError();

            return;

        }


        allOpportunities =
            data || [];


        console.log(
            "Opportunities loaded:",
            allOpportunities
        );


        displayOpportunities(
            allOpportunities
        );


        updateOpportunityCount(
            allOpportunities.length
        );


    } catch (error) {

        console.error(
            "Unexpected error:",
            error
        );

        showDatabaseError();

    }

}


/* =========================================================
   DISPLAY OPPORTUNITIES
========================================================= */

function displayOpportunities(
    opportunities
) {

    const grid =
        document.getElementById(
            "opportunityGrid"
        );


    if (!grid) return;


    if (
        !opportunities ||
        opportunities.length === 0
    ) {

        grid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px 20px;
            ">

                <div style="
                    font-size:45px;
                    margin-bottom:15px;
                ">
                    🔍
                </div>

                <h3>
                    No opportunities found
                </h3>

                <p style="color:#68736c;">
                    Try changing your search
                    or filters.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML = "";


    opportunities.forEach(
        opportunity => {

            const card =
                createOpportunityCard(
                    opportunity
                );

            grid.appendChild(card);

        }
    );

}


/* =========================================================
   CREATE OPPORTUNITY CARD
========================================================= */

function createOpportunityCard(
    opportunity
) {

    const card =
        document.createElement("div");


    card.className =
        "opportunity-card";


    const title =
        opportunity.title ||
        "Untitled Opportunity";


    const organization =
        opportunity.organization ||
        "Organization";


    const category =
        opportunity.category ||
        "General";


    const description =
        opportunity.description ||
        "Opportunity available for eligible entrepreneurs.";


    const skills =
        Array.isArray(
            opportunity.required_skills
        )
            ? opportunity.required_skills
            : [];


    const experience =
        opportunity.minimum_experience ?? 0;


    /* REAL MATCH SCORE */

    const matchScore =
        calculateMatchScore(
            opportunity,
            currentUserProfile
        );


    card.dataset.category =
        normalizeText(category);


    card.dataset.match =
        matchScore;


    card.dataset.name =
        title;


    const isSaved =
        savedOpportunities.includes(
            opportunity.id
        );


    card.innerHTML = `

        <div class="opportunity-header">

            <span class="category">
                ${escapeHTML(
                    category.toUpperCase()
                )}
            </span>

            <span class="match-score">
                ${matchScore}%
            </span>

        </div>


        <h3>
            ${escapeHTML(title)}
        </h3>


        <div class="organization">
            🏢 ${escapeHTML(organization)}
        </div>


        <p>
            ${escapeHTML(description)}
        </p>


        <div class="skills-title">
            Required Skills
        </div>


        <div class="skills">

            ${
                skills.length > 0

                ? skills.map(
                    skill => {

                        const userSkills =
                            getUserSkills(
                                currentUserProfile
                            );


                        const normalizedSkill =
                            normalizeText(
                                skill
                            );


                        const matched =
                            userSkills.some(
                                userSkill => {

                                    const normalizedUserSkill =
                                        normalizeText(
                                            userSkill
                                        );

                                    return (
                                        normalizedUserSkill ===
                                            normalizedSkill ||

                                        normalizedUserSkill.includes(
                                            normalizedSkill
                                        ) ||

                                        normalizedSkill.includes(
                                            normalizedUserSkill
                                        )
                                    );

                                }
                            );


                        return `

                            <span class="${
                                matched
                                    ? "matched"
                                    : "missing"
                            }">

                                ${
                                    matched
                                        ? "✓"
                                        : "○"
                                }

                                ${escapeHTML(skill)}

                            </span>

                        `;

                    }
                ).join("")

                : `

                    <span>
                        General Skills
                    </span>

                `
            }

        </div>


        <div class="skills-title">
            Minimum Experience
        </div>


        <div style="
            font-size:11px;
            color:#68736c;
            margin-bottom:18px;
        ">

            ${experience}
            year${experience == 1 ? "" : "s"}

        </div>


        <div class="card-buttons">

            <button
                class="view-btn"
                onclick="showOpportunityDetails('${escapeAttribute(
                    opportunity.id
                )}')">

                View Details →

            </button>


            <button
                class="save-btn ${
                    isSaved
                        ? "saved"
                        : ""
                }"
                onclick="saveOpportunity(
                    '${escapeAttribute(
                        opportunity.id
                    )}',
                    this
                )">

                ${
                    isSaved
                        ? "♥"
                        : "♡"
                }

            </button>

        </div>

    `;


    return card;

}


/* =========================================================
   SEARCH
========================================================= */

function searchOpportunities() {

    applyCurrentFilters(
        allOpportunities
    );

}


/* =========================================================
   FILTER
========================================================= */

function filterOpportunities() {

    applyCurrentFilters(
        allOpportunities
    );

}


/* =========================================================
   APPLY SEARCH + FILTERS
========================================================= */

function applyCurrentFilters(
    source
) {

    const categorySelect =
        document.getElementById(
            "categoryFilter"
        );


    const matchSelect =
        document.getElementById(
            "matchFilter"
        );


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const category =
        categorySelect
            ? categorySelect.value.toLowerCase()
            : "all";


    const minimumMatch =
        matchSelect
            ? matchSelect.value
            : "all";


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        source.filter(
            opportunity => {

                const title =
                    normalizeText(
                        opportunity.title
                    );


                const organization =
                    normalizeText(
                        opportunity.organization
                    );


                const description =
                    normalizeText(
                        opportunity.description
                    );


                const opportunityCategory =
                    normalizeText(
                        opportunity.category
                    );


                const skills =
                    Array.isArray(
                        opportunity.required_skills
                    )
                        ? opportunity.required_skills
                        : [];


                const searchText =
                    `
                    ${title}
                    ${organization}
                    ${description}
                    ${opportunityCategory}
                    ${skills.join(" ")}
                    `.toLowerCase();


                const score =
                    calculateMatchScore(
                        opportunity,
                        currentUserProfile
                    );


                const matchesSearch =
                    !search ||
                    searchText.includes(
                        search
                    );


                const matchesCategory =
                    category === "all" ||
                    opportunityCategory === category;


                const matchesScore =
                    minimumMatch === "all" ||
                    score >= Number(
                        minimumMatch
                    );


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesScore
                );

            }
        );


    displayOpportunities(
        filtered
    );


    updateOpportunityCount(
        filtered.length
    );

}


/* =========================================================
   UPDATE OPPORTUNITY COUNT
========================================================= */

function updateOpportunityCount(
    count
) {

    const countElement =
        document.querySelector(
            ".match-info span"
        );


    if (!countElement) return;


    countElement.textContent =
        `${count} opportunit${
            count === 1
                ? "y"
                : "ies"
        } found`;

}


/* =========================================================
   SHOW DETAILS
========================================================= */

async function showOpportunityDetails(
    opportunityId
) {

    const opportunity =
        allOpportunities.find(
            item =>
                String(item.id) ===
                String(opportunityId)
        );


    if (!opportunity) {

        alert(
            "Opportunity information could not be found."
        );

        return;

    }


    selectedOpportunity =
        opportunity;


    const title =
        opportunity.title ||
        "Opportunity";


    const organization =
        opportunity.organization ||
        "Organization";


    const skills =
        Array.isArray(
            opportunity.required_skills
        )
            ? opportunity.required_skills
            : [];


    const experience =
        opportunity.minimum_experience ?? 0;


    const score =
        calculateMatchScore(
            opportunity,
            currentUserProfile
        );


    document.getElementById(
        "detailTitle"
    ).textContent =
        title;


    document.getElementById(
        "detailOrganization"
    ).textContent =
        "🏢 " + organization;


    document.getElementById(
        "detailScore"
    ).textContent =
        score + "%";


    const skillsContainer =
        document.getElementById(
            "matchedSkills"
        );


    skillsContainer.innerHTML =
        "";


    const userSkills =
        getUserSkills(
            currentUserProfile
        );


    if (skills.length === 0) {

        skillsContainer.innerHTML = `

            <div class="breakdown-item">

                <strong>
                    ✓ General Opportunity
                </strong>

                No specific skills were listed.

            </div>

        `;

    } else {

        skills.forEach(
            skill => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "breakdown-item";


                const normalizedSkill =
                    normalizeText(
                        skill
                    );


                const matched =
                    userSkills.some(
                        userSkill => {

                            const normalizedUserSkill =
                                normalizeText(
                                    userSkill
                                );


                            return (
                                normalizedUserSkill ===
                                    normalizedSkill ||

                                normalizedUserSkill.includes(
                                    normalizedSkill
                                ) ||

                                normalizedSkill.includes(
                                    normalizedUserSkill
                                )
                            );

                        }
                    );


                div.innerHTML = `

                    <strong>
                        ${
                            matched
                                ? "✓ Matched Skill"
                                : "○ Skill Gap"
                        }
                    </strong>

                    ${escapeHTML(skill)}

                `;


                skillsContainer.appendChild(
                    div
                );

            }
        );

    }


    document.getElementById(
        "missingSkills"
    ).textContent =
        `📌 Minimum experience: ${experience} year${
            experience == 1
                ? ""
                : "s"
        }`;


    document.getElementById(
        "detailsModal"
    ).style.display =
        "flex";

}


/* =========================================================
   CLOSE DETAILS
========================================================= */

function closeDetails() {

    const modal =
        document.getElementById(
            "detailsModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    selectedOpportunity =
        null;

}


/* =========================================================
   SAVE OPPORTUNITY
========================================================= */

function saveOpportunity(
    opportunityId,
    button
) {

    const index =
        savedOpportunities.indexOf(
            opportunityId
        );


    if (index === -1) {

        savedOpportunities.push(
            opportunityId
        );


        button.classList.add(
            "saved"
        );


        button.textContent =
            "♥";

    } else {

        savedOpportunities.splice(
            index,
            1
        );


        button.classList.remove(
            "saved"
        );


        button.textContent =
            "♡";

    }


    localStorage.setItem(
        "sakshamSavedOpportunities",
        JSON.stringify(
            savedOpportunities
        )
    );

}


/* =========================================================
   APPLY NOW
========================================================= */

async function applyNow() {

    if (!selectedOpportunity) {

        alert(
            "Please select an opportunity first."
        );

        return;

    }


    const opportunityId =
        selectedOpportunity.id;


    const applicationData = {

        opportunity_id:
            opportunityId,

        status:
            "Applied"

    };


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("applications")
                .insert(
                    [applicationData]
                )
                .select();


        if (error) {

            console.error(
                "Application error:",
                error
            );


            alert(
                "The opportunity was selected, but the application could not be saved yet. We will connect your user profile next."
            );

            return;

        }


        console.log(
            "Application saved:",
            data
        );


        alert(
            "🎉 Application submitted successfully!"
        );


        closeDetails();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Something went wrong while submitting your application."
        );

    }

}


/* =========================================================
   DATABASE ERROR
========================================================= */

function showDatabaseError() {

    const grid =
        document.getElementById(
            "opportunityGrid"
        );


    if (!grid) return;


    grid.innerHTML = `

        <div style="
            grid-column:1/-1;
            text-align:center;
            padding:60px 20px;
        ">

            <div style="
                font-size:45px;
                margin-bottom:15px;
            ">
                ⚠️
            </div>


            <h3>
                Couldn't Load Opportunities
            </h3>


            <p style="
                color:#68736c;
                max-width:500px;
                margin:10px auto;
            ">

                SAKSHAM couldn't connect to the
                opportunity database.

                Please check your internet connection
                and try again.

            </p>


            <button
                class="view-btn"
                style="
                    max-width:200px;
                    margin-top:15px;
                "
                onclick="loadOpportunities()">

                Try Again

            </button>

        </div>

    `;

}


/* =========================================================
   HTML SECURITY HELPER
========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   ATTRIBUTE SECURITY HELPER
========================================================= */

function escapeAttribute(
    value
) {

    return String(value)
        .replace(
            /'/g,
            "\\'"
        );

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "detailsModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeDetails();

        }

    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "SAKSHAM Opportunities page loaded."
        );


        /* LOAD REAL USER PROFILE */

        currentUserProfile =
            loadUserProfile();


        console.log(
            "Current user profile:",
            currentUserProfile
        );


        /*
           Make sure Supabase has loaded.
        */

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "Supabase client is not available."
            );


            showDatabaseError();

            return;

        }


        /*
           Load opportunities after
           the user profile has been loaded.
        */

        loadOpportunities();

    }
);