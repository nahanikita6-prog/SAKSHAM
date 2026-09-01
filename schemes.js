/* =========================================================
   SAKSHAM - GOVERNMENT SCHEME ANALYZER
========================================================= */


/* =========================================================
   GOVERNMENT SCHEMES
========================================================= */

let allSchemes = [

    {
        name: "PMEGP",
        fullName: "Prime Minister's Employment Generation Programme",
        category: "finance",

        skills: [
            "business",
            "manufacturing",
            "handicraft",
            "textile"
        ],

        description:
            "A government scheme that supports new micro-enterprises through financial assistance.",

        benefit:
            "Credit-linked subsidy for setting up eligible micro enterprises.",

        eligibility:
            "Suitable for individuals and eligible organizations starting new enterprises."
    },


    {
        name: "PM Vishwakarma",
        fullName: "PM Vishwakarma Scheme",
        category: "traditional",

        skills: [
            "handicraft",
            "tailoring",
            "carpentry",
            "pottery",
            "embroidery"
        ],

        description:
            "A scheme designed to support traditional artisans and craftspeople.",

        benefit:
            "Skill training, toolkit support, incentives and access to credit support.",

        eligibility:
            "Traditional artisans and craftspeople working in eligible trades."
    },


    {
        name: "MUDRA",
        fullName: "Pradhan Mantri MUDRA Yojana",
        category: "finance",

        skills: [
            "business",
            "sales",
            "retail",
            "ecommerce",
            "manufacturing"
        ],

        description:
            "Provides institutional credit support to micro and small business activities.",

        benefit:
            "Access to eligible business loans through participating financial institutions.",

        eligibility:
            "Eligible micro and small entrepreneurs engaged in income-generating activities."
    },


    {
        name: "Stand-Up India",
        fullName: "Stand-Up India Scheme",
        category: "finance",

        skills: [
            "business",
            "manufacturing",
            "services",
            "retail"
        ],

        description:
            "Supports eligible entrepreneurs in establishing greenfield enterprises.",

        benefit:
            "Facilitates bank loans for eligible new enterprises.",

        eligibility:
            "Eligibility depends on the scheme's current criteria and applicant category."
    },


    {
        name: "PMFME",
        fullName:
            "Prime Minister Formalisation of Micro Food Processing Enterprises",

        category: "finance",

        skills: [
            "food",
            "food processing",
            "manufacturing",
            "business",
            "sales"
        ],

        description:
            "Supports micro food-processing enterprises with formalisation and business development.",

        benefit:
            "Eligible entrepreneurs may receive financial and capacity-building support.",

        eligibility:
            "Micro food-processing enterprises meeting the scheme's eligibility conditions."
    }

];



/* =========================================================
   LOAD PROFILE
========================================================= */

function loadSchemeAnalyzer() {

    console.log("SAKSHAM Scheme Analyzer loaded 🚀");


    const savedProfile =
        localStorage.getItem("sakshamProfile");


    if (!savedProfile) {

        showNoProfile();

        updateSidebar(
            "Entrepreneur",
            "Entrepreneur"
        );

        return;
    }


    let profile;


    try {

        profile = JSON.parse(savedProfile);

    }

    catch (error) {

        console.error(
            "Unable to read SAKSHAM profile:",
            error
        );

        showNoProfile();

        return;
    }


    console.log(
        "Entrepreneur profile:",
        profile
    );


    /* Update sidebar */

    updateSidebar(
        profile.name,
        profile.businessType
    );


    /* Analyze schemes */

    analyzeSchemes(profile);

}



/* =========================================================
   UPDATE SIDEBAR
========================================================= */

