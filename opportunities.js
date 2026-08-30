/* =========================================================
   SAKSHAM - OPPORTUNITIES
   Supabase-connected JavaScript
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let allOpportunities = [];

let selectedOpportunity = null;

let savedOpportunities =
    JSON.parse(localStorage.getItem("sakshamSavedOpportunities")) || [];


/* =========================================================
   LOAD OPPORTUNITIES FROM SUPABASE
========================================================= */

async function loadOpportunities() {

    const grid = document.getElementById("opportunityGrid");

    if (!grid) {
        console.error("Opportunity grid not found.");
        return;
    }

    /* Loading message */

    grid.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
        ">
            <div style="font-size:45px;">⏳</div>

            <h3>Finding Opportunities...</h3>

            <p style="color:#68736c;">
                SAKSHAM is loading opportunities for you.
            </p>
        </div>
    `;


    try {

        const { data, error } =
            await supabaseClient
                .from("opportunities")
                .select("*")
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Supabase error:",
                error
            );

            showDatabaseError();

            return;
        }


        allOpportunities = data || [];


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
                    Try changing your search or filters.
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


    /*
       Demo match score.

       Later we can replace this with
       the actual SAKSHAM matching algorithm.
    */

    const matchScore =
        calculateMatchScore(
            skills
        );


    card.dataset.category =
        category.toLowerCase();


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
                    skill => `
                        <span class="matched">
                            ✓ ${escapeHTML(skill)}
                        </span>
                    `
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
            ${experience} year${experience == 1 ? "" : "s"}
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
                    isSaved ? "saved" : ""
                }"
                onclick="saveOpportunity(
                    '${escapeAttribute(
                        opportunity.id
                    )}',
                    this
                )">

                ${isSaved ? "♥" : "♡"}

            </button>

        </div>

    `;


    return card;

}


/* =========================================================
   MATCH SCORE
========================================================= */

function calculateMatchScore(
    requiredSkills
) {

    /*
       Temporary prototype matching.

       Once the user profile is connected,
       we will compare:

       User Skills
              ↓
       Required Skills
              ↓
       Match percentage
    */


    if (
        !requiredSkills ||
        requiredSkills.length === 0
    ) {

        return 70;

    }


    /*
       Demo score based on number
       of required skills.

       This keeps the UI working
       until the real profile matching
       system is connected.
    */

    const scores = [
        94,
        89,
        84,
        81,
        78,
        72
    ];


    const index =
        requiredSkills.length % scores.length;


    return scores[index];

}


/* =========================================================
   SEARCH
========================================================= */

function searchOpportunities() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) return;


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        allOpportunities.filter(
            opportunity => {

                const title =
                    (
                        opportunity.title ||
                        ""
                    ).toLowerCase();


                const organization =
                    (
                        opportunity.organization ||
                        ""
                    ).toLowerCase();


                const category =
                    (
                        opportunity.category ||
                        ""
                    ).toLowerCase();


                const description =
                    (
                        opportunity.description ||
                        ""
                    ).toLowerCase();


                return (

                    title.includes(search) ||

                    organization.includes(search) ||

                    category.includes(search) ||

                    description.includes(search)

                );

            }
        );


    applyCurrentFilters(
        filtered
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
                    (
                        opportunity.title ||
                        ""
                    ).toLowerCase();


                const organization =
                    (
                        opportunity.organization ||
                        ""
                    ).toLowerCase();


                const description =
                    (
                        opportunity.description ||
                        ""
                    ).toLowerCase();


                const opportunityCategory =
                    (
                        opportunity.category ||
                        ""
                    ).toLowerCase();


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
                        skills
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
        `${count} opportunit${count === 1 ? "y" : "ies"} found`;

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
            skills
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


    if (skills.length === 0) {

        skillsContainer.innerHTML = `
            <div class="breakdown-item">
                <strong>✓ Suitable</strong>
                General entrepreneur skills
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


                div.innerHTML = `
                    <strong>✓ Required Skill</strong>
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
        `📌 Minimum experience: ${experience} year${experience == 1 ? "" : "s"}`;


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


    /*
       IMPORTANT:

       We currently don't have Supabase
       authentication connected.

       Therefore we create a temporary
       demo application record.

       Later we'll connect this to the
       logged-in user's profile.
    */


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


            /*
               If the applications table
               requires a profile/user ID,
               we'll connect authentication
               in the next stage.
            */

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

    if (value === null ||
        value === undefined) {

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


        /*
           Make sure Supabase has loaded
           before trying to access it.
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


        loadOpportunities();

    }
);