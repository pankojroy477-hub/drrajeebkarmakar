# Dr. Rajeebshankar Karmakar — Official Medical Website

**Domain Reserved for Future Use:** [https://drrajeebkarmakar.com](https://drrajeebkarmakar.com)  
*(Note: Do not configure custom domain or CNAME yet. The current setup deploys directly to GitHub Pages at `https://<USERNAME>.github.io/<REPO>/`.)*

**Physician:** Dr. Rajeebshankar Karmakar (ডা. রাজীবশঙ্কর কর্মকার)  
**BMDC Registration No:** A-61665  
**Designation:** Assistant Professor (Thoracic Surgery), Faridpur Medical College Hospital  
**Additional Designation:** Consultant, Thoracic & Oesophageal Surgeon  
**Specialty:** Chest Specialist & Surgical Pulmonologist  
**Clinical Experience:** 12+ Years  
**Tagline:** Expert Care for Healthy Lungs & Better Life / সুস্থ ফুসফুস, স্বস্তির নিঃশ্বাস, উন্নত জীবন  

---

## 🚀 Overview & Modern Static Architecture

This website has been built and structured as a **blazing fast, high-performance static website** engineered for **Google AI Studio live preview** and **GitHub Pages automated deployment**:

- **Build Tool:** [Vite](https://vitejs.dev/) with relative asset base configuration (`base: './'`).
- **Markup:** Pure semantic HTML5 (`index.html`) structured as a responsive single-page experience.
- **Styling:** CSS3 custom design system (`src/style.css`) with Tailwind CSS utility classes and responsive breakpoints.
- **Interactivity:** Vanilla JavaScript (`src/main.js`) handling bilingual language toggling, mobile drawer navigation, live publication keyword search, FAQ accordions, and WhatsApp appointment serial dispatch.
- **Motion:** GSAP & ScrollTrigger with automatic reduced-motion accessibility overrides.
- **Icons:** Lightweight inline SVG medical icons with fixed dimensional safety rules.
- **SEO & Structured Data:** Validated Schema.org `Physician` JSON-LD schema, OpenGraph preview cards, and meta tags.
- **Deployment:** GitHub Actions workflow (`.github/workflows/deploy.yml`) building the static `dist/` directory and publishing directly to GitHub Pages.

---

## 📁 Directory Structure

```
doctor-website/
├── index.html                      # Single-page static entry point
├── package.json                    # Dependencies, scripts, and build tasks
├── vite.config.js                  # Vite configuration with relative base: './'
├── .nojekyll                       # Bypasses Jekyll processing on GitHub Pages
├── README.md                       # Comprehensive documentation
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions automated deployment to GitHub Pages
├── public/
│   ├── images/
│   │   ├── doctor/                 # Authentic doctor portraits & badges (SVG & PNG)
│   │   └── medical/                # Anatomical vector lung illustrations
│   ├── favicon.svg                 # Scalable medical lung favicon
│   ├── robots.txt                  # Search engine crawl directives
│   └── sitemap.xml                 # Canonical XML sitemap
├── src/
│   ├── main.js                     # Vanilla JS entry point (language switcher, drawer, WhatsApp logic)
│   └── style.css                   # Custom medical design system & CSS variables
├── data/
│   ├── doctor.json                 # Verified doctor credentials, chambers & publications
│   └── translations.json           # Bengali & English UI dictionary
└── tests/
    └── basic-checks.test.js        # Node.js automated test suite for data & privacy integrity
```

---

## 🛠️ Local Development & Build Commands

### 1. Requirements
- Node.js 18 LTS or 20 LTS
- npm 9+

### 2. Available NPM Scripts

```bash
# Start Vite development server on port 3000 (accessible at http://localhost:3000)
npm run dev

# Compile and bundle static production assets into the 'dist/' directory
npm run build

# Preview the production build locally from the 'dist/' folder
npm run preview

# Execute the 7 automated unit and data compliance tests
npm test
```

---

## 🌐 GitHub Pages Deployment Guide

### Step 1: Push Code to GitHub
Ensure all repository files (including `.nojekyll` and `.github/workflows/deploy.yml`) are committed and pushed to your GitHub repository (e.g., `main` branch):

```bash
git add .
git commit -m "Configure Vite static build for GitHub Pages"
git push origin main
```

### Step 2: Enable GitHub Actions Deployment in Repository Settings
1. Open your repository on **GitHub.com**.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, choose **GitHub Actions** (instead of "Deploy from a branch").
4. The workflow file `.github/workflows/deploy.yml` will automatically detect commits to `main`, run `npm run build`, upload the `dist/` artifact, and publish to GitHub Pages.

### Step 3: Access Your Published Website
Once the GitHub Action completes (typically under 1 minute), your website will be live at:
```
https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPOSITORY-NAME>/
```

Because Vite is configured with `base: './'`, all CSS, JavaScript, SVGs, images, and fonts will load properly with relative paths, without any 404 errors or missing stylesheet issues regardless of the repository path prefix!

---

## 🔗 Future Custom Domain Setup (drrajeebkarmakar.com)

When you are ready to connect `drrajeebkarmakar.com`:
1. In your domain registrar (e.g., Namecheap, Cloudflare, GoDaddy):
   - Add four `A` records pointing to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add a `CNAME` record for `www` pointing to `<YOUR-GITHUB-USERNAME>.github.io`.
2. In GitHub repository **Settings** > **Pages** > **Custom domain**, enter `drrajeebkarmakar.com`.
3. Check the box for **Enforce HTTPS**.
4. (Optional) Create a `CNAME` file containing `drrajeebkarmakar.com` inside the root or `public/` directory so it persists across builds.

---

## 🏥 Doctor Profile, Chambers & Appointments

### Doctor Qualifications
- **MBBS** — Rajshahi Medical College (RMC).
- **BCS (Health)** — 33rd BCS Health Cadre, Ministry of Health & Family Welfare.
- **MS (Thoracic Surgery)** — National Institute of Diseases of the Chest and Hospital (NIDCH), Dhaka.
- **MRCSI** — Member of the Royal College of Surgeons in Ireland.
- **MRCSEd** — Member of the Royal College of Surgeons of Edinburgh.
- **FICS** — Fellow of the International College of Surgeons (USA/International).

### Verified Chamber Locations & Schedules
1. **Southern General Hospital (সাউদার্ন জেনারেল হাসপাতাল):**
   - **Address:** West Khabaspur, near Faridpur Medical College Hospital, Faridpur-7800, Bangladesh.
   - **Visiting Schedule:** Thursday, 3:00 PM – 5:00 PM.
   - **Serial Phone:** `01944648809`.
2. **প্রবাসী হাসপাতাল (Probashi Hospital):**
   - **Address:** Haoladar Tower, Tekerhat Bus Stand, Rajoir, Madaripur, Bangladesh.
   - **Visiting Schedule:** Friday, 10:00 AM – 3:00 PM.
   - **Serial Phone:** `01944648809`.

### Online Consultation & Digital Serial
- **WhatsApp:** `+8801944648809` (Link: [https://wa.me/8801944648809](https://wa.me/8801944648809))
- **Email:** `rajeebfmc16@gmail.com`
- **Facebook Profile:** [https://www.facebook.com/profile.php?id=61581763712798](https://www.facebook.com/profile.php?id=61581763712798)

---

## 🔒 Privacy & Safety Compliance
- **No Private Residential Addresses:** As per patient privacy and professional guidelines, residential addresses and personal non-public contact numbers from CV records are strictly excluded.
- **No Mock Testimonials / Invented Stats:** No fake patient counts, success rates, or fabricated ratings are used.
- **Emergency Disclaimer:** Prominently alerts patients with sudden acute breathlessness, massive hemoptysis (blood coughing), or crushing chest pain to immediately visit hospital emergency departments.
- **Zero Third-Party Database Tracking:** Appointment requests formulate direct WhatsApp messages to the chamber assistant, avoiding storing patient medical records on unauthorized servers.