function updateSidebar(name, businessType) {

    const sidebarAvatar =
        document.getElementById("sidebarAvatar");


    const sidebarUserName =
        document.getElementById("sidebarUserName");


    const sidebarBusinessType =
        document.getElementById("sidebarBusinessType");


    if (name && name.trim() !== "") {

        if (sidebarUserName) {

            sidebarUserName.textContent =
                name;

        }


        if (sidebarAvatar) {

            sidebarAvatar.textContent =
                name
                    .trim()
                    .charAt(0)
                    .toUpperCase();

        }

    }


    else {

        if (sidebarUserName) {

            sidebarUserName.textContent =
                "Entrepreneur";

        }


        if (sidebarAvatar) {

            sidebarAvatar.textContent =
                "A";

        }

    }


    if (
        businessType &&
        businessType.trim() !== ""
    ) {

        if (sidebarBusinessType) {

            sidebarBusinessType.textContent =
                businessType +
                " Entrepreneur";

        }

    }


    else {

        if (sidebarBusinessType) {

            sidebarBusinessType.textContent =
                "Entrepreneur";

        }

    }

}



/* =========================================================
   ANALYZE SCHEMES
========================================================= */

function analyzeSchemes(profile) {


    const business =
        String(
            profile.business ||
            profile.businessType ||
            profile.category ||
            ""
        )
        .trim()
        .toLowerCase();


    const skills =
        normalizeSkills(
            profile.skills ||
            profile.preferredSkills ||
            profile.preferred_skills ||
            []
        );


    console.log(
        "Business:",
        business
    );


    console.log(
        "Skills:",
        skills
    );


    const results =
        allSchemes.map(
            scheme => {

                let score = 0;


                /* =========================
                   BUSINESS MATCH
                ========================= */

                const schemeCategory =
                    String(
                        scheme.category
                    )
                    .toLowerCase();


                if (
                    business &&
                    (
                        schemeCategory.includes(
                            business
                        ) ||
                        business.includes(
                            schemeCategory
                        )
                    )
                ) {

                    score += 40;

                }


                /* =========================
                   SKILL MATCH
                ========================= */

                let matchedSkills = [];


                scheme.skills.forEach(
                    schemeSkill => {

                        skills.forEach(
                            userSkill => {

                                const normalizedSchemeSkill =
                                    String(
                                        schemeSkill
                                    )
                                    .trim()
                                    .toLowerCase();


                                const normalizedUserSkill =
                                    String(
                                        userSkill
                                    )
                                    .trim()
                                    .toLowerCase();


                                if (
                                    normalizedSchemeSkill.includes(
                                        normalizedUserSkill
                                    ) ||
                                    normalizedUserSkill.includes(
                                        normalizedSchemeSkill
                                    )
                                ) {

                                    if (
                                        !matchedSkills.includes(
                                            normalizedSchemeSkill
                                        )
                                    ) {

                                        matchedSkills.push(
                                            normalizedSchemeSkill
                                        );

                                    }

                                }

                            }
                        );

                    }
                );


                /*
                   Each matched skill adds 15 points.
                   Maximum score is 100.
                */

                score +=
                    matchedSkills.length * 15;


                if (score > 100) {

                    score = 100;

                }


                return {

                    ...scheme,

                    matchScore: score,

                    matchedSkills:
                        matchedSkills

                };

            }
        );


    results.sort(
        (a, b) =>
            b.matchScore -
            a.matchScore
    );


    displaySchemes(results);

}



/* =========================================================
   NORMALIZE SKILLS
========================================================= */

function normalizeSkills(skills) {


    if (Array.isArray(skills)) {

        return skills.map(
            skill =>
                String(skill)
                    .trim()
                    .toLowerCase()
        );

    }


    if (typeof skills === "string") {

        return skills
            .split(",")
            .map(
                skill =>
                    skill
                        .trim()
                        .toLowerCase()
            );

    }


    return [];

}



/* =========================================================
   DISPLAY SCHEMES
========================================================= */

