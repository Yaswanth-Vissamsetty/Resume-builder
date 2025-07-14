// --- Page Navigation (Landing Page <-> Builder Page) ---
function goToBuilder() {
    document.getElementById('landingPage').classList.remove('active');
    document.getElementById('builderPage').classList.add('active');
    // Initialize the builder state when we go to it
    currentStep = 0;
    updateBuilderUI();
    updatePreview(); // Initial preview update
}

function goToLanding() {
    document.getElementById('builderPage').classList.remove('active');
    document.getElementById('landingPage').classList.add('active');
}

// --- Resume Builder Form Logic ---
let currentStep = 0;
const formSteps = document.querySelectorAll('.form-step');
const stepNavButtons = document.querySelectorAll('.step-btn');
const currentStepNumSpan = document.getElementById('currentStepNum');
const currentStepTitle = document.getElementById('currentStepTitle');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const stepTitles = [
    "Personal Information",
    "Work Experience",
    "Education",
    "Skills"
];

function updateBuilderUI() {
    // Update active form step
    formSteps.forEach((step, index) => {
        if (index === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update active step navigation button
    stepNavButtons.forEach((button, index) => {
        if (index === currentStep) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Update progress bar
    const progress = ((currentStep + 1) / formSteps.length) * 100;
    progressFill.style.width = `${progress}%`;

    // Update step indicator and title
    currentStepNumSpan.textContent = currentStep + 1;
    currentStepTitle.textContent = stepTitles[currentStep];

    // Enable/disable navigation buttons
    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === formSteps.length - 1 ? 'Download' : 'Next';
    nextBtn.innerHTML = currentStep === formSteps.length - 1 ? '<i class="fas fa-download"></i> Download' : 'Next <i class="fas fa-arrow-right"></i>';
}

function nextStep() {
    if (currentStep < formSteps.length - 1) {
        currentStep++;
        updateBuilderUI();
        updatePreview();
    } else {
        // This is the last step, so trigger PDF download
        downloadPDF();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        updateBuilderUI();
        updatePreview();
    }
}

// Allow step navigation via buttons
stepNavButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const stepToGo = parseInt(event.target.dataset.step);
        if (stepToGo !== currentStep) {
            currentStep = stepToGo;
            updateBuilderUI();
            updatePreview();
        }
    });
});


// --- Dynamic Form Fields (Experience and Education) ---

let experienceCount = 0;
function addExperience() {
    experienceCount++;
    const experienceList = document.getElementById('experienceList');
    const newExperienceDiv = document.createElement('div');
    newExperienceDiv.classList.add('experience-item');
    newExperienceDiv.dataset.id = experienceCount; // Assign a unique ID

    newExperienceDiv.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="jobTitle${experienceCount}">Job Title</label>
                <input type="text" id="jobTitle${experienceCount}" placeholder="Software Engineer" oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label for="company${experienceCount}">Company</label>
                <input type="text" id="company${experienceCount}" placeholder="Tech Innovations Inc." oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label for="expLocation${experienceCount}">Location</label>
                <input type="text" id="expLocation${experienceCount}" placeholder="San Francisco, CA" oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label for="startDate${experienceCount}">Start Date</label>
                <input type="month" id="startDate${experienceCount}" oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label for="endDate${experienceCount}">End Date (or Present)</label>
                <input type="month" id="endDate${experienceCount}" oninput="updatePreview()">
                <div class="checkbox-group">
                    <input type="checkbox" id="present${experienceCount}" onchange="toggleEndDate(${experienceCount}); updatePreview()">
                    <label for="present${experienceCount}">Present</label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="expDescription${experienceCount}">Responsibilities & Achievements (one per line)</label>
            <textarea id="expDescription${experienceCount}" rows="3" placeholder="- Developed and maintained web applications..." oninput="updatePreview()"></textarea>
        </div>
        <button type="button" class="btn btn-danger btn-small remove-btn" onclick="removeExperience(${experienceCount})">Remove</button>
        <hr class="form-divider">
    `;
    experienceList.appendChild(newExperienceDiv);
    updatePreview();
}

function removeExperience(id) {
    const itemToRemove = document.querySelector(`.experience-item[data-id="${id}"]`);
    if (itemToRemove) {
        itemToRemove.remove();
        updatePreview();
    }
}

function toggleEndDate(id) {
    const endDateInput = document.getElementById(`endDate${id}`);
    const presentCheckbox = document.getElementById(`present${id}`);
    endDateInput.disabled = presentCheckbox.checked;
    if (presentCheckbox.checked) {
        endDateInput.value = ''; // Clear end date if 'Present' is checked
    }
}


let educationCount = 0;
function addEducation() {
    educationCount++;
    const educationList = document.getElementById('educationList');
    const newEducationDiv = document.createElement('div');
    newEducationDiv.classList.add('education-item');
    newEducationDiv.dataset.id = educationCount;

    newEducationDiv.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="degree${educationCount}">Degree/Major</label>
                <input type="text" id="degree${educationCount}" placeholder="Bachelor of Science in Computer Science" oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label for="university${educationCount}">University/Institution</label>
                <input type="text" id="university${educationCount}" placeholder="University Name" oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label for="eduLocation${educationCount}">Location</label>
                <input type="text" id="eduLocation${educationCount}" placeholder="City, State" oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label for="gradDate${educationCount}">Graduation Date</label>
                <input type="month" id="gradDate${educationCount}" oninput="updatePreview()">
            </div>
        </div>
        <div class="form-group">
            <label for="gpa${educationCount}">GPA (Optional)</label>
            <input type="text" id="gpa${educationCount}" placeholder="3.8/4.0" oninput="updatePreview()">
        </div>
        <button type="button" class="btn btn-danger btn-small remove-btn" onclick="removeEducation(${educationCount})">Remove</button>
        <hr class="form-divider">
    `;
    educationList.appendChild(newEducationDiv);
    updatePreview();
}

function removeEducation(id) {
    const itemToRemove = document.querySelector(`.education-item[data-id="${id}"]`);
    if (itemToRemove) {
        itemToRemove.remove();
        updatePreview();
    }
}


// --- Skills Logic ---
const skills = [];
const skillInput = document.getElementById('skillInput');
const skillsContainer = document.getElementById('skillsContainer');

skillInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        addSkill();
    }
});

