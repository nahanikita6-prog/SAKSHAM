/* =========================================================
   SAKSHAM - MAIN SCRIPT
   ========================================================= */


/* =========================
   GLOBAL VARIABLES
========================= */

let currentOpportunity = null;


/* =========================
   SMOOTH SCROLL
========================= */

function scrollToSection(id) {

    const section =
        document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================
   START JOURNEY
========================= */

function startJourney() {

    const modal =
        document.getElementById("modal");

    const content =
        document.getElementById("modal-content");


    content.innerHTML = `

        <h2>Create Your SAKSHAM Profile</h2>

        <p>
            Tell us about yourself so we can find
            opportunities that match your skills.
        </p>


        <div class="form-group">

            <label>Full Name</label>

            <input
                type="text"
                id="userName"
                placeholder="Enter your name"
            >

        </div>


        <div class="form-group">

            <label>Business Type</label>

            <select id="businessType">

                <option value="Handicraft">
                    Handicraft
                </option>

                <option value="Textile">
                    Textile
                </option>

                <option value="Agriculture">
                    Agriculture
                </option>

                <option value="Food">
                    Food
                </option>

                <option value="Retail">
                    Retail
                </option>

                <option value="Services">
                    Services
                </option>

                <option value="Other">
                    Other
                </option>

            </select>

        </div>


        <div class="form-group">

            <label>Your Skills</label>

            <div class="skill-options">

                <button
                    type="button"
                    class="skill-option"
                    onclick="selectSkill(this)">

                    Tailoring

                </button>


                <button
                    type="button"
                    class="skill-option"
                    onclick="selectSkill(this)">

                    Embroidery

                </button>


                <button
                    type="button"
                    class="skill-option"
                    onclick="selectSkill(this)">

                    Handicraft

                </button>


                <button
                    type="button"
                    class="skill-option"
                    onclick="selectSkill(this)">

                    Agriculture

                </button>


                <button
                    type="button"
                    class="skill-option"
                    onclick="selectSkill(this)">

                    Sales

                </button>


                <button
                    type="button"
                    class="skill-option"
                    onclick="selectSkill(this)">

                    Digital Marketing

                </button>

            </div>

        </div>


        <div class="form-group">

            <label>Years of Experience</label>

            <input
                type="number"
                id="experience"
                placeholder="e.g. 5"
                min="0"
            >

        </div>


        <button
            class="primary-btn"
            onclick="createProfile()">

            Analyze My Profile →

        </button>

    `;


    modal.style.display = "flex";

}


/* =========================
   SKILL SELECTION
========================= */

function selectSkill(button) {

    button.classList.toggle("selected");

}


/* =========================
   CREATE PROFILE
========================= */

function createProfile() {

    const name =
        document
        .getElementById("userName")
        .value
        .trim();


    const businessType =
        document
        .getElementById("businessType")
        .value;


    const experience =
        document
        .getElementById("experience")
        .value;


    const selectedSkills =
        Array.from(
            document.querySelectorAll(
                ".skill-option.selected"
            )
        ).map(
            skill =>
                skill.textContent.trim()
        );


    /* =========================
       VALIDATION
    ========================= */

    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (experience === "") {

        alert(
            "Please enter your years of experience."
        );

        return;

    }


    if (selectedSkills.length === 0) {

        alert(
            "Please select at least one skill."
        );

        return;

    }


    /* =========================
       SAVE PROFILE
    ========================= */

    const profile = {

        name: name,

        businessType:
            businessType,

        experience:
            experience,

        skills:
            selectedSkills,

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "sakshamProfile",
        JSON.stringify(profile)
    );


    /* =========================
       ANALYSIS SCREEN
    ========================= */

    const content =
        document.getElementById(
            "modal-content"
        );


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:50px">
                🧠
            </div>


            <h2>
                Analyzing Your Skills...
            </h2>


            <p>
                SAKSHAM is finding the best
                opportunities for you.
            </p>


            <div style="
                margin:25px 0;
                background:#edf1ed;
                border-radius:20px;
                overflow:hidden;
            ">

                <div style="
                    width:90%;
                    height:10px;
                    background:#16734a;
                ">
                </div>

            </div>


            <p>

                ✓ Skills identified<br>

                ✓ Experience analyzed<br>

                ✓ Opportunities found

            </p>

        </div>

    `;


    setTimeout(() => {

        showResults(name);

    }, 1500);

}


/* =========================
   RESULTS
========================= */

function showResults(name) {

    const content =
        document.getElementById(
            "modal-content"
        );


    const profile =
        JSON.parse(
            localStorage.getItem(
                "sakshamProfile"
            )
        );


   let skillsHTML = "";

let businessType =
    profile?.businessType ||
    "Business";

let skills =
    profile?.skills || [];


if (skills.length) {

    skillsHTML =
        skills
        .map(
            skill =>
                `<span>${skill}</span>`
        )
        .join("");

}
let topMatch =
    "Business Growth Opportunity";

let matchScore = 70;


/* SIMPLE PROFILE-BASED MATCHING */

if (businessType === "Textile") {

    topMatch =
        "Textile Supplier Partnership";

    matchScore =
        skills.includes("Tailoring") ||
        skills.includes("Embroidery")
            ? 94
            : 80;

}

else if (businessType === "Handicraft") {

    topMatch =
        "Handicraft Marketplace";

    matchScore =
        skills.includes("Handicraft") ||
        skills.includes("Sales")
            ? 92
            : 78;

}

else if (businessType === "Agriculture") {

    topMatch =
        "Rural Market Access Initiative";

    matchScore =
        skills.includes("Agriculture") ||
        skills.includes("Sales")
            ? 89
            : 76;

}

else if (businessType === "Services") {

    topMatch =
        "Digital Skills Training Program";

    matchScore =
        skills.includes("Digital Marketing")
            ? 90
            : 80;

}

else if (businessType === "Retail") {

    topMatch =
        "Women Entrepreneur Growth Fund";

    matchScore =
        skills.includes("Sales")
            ? 88
            : 76;

}


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:50px">
                🎯
            </div>


            <h2>
                Profile Analysis Complete!
            </h2>


            <p>
                Welcome, ${name}.
            </p>

        </div>


        <div style="
            background:#edf5ef;
            padding:20px;
            border-radius:12px;
            margin:20px 0;
        ">

            <h3>
                Your Top Match
            </h3>


           <h2 style="color:#16734a">
    ${matchScore}% Match
</h2>


<p>
    ${topMatch}
</p>

        </div>


        <h3>
            Skills Identified
        </h3>


        <div class="skills">

            ${skillsHTML}

        </div>


        <button
    class="primary-btn"
    onclick="
        closeModal();
        window.location.href='pages/dashboard.html';
    ">
    Go To My Dashboard →
</button>

    `;

}


/* =========================================================
   OPPORTUNITY DETAILS
========================================================= */


/* =========================
   OPPORTUNITY DATA
========================= */

const opportunityData = {

    "Textile Supplier Partnership": {

        organization:
            "CraftConnect",

        score:
            94,

        matched:
            "Tailoring, Embroidery, Textile",

        missing:
            "Digital Marketing"

    },


    "Women Entrepreneur Growth Fund": {

        organization:
            "National Entrepreneurship Development Program",

        score:
            91,

        matched:
            "Handicraft, Sales",

        missing:
            "Financial Management"

    },


    "Rural Market Access Initiative": {

        organization:
            "Small Business Development Network",

        score:
            89,

        matched:
            "Handicraft, Sales",

        missing:
            "E-Commerce"

    },


    "Digital Skills Training Program": {

        organization:
            "Digital Entrepreneurship Initiative",

        score:
            86,

        matched:
            "Sales, Business",

        missing:
            "Digital Marketing"

    },


    "Handicraft Marketplace": {

        organization:
            "CraftConnect",

        score:
            92,

        matched:
            "Handicraft, Sales",

        missing:
            "Product Photography"

    }

};


/* =========================
   VIEW OPPORTUNITY
========================= */

function viewOpportunity(name) {

    const modal =
        document.getElementById(
            "modal"
        );


    const content =
        document.getElementById(
            "modal-content"
        );


    /*
       Get information about
       the selected opportunity.
    */

    const data =
        opportunityData[name] || {

            organization:
                "SAKSHAM Partner",

            score:
                90,

            matched:
                "Your existing skills",

            missing:
                "Digital Skills"

        };


    /*
       Store currently selected
       opportunity globally.
    */

    currentOpportunity = {

        title:
            name,

        organization:
            data.organization,

        score:
            data.score,

        matched:
            data.matched,

        missing:
            data.missing

    };


    content.innerHTML = `

        <span class="category">
            Opportunity
        </span>


        <h2 style="margin-top:15px">
            ${name}
        </h2>


        <p>
            🏢 ${data.organization}
        </p>


        <h2 style="color:#16734a">
            ${data.score}% Match 🎯
        </h2>


        <p>
            This opportunity matches your
            skills and experience.
        </p>


        <h3>
            Why You Matched
        </h3>


        <p>
            ✓ ${data.matched.replace(/,/g, "<br>✓ ")}
        </p>


        <h3>
            Skill Gap
        </h3>


        <p>
            ⚠ ${data.missing}
        </p>


        <button
            class="primary-btn"
            onclick="applyOpportunity()">

            Apply Now →

        </button>

    `;


    modal.style.display =
        "flex";

}


/* =========================================================
   APPLY FOR OPPORTUNITY
========================================================= */

function applyOpportunity() {

    /*
       Make sure an opportunity
       has been selected.
    */

    if (!currentOpportunity) {

        alert(
            "Please select an opportunity first."
        );

        return;

    }


    /*
       Get existing applications.
    */

    let applications =
        JSON.parse(
            localStorage.getItem(
                "sakshamApplications"
            )
        ) || [];


    /*
       Check whether the user
       has already applied.
    */

    const alreadyApplied =
        applications.some(
            application =>
                application.title ===
                currentOpportunity.title
        );


    if (alreadyApplied) {

        showAlreadyApplied();

        return;

    }


    /*
       Get today's date.
    */

    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "en-IN",
            {
                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        );


    /*
       Create new application.
    */

    const newApplication = {

        id:
            Date.now(),

        title:
            currentOpportunity.title,

        organization:
            currentOpportunity.organization,

        score:
            currentOpportunity.score,

        matched:
            currentOpportunity.matched,

        missing:
            currentOpportunity.missing,

        status:
            "submitted",

        date:
            formattedDate

    };


    /*
       Add application
       to existing applications.
    */

    applications.push(
        newApplication
    );


    /*
       Save applications.
    */

    localStorage.setItem(

        "sakshamApplications",

        JSON.stringify(
            applications
        )

    );


    /*
       Show success screen.
    */

    const content =
        document.getElementById(
            "modal-content"
        );


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:60px">
                🎉
            </div>


            <h2>
                Application Submitted!
            </h2>


            <p>
                Your application for
                <strong>
                    ${currentOpportunity.title}
                </strong>
                has been successfully submitted.
            </p>


            <div style="
                background:#edf5ef;
                padding:15px;
                border-radius:10px;
                margin:20px 0;
            ">

                <strong>
                    Status: Submitted
                </strong>

                <br>

                <small>
                    Your application has been
                    added to My Applications.
                </small>

            </div>


            <button
                class="primary-btn"
                onclick="goToApplications()">

                View My Applications →

            </button>


            <button
                style="
                    margin-top:10px;
                    background:white;
                    border:1px solid #d8dfda;
                    padding:10px 20px;
                    border-radius:7px;
                    cursor:pointer;
                "
                onclick="closeModal()">

                Done

            </button>

        </div>

    `;

}


/* =========================
   ALREADY APPLIED
========================= */

function showAlreadyApplied() {

    const content =
        document.getElementById(
            "modal-content"
        );


    content.innerHTML = `

        <div style="text-align:center">

            <div style="font-size:55px">
                📋
            </div>


            <h2>
                Already Applied
            </h2>


            <p>
                You have already submitted
                an application for
                <strong>
                    ${currentOpportunity.title}
                </strong>.
            </p>


            <button
                class="primary-btn"
                onclick="goToApplications()">

                View My Applications →

            </button>


            <button
                style="
                    margin-top:10px;
                    background:white;
                    border:1px solid #d8dfda;
                    padding:10px 20px;
                    border-radius:7px;
                    cursor:pointer;
                "
                onclick="closeModal()">

                Close

            </button>

        </div>

    `;

}


/* =========================
   GO TO APPLICATIONS
========================= */

function goToApplications() {

    /*
       If applications.html exists
       inside the pages folder,
       open it.
    */

    window.location.href =
        "pages/applications.html";

}


/* =========================================================
   LOGIN
========================================================= */


/* =========================
   OPEN LOGIN
========================= */

function openLogin() {

    const modal =
        document.getElementById(
            "modal"
        );


    const content =
        document.getElementById(
            "modal-content"
        );


    content.innerHTML = `

        <h2>
            Welcome Back
        </h2>


        <p>
            Login to your SAKSHAM dashboard.
        </p>


        <div class="form-group">

            <label>
                Email
            </label>


            <input
                type="email"
                id="loginEmail"
                placeholder="Enter your email"
            >

        </div>


        <div class="form-group">

            <label>
                Password
            </label>


            <input
                type="password"
                id="loginPassword"
                placeholder="Enter your password"
            >

        </div>


        <button
            class="primary-btn"
            onclick="loginDemo()">

            Login →

        </button>

    `;


    modal.style.display =
        "flex";

}


/* =========================
   DEMO LOGIN
========================= */

function loginDemo() {

    const email =
        document
        .getElementById("loginEmail")
        .value
        .trim();


    const password =
        document
        .getElementById("loginPassword")
        .value
        .trim();


    if (!email || !password) {

        alert(
            "Please enter your email and password."
        );

        return;

    }


    /*
       Demo login.
       No real authentication yet.
    */

    localStorage.setItem(
        "sakshamLoggedIn",
        "true"
    );


    alert(
        "✅ Demo login successful!"
    );


    closeModal();


    /*
       Open dashboard if it exists.
    */

    window.location.href =
        "pages/dashboard.html";

}


/* =========================================================
   CLOSE MODAL
========================================================= */

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


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

window.onclick =
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

    };


/* =========================================================
   PROFILE HELPER
========================================================= */


/* =========================
   GET SAVED PROFILE
========================= */

function getSavedProfile() {

    const saved =
        localStorage.getItem(
            "sakshamProfile"
        );


    if (!saved) {

        return null;

    }


    try {

        return JSON.parse(saved);

    }

    catch (error) {

        return null;

    }

}


/* =========================
   GET APPLICATIONS
========================= */

function getApplications() {

    const saved =
        localStorage.getItem(
            "sakshamApplications"
        );


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(saved);

    }

    catch (error) {

        return [];

    }

}


/* =========================================================
   DEBUG / DEMO INFORMATION
========================================================= */


/*
   You can open the browser console
   and type:

   getSavedProfile()

   or:

   getApplications()

   to see what SAKSHAM has stored.
*/


console.log(
    "SAKSHAM system loaded successfully 🚀"
);
/* =========================================
   UNIVERSAL SAKSHAM SIDEBAR PROFILE
========================================= */

function updateUniversalSidebar() {

    const savedProfile = localStorage.getItem("sakshamProfile");

    if (!savedProfile) return;

    try {

        const profile = JSON.parse(savedProfile);

        const userName = profile.name || "Entrepreneur";
        const businessType = profile.businessType || "Business";

        /* USER NAME */

        const nameElements = document.querySelectorAll(
            "#sidebarName, #sidebarUserName"
        );

        nameElements.forEach(element => {
            element.textContent = userName;
        });


        /* AVATAR */

        const avatarElements = document.querySelectorAll(
            "#sidebarAvatar"
        );

        avatarElements.forEach(element => {
            element.textContent =
                userName.charAt(0).toUpperCase();
        });


        /* BUSINESS TYPE */

        const businessElements = document.querySelectorAll(
            "#sidebarBusinessType"
        );

        businessElements.forEach(element => {
            element.textContent =
                businessType + " Entrepreneur";
        });

    } catch (error) {

        console.error(
            "Could not update sidebar profile:",
            error
        );

    }
}


/* Run automatically when page loads */

document.addEventListener(
    "DOMContentLoaded",
    updateUniversalSidebar
);