function displaySchemes(schemes) {


    const container =
        document.getElementById(
            "schemeGrid"
        );


    if (!container) {

        console.error(
            "schemeGrid container not found."
        );

        return;

    }


    container.innerHTML = "";


    if (schemes.length === 0) {

        showNoSchemes(
            "No Matching Schemes",
            "No government schemes match your current filters."
        );

        return;

    }


    schemes.forEach(
        scheme => {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "scheme-card";


            let matchText =
                "General Recommendation";


            if (
                scheme.matchScore >= 70
            ) {

                matchText =
                    "Highly Relevant";

            }

            else if (
                scheme.matchScore >= 40
            ) {

                matchText =
                    "Relevant";

            }


            card.setAttribute(
                "data-category",
                scheme.category
            );


            card.setAttribute(
                "data-match",
                scheme.matchScore
            );


            card.innerHTML = `

                <div class="scheme-header">

                    <div>

                        <span class="scheme-category">

                            GOVERNMENT SCHEME

                        </span>

                    </div>

                    <div class="scheme-match">

                        ${scheme.matchScore}%

                    </div>

                </div>


                <h3>

                    ${escapeSchemeHTML(
                        scheme.name
                    )}

                </h3>


                <div class="scheme-ministry">

                    ${escapeSchemeHTML(
                        scheme.fullName
                    )}

                </div>


                <p>

                    ${escapeSchemeHTML(
                        scheme.description
                    )}

                </p>


                <div class="scheme-section-title">

                    💰 Potential Benefit

                </div>


                <div class="scheme-tags">

                    <span>

                        ${escapeSchemeHTML(
                            scheme.benefit
                        )}

                    </span>

                </div>


                <div class="scheme-section-title">

                    👤 Eligibility

                </div>


                <div class="scheme-tags">

                    <span>

                        ${escapeSchemeHTML(
                            scheme.eligibility
                        )}

                    </span>

                </div>


                <div
                    class="scheme-relevance"
                    style="
                        margin-bottom:15px;
                        font-size:11px;
                        font-weight:700;
                        color:#16734a;
                    "
                >

                    ✓ ${matchText}

                </div>


                <div class="scheme-actions">

                    <button
                        class="scheme-details-btn"
                        onclick="showSchemeDetails('${escapeSchemeAttribute(
                            scheme.name
                        )}')"
                    >

                        View Scheme Details →

                    </button>


                    <button
                        class="official-btn"
                        onclick="openOfficialScheme('${escapeSchemeAttribute(
                            scheme.name
                        )}')"
                    >

                        Official Info

                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    updateSchemeCount(
        schemes.length
    );

}



/* =========================================================
   SEARCH + FILTER
========================================================= */

function filterSchemes() {


    const searchInput =
        document.getElementById(
            "schemeSearch"
        );


    const categorySelect =
        document.getElementById(
            "schemeCategory"
        );


    const matchSelect =
        document.getElementById(
            "schemeMatch"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        categorySelect
            ? categorySelect.value
            : "all";


    const minimumMatch =
        matchSelect
            ? parseInt(
                matchSelect.value
            ) || 0
            : 0;


    const cards =
        document.querySelectorAll(
            ".scheme-card"
        );


    let visibleCount = 0;


    cards.forEach(
        card => {


            const cardText =
                card.textContent
                    .toLowerCase();


            const cardCategory =
                card.dataset.category ||
                "";


            const cardMatch =
                parseInt(
                    card.dataset.match
                ) || 0;


            const searchMatches =
                search === "" ||
                cardText.includes(
                    search
                );


            const categoryMatches =
                category === "all" ||
                cardCategory === category;


            const matchMatches =
                cardMatch >= minimumMatch;


            if (
                searchMatches &&
                categoryMatches &&
                matchMatches
            ) {

                card.style.display =
                    "";

                visibleCount++;

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );


    updateSchemeCount(
        visibleCount
    );


    const container =
        document.getElementById(
            "schemeGrid"
        );


    let noResults =
        document.getElementById(
            "noFilterResults"
        );


    if (
        visibleCount === 0 &&
        container
    ) {


        if (!noResults) {

            noResults =
                document.createElement(
                    "div"
                );

            noResults.id =
                "noFilterResults";

            noResults.className =
                "scheme-message";

            noResults.innerHTML = `

                <div class="scheme-message-icon">

                    🔍

                </div>

                <h3>

                    No Schemes Found

                </h3>

                <p>

                    Try changing your search or filter options.

                </p>

            `;

            container.appendChild(
                noResults
            );

        }


        noResults.style.display =
            "block";

    }

    else if (noResults) {

        noResults.style.display =
            "none";

    }

}



/* =========================================================
   UPDATE SCHEME COUNT
========================================================= */

function updateSchemeCount(count) {


    const countElement =
        document.getElementById(
            "schemeCount"
        );


    if (!countElement) return;


    if (count === 1) {

        countElement.textContent =
            "1 scheme found";

    }

    else {

        countElement.textContent =
            count +
            " schemes found";

    }

}



/* =========================================================
   SHOW SCHEME DETAILS
========================================================= */

function showSchemeDetails(name) {


    const scheme =
        allSchemes.find(
            item =>
                item.name === name
        );


    if (!scheme) return;


    const title =
        document.getElementById(
            "schemeDetailTitle"
        );


    const ministry =
        document.getElementById(
            "schemeDetailMinistry"
        );


    const scoreElement =
        document.getElementById(
            "schemeDetailScore"
        );


    const reasons =
        document.getElementById(
            "schemeReasons"
        );


    const eligibility =
        document.getElementById(
            "schemeEligibility"
        );


    const modal =
        document.getElementById(
            "schemeModal"
        );


    if (!modal) {

        alert(
            scheme.name +
            "\n\n" +
            scheme.fullName +
            "\n\n" +
            scheme.description
        );

        return;

    }


    const savedProfile =
        localStorage.getItem(
            "sakshamProfile"
        );


    let profile = {};


    if (savedProfile) {

        try {

            profile =
                JSON.parse(
                    savedProfile
                );

        }

        catch (error) {

            console.error(
                "Could not read profile.",
                error
            );

        }

    }


    const results =
        calculateSchemeMatches(
            profile
        );


    const currentResult =
        results.find(
            item =>
                item.name === name
        );


    const score =
        currentResult
            ? currentResult.matchScore
            : 0;


    if (title) {

        title.textContent =
            scheme.name;

    }


    if (ministry) {

        ministry.textContent =
            scheme.fullName;

    }


    if (scoreElement) {

        scoreElement.textContent =
            score + "%";

    }


    if (reasons) {

        reasons.innerHTML = "";


        if (
            currentResult &&
            currentResult.matchedSkills.length > 0
        ) {

            currentResult.matchedSkills
                .forEach(
                    skill => {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "detail-item";

                        item.innerHTML = `

                            <strong>

                                Matching Skill

                            </strong>

                            Your profile includes:

                            ${escapeSchemeHTML(
                                skill
                            )}

                        `;

                        reasons.appendChild(
                            item
                        );

                    }
                );

        }


        const business =
            profile.businessType ||
            profile.business ||
            "";


        if (business) {

            const businessItem =
                document.createElement(
                    "div"
                );

            businessItem.className =
                "detail-item";

            businessItem.innerHTML = `

                <strong>

                    Business Type

                </strong>

                Your business type is:

                ${escapeSchemeHTML(
                    business
                )}

            `;

            reasons.appendChild(
                businessItem
            );

        }


        if (
            reasons.children.length === 0
        ) {

            reasons.innerHTML = `

                <div class="detail-item">

                    <strong>

                        General Recommendation

                    </strong>

                    This scheme may be relevant based on the available information in your profile.

                </div>

            `;

        }

    }


    if (eligibility) {

        eligibility.innerHTML = `

            <div class="detail-item">

                <strong>

                    Eligibility

                </strong>

                ${escapeSchemeHTML(
                    scheme.eligibility
                )}

            </div>


            <div class="detail-item">

                <strong>

                    Potential Benefit

                </strong>

                ${escapeSchemeHTML(
                    scheme.benefit
                )}

            </div>

        `;

    }


    modal.style.display =
        "flex";

}



/* =========================================================
   CLOSE SCHEME DETAILS
========================================================= */

function closeSchemeDetails() {


    const modal =
        document.getElementById(
            "schemeModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}



/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event) {


        const modal =
            document.getElementById(
                "schemeModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeSchemeDetails();

        }

    }
);



/* =========================================================
   OFFICIAL GOVERNMENT INFORMATION
========================================================= */

function openOfficialScheme(name) {


    const officialLinks = {

        "PMEGP":
            "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",

        "PM Vishwakarma":
            "https://pmvishwakarma.gov.in/",

        "MUDRA":
            "https://www.mudra.org.in/",

        "Stand-Up India":
            "https://www.standupmitra.in/",

        "PMFME":
            "https://pmfme.mofpi.gov.in/"

    };


    const url =
        officialLinks[name];


    if (url) {

        window.open(
            url,
            "_blank"
        );

    }

    else {

        alert(
            "Official information link is not available yet."
        );

    }

}



/* =========================================================
   CALCULATE MATCHES
========================================================= */

function calculateSchemeMatches(profile) {


    const business =
        String(
            profile.business ||
            profile.businessType ||
            profile.category ||
            ""
        )
        .trim()
        .toLowerCase();


    const skills =
        normalizeSkills(
            profile.skills ||
            profile.preferredSkills ||
            profile.preferred_skills ||
            []
        );


    return allSchemes.map(
        scheme => {


            let score = 0;


            const schemeCategory =
                String(
                    scheme.category
                )
                .toLowerCase();


            if (
                business &&
                (
                    schemeCategory.includes(
                        business
                    ) ||
                    business.includes(
                        schemeCategory
                    )
                )
            ) {

                score += 40;

            }


            const matchedSkills = [];


            scheme.skills.forEach(
                schemeSkill => {

                    skills.forEach(
                        userSkill => {

                            const s =
                                String(
                                    schemeSkill
                                )
                                .trim()
                                .toLowerCase();


                            const u =
                                String(
                                    userSkill
                                )
                                .trim()
                                .toLowerCase();


                            if (
                                s.includes(u) ||
                                u.includes(s)
                            ) {

                                if (
                                    !matchedSkills.includes(
                                        s
                                    )
                                ) {

                                    matchedSkills.push(
                                        s
                                    );

                                }

                            }

                        }
                    );

                }
            );


            score +=
                matchedSkills.length *
                15;


            score =
                Math.min(
                    score,
                    100
                );


            return {

                ...scheme,

                matchScore:
                    score,

                matchedSkills:
                    matchedSkills

            };

        }
    );

}



/* =========================================================
   NO PROFILE
========================================================= */

function showNoProfile() {


    const container =
        document.getElementById(
            "schemeGrid"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="scheme-message">

            <div class="scheme-message-icon">

                👤

            </div>


            <h3>

                Complete Your Profile First

            </h3>


            <p>

                SAKSHAM needs your business
                and skills information to
                find relevant government schemes.

            </p>


            <button
                class="scheme-details-btn"
                style="
                    margin-top:20px;
                    max-width:220px;
                "
                onclick="window.location.href='profile.html'"
            >

                Complete Profile →

            </button>

        </div>

    `;


    updateSchemeCount(0);

}



/* =========================================================
   NO SCHEMES
========================================================= */

function showNoSchemes(
    title,
    message
) {


    const container =
        document.getElementById(
            "schemeGrid"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="scheme-message">

            <div class="scheme-message-icon">

                🔍

            </div>


            <h3>

                ${escapeSchemeHTML(
                    title
                )}

            </h3>


            <p>

                ${escapeSchemeHTML(
                    message
                )}

            </p>

        </div>

    `;


    updateSchemeCount(0);

}



/* =========================================================
   SECURITY HELPERS
========================================================= */

function escapeSchemeHTML(value) {


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
   ATTRIBUTE ESCAPE
========================================================= */

function escapeSchemeAttribute(value) {


    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );

}



/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadSchemeAnalyzer();

    }
);