function addSkill() {
    const skillText = skillInput.value.trim();
    if (skillText && !skills.includes(skillText)) {
        skills.push(skillText);
        renderSkills();
        skillInput.value = ''; // Clear input
        updatePreview();
    }
}

function removeSkill(skillText) {
    const index = skills.indexOf(skillText);
    if (index > -1) {
        skills.splice(index, 1);
        renderSkills();
        updatePreview();
    }
}

function renderSkills() {
    skillsContainer.innerHTML = '';
    skills.forEach(skill => {
        const skillChip = document.createElement('span');
        skillChip.classList.add('skill-chip');
        skillChip.innerHTML = `${skill} <i class="fas fa-times-circle" onclick="removeSkill('${skill}')"></i>`;
        skillsContainer.appendChild(skillChip);
    });
}


// --- Live Preview Logic ---
const previewName = document.getElementById('previewName');
const previewContact = document.getElementById('previewContact');
const previewSummary = document.getElementById('previewSummary');
const previewExperience = document.getElementById('previewExperience');
const previewEducation = document.getElementById('previewEducation');
const previewSkills = document.getElementById('previewSkills');

// Add event listeners for instant preview updates on personal info
document.getElementById('personalInfoForm').addEventListener('input', updatePreview);

function updatePreview() {
    // Personal Info
    previewName.textContent = document.getElementById('fullName').value || 'Your Name';

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const website = document.getElementById('website').value;
    const linkedin = document.getElementById('linkedin').value;

    let contactHtml = '';
    if (email) contactHtml += `<span><i class="fas fa-envelope"></i> ${email}</span>`;
    if (phone) contactHtml += `<span><i class="fas fa-phone"></i> ${phone}</span>`;
    if (location) contactHtml += `<span><i class="fas fa-map-marker-alt"></i> ${location}</span>`;
    if (website) contactHtml += `<span><i class="fas fa-globe"></i> <a href="${website}" target="_blank">${website.replace(/(^\w+:|^)\/\//, '')}</a></span>`;
    if (linkedin) contactHtml += `<span><i class="fab fa-linkedin"></i> <a href="${linkedin}" target="_blank">${linkedin.replace(/(^\w+:|^)\/\//, '')}</a></span>`;
    previewContact.innerHTML = contactHtml;

    const summaryText = document.getElementById('summary').value;
    if (summaryText) {
        previewSummary.innerHTML = `<h3>Summary</h3><p>${summaryText}</p>`;
    } else {
        previewSummary.innerHTML = '';
    }


    // Experience
    let experienceHtml = '<h3>Experience</h3>';
    const experienceItems = document.querySelectorAll('.experience-item');
    if (experienceItems.length > 0) {
        experienceItems.forEach(item => {
            const id = item.dataset.id;
            const jobTitle = document.getElementById(`jobTitle${id}`).value;
            const company = document.getElementById(`company${id}`).value;
            const expLocation = document.getElementById(`expLocation${id}`).value;
            const startDate = document.getElementById(`startDate${id}`).value;
            const endDateInput = document.getElementById(`endDate${id}`);
            const presentChecked = document.getElementById(`present${id}`).checked;
            const endDate = presentChecked ? 'Present' : endDateInput.value;
            const expDescription = document.getElementById(`expDescription${id}`).value;

            if (jobTitle || company || expLocation || startDate || endDate || expDescription) {
                experienceHtml += `
                    <div class="experience-entry">
                        <h4>${jobTitle || 'Job Title'} at ${company || 'Company'}</h4>
                        <p class="details">${expLocation} | ${startDate} - ${endDate}</p>
                        ${expDescription ? `<ul>${expDescription.split('\n').map(line => `<li>${line.trim()}</li>`).join('')}</ul>` : ''}
                    </div>
                `;
            }
        });
        previewExperience.innerHTML = experienceHtml;
    } else {
        previewExperience.innerHTML = '';
    }


    // Education
    let educationHtml = '<h3>Education</h3>';
    const educationItems = document.querySelectorAll('.education-item');
    if (educationItems.length > 0) {
        educationItems.forEach(item => {
            const id = item.dataset.id;
            const degree = document.getElementById(`degree${id}`).value;
            const university = document.getElementById(`university${id}`).value;
            const eduLocation = document.getElementById(`eduLocation${id}`).value;
            const gradDate = document.getElementById(`gradDate${id}`).value;
            const gpa = document.getElementById(`gpa${id}`).value;

            if (degree || university || eduLocation || gradDate || gpa) {
                educationHtml += `
                    <div class="education-entry">
                        <h4>${degree || 'Degree'} from ${university || 'University'}</h4>
                        <p class="details">${eduLocation} | Graduated: ${gradDate}</p>
                        ${gpa ? `<p class="details">GPA: ${gpa}</p>` : ''}
                    </div>
                `;
            }
        });
        previewEducation.innerHTML = educationHtml;
    } else {
        previewEducation.innerHTML = '';
    }


    // Skills
    if (skills.length > 0) {
        previewSkills.innerHTML = `<h3>Skills</h3><ul class="skills-list">${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>`;
    } else {
        previewSkills.innerHTML = '';
    }
}


// --- PDF Download Logic ---
function downloadPDF() {
    const element = document.getElementById('resumePreview');
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5], // Top, Left, Bottom, Right
        filename: 'my-resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

// Initial UI update when page loads (useful if builderPage is initially active for testing)
document.addEventListener('DOMContentLoaded', () => {
    // Check which page is active and initialize accordingly
    if (document.getElementById('builderPage').classList.contains('active')) {
        updateBuilderUI();
        updatePreview();
    }
});

// Call updatePreview initially for all input fields when they change
// This handles inputs in dynamically added fields too
document.addEventListener('input', (event) => {
    if (event.target.closest('.form-step')) {
        updatePreview();
    }
});