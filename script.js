/* ==========================================================================
   Bhanu Ganesh — Computer Vision Engineer Portfolio
   Vanilla JS: nav, scrollspy, reveal, project modals, lazy video.
   ========================================================================== */
(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Year ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ---------- Header scroll state ---------- */
    var header = document.getElementById("siteHeader");
    function onScrollHeader() {
        if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    }
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    /* ---------- Back to top ---------- */
    var backTop = document.getElementById("backToTop");
    function onScrollTop() {
        if (backTop) backTop.classList.toggle("show", window.scrollY > 600);
    }
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    if (backTop) {
        backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        });
    }

    /* ---------- Mobile nav ---------- */
    var navToggle = document.getElementById("navToggle");
    var siteNav = document.getElementById("siteNav");

    function closeNav() {
        if (!navToggle || !siteNav) return;
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
            var open = siteNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(open));
            navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        });
        siteNav.addEventListener("click", function (e) {
            if (e.target.closest("a")) closeNav();
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth > 820) closeNav();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeNav();
        });
    }

    /* ---------- Scrollspy ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
    var spySections = navLinks
        .map(function (a) {
            return document.querySelector(a.getAttribute("href"));
        })
        .filter(Boolean);

    if ("IntersectionObserver" in window && spySections.length) {
        var spy = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var target = "#" + entry.target.id;
                        navLinks.forEach(function (link) {
                            link.classList.toggle("is-active", link.getAttribute("href") === target);
                        });
                    }
                });
            },
            { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
        );
        spySections.forEach(function (s) {
            spy.observe(s);
        });
    }

    /* ---------- Reveal on scroll ---------- */
    var revealTargets = document.querySelectorAll(
        ".value-card, .cap-card, .skill-group, .life-item, .rw-group, .arch-card, .impact-item, .p-card"
    );

    if (prefersReducedMotion) {
        revealTargets.forEach(function (el) {
            el.classList.add("rv", "in");
        });
    } else if ("IntersectionObserver" in window) {
        var revealObs = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        revealTargets.forEach(function (el) {
            el.classList.add("rv");
            revealObs.observe(el);
        });
    } else {
        revealTargets.forEach(function (el) {
            el.classList.add("in");
        });
    }

    /* ---------- Typed.js ---------- */
    var typedEl = document.querySelector(".typed-text");
    if (typedEl) {
        if (prefersReducedMotion || typeof Typed === "undefined") {
            typedEl.textContent = "production computer vision systems";
        } else {
            new Typed(typedEl, {
                strings: [
                    "computer vision & AI",
                    "detection & tracking",
                    "vision transformers",
                    "edge & cloud AI",
                    "production CV systems"
                ],
                typeSpeed: 55,
                backSpeed: 30,
                backDelay: 1800,
                startDelay: 400,
                loop: true
            });
        }
    }

    /* ==========================================================================
       PROJECT MODAL
       ========================================================================== */

    /** Data lives here so the modal is rendered on demand (lightweight + lazy). */
    var PROJECTS = {
        /* ---------------- APPLIED / REAL-WORLD USE CASES ---------------- */
        pilgrim: {
            tag: "Identity · Registration",
            title: "Pilgrim Registration & Identity",
            img: "images/piligrame.jpg",
            summary: "Vision-assisted registration and identity verification integrated into a high-volume operational process.",
            business: "High-throughput registration where manual identity checks create queues and fatigue-related errors. The system had to speed up verification while staying integrated with existing operational steps.",
            cv: "Face capture in crowded, unconstrained conditions — varied pose, lighting, and distance. Verification is a one-to-many search that needs threshold tuning to control false accepts against false rejects.",
            pipeline: ["Capture Station", "Face Detection", "Quality Screening", "Embedding Extraction", "Matching vs Enrollment DB", "Verification Result", "Operational Workflow Integration"],
            approach: "Face detection plus deep embedding comparison against an enrollment database, with quality screening (blur, pose, size) and tuned matching thresholds.",
            dataset: "Organized face captures during registration; embedding corpus built from enrollment data.",
            challenges: ["Unconstrained capture conditions", "Crowding and overlapping faces", "Threshold selection (FAR vs FRR)", "Integration inside a live operational flow"],
            contribution: ["Worked on face detection and embedding matching", "Evaluated thresholds and quality filters", "Participated in debugging integration with the operational workflow"],
            tech: ["Python", "OpenCV", "Face Recognition", "Flask"],
            results: "Evaluated matching accuracy and participated in UAT / field demonstrations of the workflow. Metric-free by design."
        },

        transit: {
            tag: "Identity · Transit",
            title: "Transit Passenger Identity",
            img: "images/Transit Passenger Identity.jpg",
            summary: "Passenger identity verification with biometric and card/RFID fallback paths for inconclusive matches.",
            business: "Confirming passenger identity and eligibility at transit points. A biometric-only path fails for a portion of passengers, so an alternate identity path (card / RFID / Aadhaar-style) must take over without breaking the flow.",
            cv: "Face recognition under varied capture conditions combined with reliable fallback selection. Inconclusive biometric matches must degrade gracefully instead of failing the passenger at the gate.",
            pipeline: ["Passenger Capture", "Face Detection", "Biometric Matching", "Confident? → Verify / Fallback", "Card / RFID / Aadhaar Fallback", "Verification Result"],
            approach: "Face verification with a hard fallback route when matching confidence is too low, integrating biometric and card-based data sources in one flow.",
            dataset: "Enrollment captures plus test imagery from the deployment environment covering fallback conditions.",
            challenges: ["Inconclusive biometric matches", "Capture variability across points", "Reliable fallback logic and UX", "False-positive control at the decision point"],
            contribution: ["Built and evaluated the face verification path", "Worked on the biometric → fallback decision logic", "Integrated with RFID / card inputs"],
            tech: ["Python", "OpenCV", "Face Recognition", "Flask", "RFID Integration"],
            results: "Developed and evaluated the verification + fallback flow. Figures available on request."
        },

        attendance: {
            tag: "Identity · Attendance",
            title: "Multi-Site Face Attendance",
            summary: "Face-based enrollment and attendance workflow deployed across multiple institutions.",
            business: "Manual attendance is slow, error-prone, and open to proxy marking. Institutions needed a centralized, hard-to-fake attendance flow that could roll out reliably across sites.",
            cv: "Recognition must tolerate enrollment-quality and site-lighting variation, maintain consistent matching, and prevent substitution — while scaling enrollment and daily matches across sites.",
            pipeline: ["Site Camera", "Face Detection", "Enroll or Match", "Attendance Record", "Central Store / API", "Reports & Admin"],
            approach: "Face enrollment and recognition with a central store, per-deployment threshold tuning, and an API for site integrations.",
            dataset: "Enrollment images per institution, with evaluation sets covering the lighting and device variation expected on site.",
            challenges: ["Enrollment image quality", "Lighting differences between sites", "Proxy / substitution prevention", "Operational rollout and admin workflow"],
            contribution: ["Worked on detection, matching, and the attendance workflow", "Participated in multi-site rollout and debugging", "Evaluated recognition on real site conditions"],
            tech: ["Python", "OpenCV", "Face Recognition", "Flask", "SQL", "API"],
            results: "Developed and evaluated the recognition workflow with involvement in multi-site rollout. Scale details kept qualitative here."
        },

        "sku-vit": {
            tag: "Research · Retail",
            title: "ViT-Based SKU Recognition",
            img: "images/retail.jpg",
            summary: "Using transformer backbones and visual representations to separate visually similar products in a SKU-recognition proof of concept.",
            business: "Classic CNN classifiers and simple retrieval miss the distinctions between near-identical SKUs. The goal was to evaluate whether transformer-based representations separate these classes better.",
            cv: "Learning a robust embedding space where near-identical products are discriminable; transfer learning from large pretrained backbones with limited labeled retail data; and a sound evaluation setup.",
            pipeline: ["Product Image", "ViT / Pretrained Backbone", "Embedding", "Similarity Search", "Top-K SKU Candidates", "Match Confirmation"],
            approach: "Transformer backbones used as feature extractors with nearest-neighbour retrieval as the POC decision layer.",
            dataset: "Product images across a small SKU set, augmented with pose and lighting variation to test robustness.",
            challenges: ["Near-identical class separation", "Limited labeled retail data", "Evaluation methodology for retrieval", "POC → production gap"],
            contribution: ["Explored transformer representations for SKU ID", "Built and evaluated the retrieval POC", "Compared embedding approaches on the target SKU set"],
            tech: ["PyTorch", "Vision Transformer", "Similarity Search", "Python"],
            results: "Proof-of-concept stage: transformer representations evaluated against a baseline. No production metrics claimed."
        },

        gauge: {
            tag: "Industrial · Monitoring",
            title: "Analogue Gauge Reading",
            img: "images/angole meter  reading.jpg",
            summary: "Automated detection and reading of analogue dials and industrial meters from field imagery.",
            business: "Manual periodic gauge reading is slow, hazard-prone in industrial areas, and error-prone. Automated reading enables remote, repeatable monitoring.",
            cv: "Locating gauges in cluttered scenes, then reading needle/dial geometry under glare, reflection, perspective, and small-marking conditions.",
            pipeline: ["Field / Line Image", "Gauge Detection", "ROI Extraction", "Keypoint / Dial Geometry Analysis", "Reading Computation", "Record / Alert"],
            approach: "Detection to isolate the gauge, then keypoint- or geometry-based needle analysis with calibration mapping to convert dial position into a reading.",
            dataset: "Real gauge images covering multiple dial types, reflections, and angles; annotation of gauge regions and calibration points.",
            challenges: ["Glare and reflections", "Perspective and tilt", "Dial and marking variability", "Reading precision vs dial resolution"],
            contribution: ["Worked on the gauge detection and reading pipeline", "Evaluated reading accuracy across dial variations", "Calibration and geometry mapping"],
            tech: ["YOLO", "Keypoint Models", "OpenCV", "Python"],
            results: "Developed and evaluated the detection + reading pipeline. Reading-accuracy numbers available on request."
        },

        inspection: {
            tag: "Industrial · Quality",
            title: "Industrial Quality Inspection",
            img: "images/quality_inspection.jpg",
            summary: "Automated visual QC for packaging, product defects, foreign particles, label/barcode integrity, and dimensions.",
            business: "Manual line inspection is inconsistent and cannot keep pace with production speed. Repeatable automated checks are needed for quality and conformance with clear pass/fail decisions.",
            cv: "Detecting subtle defects and inconsistencies at line speed, checking label/barcode presence and readability, and measuring dimensions — under varying conditions, with a hard FP/FN business trade-off (rejecting good vs passing bad).",
            pipeline: ["Line Camera", "Frame Acquisition", "Preprocessing", "Detection / OCR / Barcode", "Defect & Dimension Checks", "Pass / Fail Decision", "Reject · Log · API"],
            approach: "Detection and classification models combined with OCR / barcode modules and geometric checks, fused into a single pass/fail decision pipeline.",
            dataset: "Defect and conforming samples curated from production imagery; annotation of defect classes, labels, and expected dimensions.",
            challenges: ["Speed vs accuracy", "Subtle defect appearances", "Label / barcode quality variability", "Lighting inconsistency", "FP/FN business trade-off"],
            contribution: ["Worked on inspection pipeline components", "Trained and evaluated detection and OCR modules", "Participated in integration with the client QC workflow"],
            tech: ["YOLO", "OCR", "OpenCV", "Python", "Docker"],
            results: "Developed and evaluated inspection components in a QC workflow context. Metrics available on request."
        },

        "glass-bottle": {
            tag: "Bottling · Glass",
            title: "Glass Bottle Inspection",
            img: "images/glass_bottling.jpg",
            summary: "360° glass bottle inspection for transparent-body defects and glass/foreign particles down to 0.5 mm.",
            business: "Transparent bottle lines need inspection that human eyes miss — small glass shards, embedded particles, and subtle body defects — checked across the full 360° surface at line speed.",
            cv: "Detecting sub-millimetre glass particles and foreign particles (black, opaque, red) on a clear, reflective surface, plus transparent-body defects like cut marks, mold, and blister.",
            pipeline: ["Line / 360° Capture", "Frames + Views", "Glass Particle Detection", "Foreign-Particle Classification (black / opaque / red)", "Body Defect Checks (cut · mold · blister)", "Pass / Fail", "Reject · Log · API"],
            approach: "Detection models tuned to catch 0.5 mm+ particles and body defects across multiple capture views, fused into a per-bottle pass/fail decision.",
            dataset: "Real line imagery annotated for particle types, defect classes, and conforming samples.",
            challenges: ["Sub-millimetre targets", "Reflections on glass", "Transparent-object contrast", "FP/FN trade-off per defect class"],
            contribution: ["Worked on the particle and defect detection pipeline", "Participated in annotation, evaluation, and line integration", "Helped tune thresholds to the pass/fail business rule"],
            tech: ["YOLO", "OpenCV", "Python", "Flask"],
            results: "Line-trialed bottle inspection achieving ~90% accuracy. Numbers as reported from the field."
        },

        "pet-bottle": {
            tag: "Bottling · PET",
            title: "PET Bottle Inspection",
            img: "images/pet_bottle.jpg",
            summary: "360° PET bottle inspection with base foreign-particle detection (hair, resin, ants) down to 0.5 mm.",
            business: "PET lines produce bottles fast, and base contamination (hair, resin, ants, particulates) reaches the consumer unless caught at speed. Inspection must cover the full bottle, including the base.",
            cv: "Finding small foreign particles concentrated at the bottle base and across the body using 360° coverage, under the lighting/angle variability of a running line.",
            pipeline: ["Line / 360° Capture", "Frames + Views", "Base ROI Extraction", "Foreign-Particle Detection", "Body Check", "Pass / Fail", "Reject · Log · API"],
            approach: "Detection across 360° capture views with a focused base-inspection region, thresholded for the 0.5 mm minimum particle size.",
            dataset: "Base and body imagery from the line covering hair, resin, ants, and other particulates.",
            challenges: ["Small particles at the base", "Base geometry / shadowing", "View stitching and coverage", "Speed vs detection reliability"],
            contribution: ["Worked on base foreign-particle detection", "Participated in dataset curation and evaluation", "Helped with line integration and threshold tuning"],
            tech: ["YOLO", "OpenCV", "Python", "Flask"],
            results: "Line-trialed PET inspection achieving ~90% accuracy. Numbers as reported from the field."
        },

        "gallon-bottle": {
            tag: "Bottling · Bulk",
            title: "5-Gallon Bottle Inspection",
            img: "images/5g.jpg",
            summary: "Full-body and base inspection for 5-gallon (19 L) bottles.",
            business: "Large-format 5-gallon bottles return and refill, so repeated surface and base damage or contamination must be reliably rejected before filling.",
            cv: "Inspecting the full body and base of large, semi-reflective containers for defects, scratches, and contamination across multiple views.",
            pipeline: ["Container Capture", "Body Views", "Base View", "Defect / Contamination Detection", "Pass / Fail", "Reject · Log · API"],
            approach: "Full-body plus base inspection using staged capture views and detection tuned to the 5-gallon container geometry.",
            dataset: "Body/base imagery from return-and-refill lines annotated for damage and contamination.",
            challenges: ["Large surface coverage", "Reflections and curvature", "Base inspection access", "Repeat-use damage patterns"],
            contribution: ["Worked on the full-body and base inspection pipeline", "Participated in evaluation and threshold tuning"],
            tech: ["YOLO", "OpenCV", "Python", "Flask"],
            results: "Trialed on refill-line containers achieving ~90% accuracy. Numbers as reported from the field."
        },

        "box-count": {
            tag: "Packaging · Live",
            title: "Box Counting (Conveyor)",
            img: "images/box_counting.jpg",
            summary: "Live production deployment counting boxes on a moving conveyor — ~98% production accuracy.",
            business: "A live packaging operation needed accurate box counts on a moving conveyor for production accounting, replacing manual tallies.",
            cv: "Detecting and counting boxes as they move past the camera while occluded by each other and the conveyor, at production speed.",
            pipeline: ["Conveyor Camera", "Box Detection", "Tracking / Counting", "Count Aggregation", "Reports / API"],
            approach: "Detection plus tracking to count boxes once per pass, with end-to-end orchestration from data gathering to model deployment.",
            dataset: "Production conveyor imagery curated and orchestrated end to end for the counting models.",
            challenges: ["Overlapping boxes", "Motion and speed", "Counting reliability at line rate", "Deployment into the live workflow"],
            contribution: ["End-to-end data orchestration — from gathering to model deployment", "Built and evaluated the counting model", "Deployed and tuned on the live conveyor"],
            tech: ["YOLO", "OpenCV", "Python", "Flask"],
            results: "Live production deployment with ~98% production accuracy. Numbers as reported from the field."
        },

        tissue: {
            tag: "FMCG · Tissue",
            title: "Tissue Inspection",
            img: "images/tissue.jpg",
            summary: "Visual inspection of tissue products for surface and production defects.",
            business: "Tissue manufacturing needs consistent visual quality checks that keep up with line output and catch defects traditional QC misses.",
            cv: "Detecting surface-level defects on low-contrast tissue material under variable lighting and high throughput.",
            pipeline: ["Line Camera", "Roll / Sheet Frame", "Defect Detection", "Pass / Fail", "Reject · Log"],
            approach: "Detection models trained to flag visible tissue defects against a low-contrast, near-white background.",
            dataset: "Tissue-line imagery annotated for defect classes and conforming material.",
            challenges: ["Low surface contrast", "Lighting consistency", "Defect subtlety", "Line throughput"],
            contribution: ["Worked on the tissue defect detection pipeline", "Participated in dataset curation and evaluation"],
            tech: ["YOLO", "Segmentation", "OpenCV", "Python"],
            results: "Developed and evaluated the inspection pipeline. Metrics available on request."
        },

        biscuit: {
            tag: "FMCG · Biscuit",
            title: "Biscuit Inspection",
            img: "images/biscuit.jpg",
            summary: "Biscuit line inspection for broken pieces, burnt areas, and other visible defects.",
            business: "Bakery lines need broken, burnt, or otherwise malformed biscuits rejected before packing while conforming product passes at speed.",
            cv: "Distinguishing broken or burnt biscuits from conforming ones with varied shapes and bake tone, on a moving line.",
            pipeline: ["Line Camera", "Biscuit Detection", "Defect Classification (broken · burnt · OK)", "Pass / Fail", "Reject · Log"],
            approach: "Detection plus defect classification per biscuit, tuned to hold the reject/pass balance the line requires.",
            dataset: "Bakery-line imagery covering broken, burnt, and conforming biscuits.",
            challenges: ["Bake-tone variability", "Class imbalance", "Edge/broken appearance variance", "Line speed"],
            contribution: ["Worked on detection and defect classification", "Participated in dataset curation and evaluation"],
            tech: ["YOLO", "OpenCV", "Python"],
            results: "Developed and evaluated the inspection pipeline. Metrics available on request."
        },

        /* ---------------- EXPERIMENTS & DEMOS ---------------- */
        d1: {
            tag: "Experiment · Face",
            title: "Face Recognition Attendance System",
            summary: "A self-contained desktop attendance tool: real-time face detection, capture, training, and recognition.",
            video: { src: "images/attendances.mp4", poster: "images/facial recognization.jpeg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/attendances", label: "View source on GitHub" },
            business: "Explored whether a complete face-attendance tool could be built with open-source libraries — detection, enrollment, and matching in a single desktop application.",
            cv: "Real-time face detection and recognition against a locally trained model, requiring consistent enrollment captures for reliable matching.",
            pipeline: ["Webcam Frame", "Face Detection", "Capture / Enroll", "Train Recognizer", "Real-Time Matching", "Attendance Log"],
            approach: "OpenCV-based face detection plus a locally trained recognition model wrapped in a Tkinter desktop UI.",
            dataset: "Self-captured face samples per user for training the recognizer.",
            challenges: ["Lighting variation during matching", "Enrollment consistency", "Real-time performance on CPU"],
            contribution: "Designed and built the end-to-end desktop application.",
            tech: ["Python", "OpenCV", "Tkinter"],
            results: "Working desktop prototype — see the demo video."
        },

        d2: {
            tag: "Experiment · Interaction",
            title: "Gesture Control",
            summary: "Hand-gesture control of system audio volume and screen brightness, with adjustable sensitivity.",
            video: { src: "images/gesture_control.mp4", poster: "images/gestut.jpeg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/bright_and_volume", label: "View source on GitHub" },
            business: "Contactless control of device settings (volume, brightness) for users and interaction POCs.",
            cv: "Robust hand tracking and gesture mapping to continuous control values, with sensitivity tuning per user.",
            pipeline: ["Webcam Frame", "Hand Landmark Detection", "Gesture Mapping", "System Control Command"],
            approach: "Hand landmark tracking mapped to volume/brightness levels with configurable sensitivity.",
            dataset: "No external dataset — gesture logic evaluated live across users and lighting.",
            challenges: ["Hand detection stability", "Gesture → value mapping", "Sensitivity and multi-user tuning"],
            contribution: "Built the full pipeline from capture to system control.",
            tech: ["Python", "OpenCV", "MediaPipe"],
            results: "Interactive prototype — see the demo video."
        },

        d3: {
            tag: "Experiment · Privacy",
            title: "Real-Time Face Blurring",
            summary: "Dynamic face / eye detection with immediate blurring for privacy and aesthetic workflows.",
            video: { src: "images/face blur.mp4", poster: "images/face blur.jpeg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/blur", label: "View source on GitHub" },
            business: "Protecting identities in video — applicable to anonymization in CCTVs, recording, and broadcasting.",
            cv: "Face and eye localization across frames with stable blur regions that track movement without flicker.",
            pipeline: ["Frame", "Face / Eye Detection", "Region Tracking", "Blur Application", "Anonymized Output"],
            approach: "Detection-per-frame followed by region blur, with smoothing to keep blur stable.",
            dataset: "Live webcam tests across poses and lighting.",
            challenges: ["Tracking stability", "Blur region consistency", "Performance on live video"],
            contribution: "Built the full detection → blur pipeline.",
            tech: ["Python", "OpenCV"],
            results: "Working real-time prototype — see the demo video."
        },

        d4: {
            tag: "Experiment · Traffic",
            title: "Speed Detection",
            summary: "Real-time vehicle detection, classification, and number-plate recognition for traffic monitoring.",
            video: { src: "images/SPEED.mp4", poster: "images/speed.jpeg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/speed_vehical", label: "View source on GitHub" },
            business: "Traffic-monitoring concepts: counting vehicles, classifying type, and capturing plates for downstream use.",
            cv: "Detecting and classifying vehicles in traffic video, tracking them across frames, and reading plates under motion and varied angles.",
            pipeline: ["Traffic Video", "Vehicle Detection", "Classification", "Tracking", "Plate Detection", "Plate OCR", "Speed / Count Metric"],
            approach: "Detection + classification model, lightweight tracking for persistence, and OCR for number plates.",
            dataset: "Public traffic footage used for evaluation.",
            challenges: ["Motion and perspective", "Plate angle and blur", "Overlap / occlusion between vehicles"],
            contribution: "Built detection, tracking, and plate-OCR components end to end.",
            tech: ["YOLO", "OpenCV", "Python", "OCR"],
            results: "Working prototype demonstrating the full pipeline — see the demo video."
        },

        d5: {
            tag: "Experiment · Stylization",
            title: "Sketchify",
            summary: "Live webcam stream converted into a pencil-sketch style in real time.",
            video: { src: "images/sketch_video.mp4", poster: "images/pencil_sketch_1.jpg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/sketch/live_sketch", label: "View source on GitHub" },
            business: "Realtime visual effect that transforms camera frames into artistic sketches.",
            cv: "Image-processing stylization (edge/pencil rendering) applied per frame at interactive rates.",
            pipeline: ["Webcam Frame", "Grayscale / Invert", "Edge Emphasis (blur &dash; dodge)", "Sketch Output"],
            approach: "Classic openCV pencil-sketch pipeline using blur-dodge edge emphasis.",
            dataset: "None — pure image-processing effects evaluated live.",
            challenges: ["Frame-rate performance", "Noise handling in low light"],
            contribution: "Built the live CV stylization effect.",
            tech: ["OpenCV", "Python"],
            results: "Live interactive demo — see the video."
        },

        d6: {
            tag: "Experiment · Tools",
            title: "CodeScape",
            summary: "Generate, scan, and interact with a variety of QR codes — bridging physical and digital.",
            video: { src: "images/QR_code.mp4", poster: "images/qr_image.jpg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/qr%20code", label: "View source on GitHub" },
            business: "A compact QR toolkit: creation and decoding with camera-based scanning.",
            cv: "Robust QR localization and decoding from camera frames under varied lighting and angles.",
            pipeline: ["Camera Frame", "QR Detection / Localization", "Decoding", "Result Action"],
            approach: "QR generation plus OpenCV-based detection and decoding in one tool.",
            dataset: "Live scans covering angles, sizes, and lighting.",
            challenges: ["QR detection at angles", "Low-light scanning"],
            contribution: "Built generate + scan + decode workflows.",
            tech: ["Python", "OpenCV", "Flask"],
            results: "Working toolkit — see the demo video."
        },

        d7: {
            tag: "Experiment · Experience",
            title: "SriRamaChintana",
            summary: "An immersive, vision-driven explorable experience built for a cultural celebration.",
            video: { src: "images/taraka_mantra.mp4", poster: "images/rama (1).jpg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/RAm", label: "View source on GitHub" },
            business: "A themed, interactive exploration that blends vision technology with a devotional celebration.",
            cv: "Vision-driven interactive elements layered onto a curated visual experience.",
            pipeline: ["Experience Scene", "Vision / Interactive Layer", "Rendered Response", "Explorable Output"],
            approach: "Interactive multi-part experience using CV concepts to drive discovery.",
            dataset: "None — curated creative content.",
            challenges: ["Blending CV interactivity with narrative flow"],
            contribution: "Built the interactive vision-driven experience.",
            tech: ["Python", "OpenCV"],
            results: "Immersive demo — see the video."
        },

        d8: {
            tag: "Experiment · Safety",
            title: "Guardian Gaze",
            summary: "Autonomous eye-tracking sentinel for driver drowsiness and late-night attention.",
            video: { src: "images/BLINK.mp4", poster: "images/nigth.jpg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/read", label: "View source on GitHub" },
            business: "Road-safety concept: detect drowsiness or inattention (closed eyes / blink patterns) and alert the driver.",
            cv: "Real-time eye localization and blink-rate analysis under low light and face motion.",
            pipeline: ["Face Frame", "Eye Landmark Detection", "Blink / Eye-State Classification", "Drowsiness Heuristic", "Alert Trigger"],
            approach: "Facial landmarks to estimate eye openness; blink frequency and duration drive a drowsiness alert.",
            dataset: "Live webcam tests including night conditions.",
            challenges: ["Low-light eye detection", "Head movement", "Blink-rate heuristics"],
            contribution: "Built the eye-tracking and alert pipeline.",
            tech: ["Python", "OpenCV", "Blink Detection"],
            results: "Working safety prototype — see the demo video."
        },

        d9: {
            tag: "Experiment · Interaction",
            title: "Gesture Drift",
            summary: "A driving game steered with hand and head movements via computer vision.",
            video: { src: "images/car game.mp4", poster: "images/gesture_car.jpg" },
            link: { url: "https://github.com/BHANUGANESH342/Tefologic_portfolio/tree/main/patriatic%20-%20Copy", label: "View source on GitHub" },
            business: "Physics-free controller play: replace keyboard steering with natural gestures for an immersive game.",
            cv: "Tracking hand position and head movement to map to steering/acceleration smoothly in real time.",
            pipeline: ["Webcam Frame", "Hand / Head Tracking", "Steering Mapping", "Game Input", "Rendered Game"],
            approach: "Hand and head landmark tracking mapped to game controls, with smoothing for drivable input.",
            dataset: "None — tracking evaluated live.",
            challenges: ["Low-latency control", "Smoothing for stable steering"],
            contribution: "Built the gesture-to-game-control bridge.",
            tech: ["Python", "OpenCV", "MediaPipe"],
            results: "Playable prototype — see the demo video."
        }
    };

    /* ---------- Modal plumbing ---------- */
    var modal = document.getElementById("projectModal");
    var modalMedia = document.getElementById("modalMedia");
    var modalTag = document.getElementById("modalTag");
    var modalTitle = document.getElementById("modalTitle");
    var modalSummary = document.getElementById("modalSummary");
    var modalDetails = document.getElementById("modalDetails");
    var modalCloseBtn = modal ? modal.querySelector("[data-close]") : null;
    var lastFocus = null;
    var modalOpen = false;

    function svgBanner(label) {
        return (
            '<svg viewBox="0 0 400 130" role="img" aria-label="' + label + ' illustration" preserveAspectRatio="xMidYMid slice">' +
            '<defs><linearGradient id="gModal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14203c"/><stop offset="1" stop-color="#0b1426"/></linearGradient></defs>' +
            '<rect width="400" height="130" fill="url(#gModal)"/>' +
            '<g stroke="#38bdf8" stroke-opacity="0.5" fill="none" stroke-width="2"><rect x="150" y="42" width="60" height="44"/><rect x="220" y="52" width="36" height="28"/></g>' +
            '<text x="250" y="112" text-anchor="end" fill="#7dd3fc" font-family="JetBrains Mono, monospace" font-size="13">' + label + '</text>' +
            '</svg>'
        );
    }

    function block(title, innerHtml) {
        return '<div class="m-block"><h4>' + title + '</h4>' + innerHtml + '</div>';
    }

    function renderModal(id) {
        var p = PROJECTS[id];
        if (!p) return;

        /* Media: video for demos, real image or banner for applied use cases */
        if (p.video) {
            modalMedia.innerHTML =
                '<video controls playsinline preload="metadata" poster="' +
                p.video.poster +
                '" aria-label="Project demo video">' +
                '<source src="' + p.video.src + '" type="video/mp4">' +
                "</video>";
        } else if (p.img) {
            modalMedia.innerHTML =
                '<img src="' + p.img + '" alt="' + p.title + '" loading="lazy" decoding="async">';
        } else {
            modalMedia.innerHTML = svgBanner(p.title);
        }

        modalTag.textContent = p.tag;
        modalTitle.textContent = p.title;
        modalSummary.textContent = p.summary;

        var html = "";

        html += block("Business Problem", "<p>" + p.business + "</p>");
        html += block("CV Problem", "<p>" + p.cv + "</p>");

        if (p.pipeline && p.pipeline.length) {
            var steps = p.pipeline.map(function (s) { return "<li>" + s + "</li>"; }).join("");
            html += block("Pipeline", '<ul class="m-pipe">' + steps + "</ul>");
        }

        html += block("Approach &amp; Model", "<p>" + p.approach + "</p>");
        html += block("Dataset &amp; Annotation", "<p>" + p.dataset + "</p>");

        if (p.challenges && p.challenges.length) {
            var ch = p.challenges.map(function (c) { return "<li>" + c + "</li>"; }).join("");
            html += block("Technical Challenges", '<ul class="m-chips">' + ch + "</ul>");
        }

        if (Array.isArray(p.contribution)) {
            var contribs = p.contribution.map(function (c) { return "<li>" + c + "</li>"; }).join("");
            html += block("What I Worked On", '<ul class="m-list">' + contribs + "</ul>");
        } else if (p.contribution) {
            html += block("What I Worked On", "<p>" + p.contribution + "</p>");
        }

        if (p.tech && p.tech.length) {
            var techs = p.tech.map(function (t) { return '<li class="hl">' + t + "</li>"; }).join("");
            html += block("Technologies", '<ul class="m-chips">' + techs + "</ul>");
        }

        html += block("Results", "<p>" + p.results + "</p>");

        if (p.link) {
            html +=
                '<div class="m-block"><a class="btn btn-ghost" href="' +
                p.link.url +
                '" target="_blank" rel="noopener">' +
                p.link.label +
                ' <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></div>';
        }

        modalDetails.innerHTML = html;
    }

    function trapFocus(e) {
        if (!modalOpen) return;
        if (e.key !== "Tab") return;
        var focusables = modal.querySelectorAll('a[href], button, video, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first || document.activeElement === modal) {
                e.preventDefault();
                last.focus();
            }
        } else if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function openModal(id) {
        lastFocus = document.activeElement;
        renderModal(id);
        modal.hidden = false;
        modalOpen = true;
        document.body.classList.add("no-scroll");
        if (modalCloseBtn) modalCloseBtn.focus();
    }

    function closeModal() {
        if (!modalOpen) return;
        modalOpen = false;
        /* Pause + unload video so nothing keeps streaming */
        var video = modalMedia && modalMedia.querySelector("video");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }
        modalMedia.innerHTML = "";
        modal.hidden = true;
        document.body.classList.remove("no-scroll");
        if (lastFocus) lastFocus.focus();
    }

    document.addEventListener("keydown", function (e) {
        if (!modalOpen) return;
        if (e.key === "Escape") {
            closeModal();
        } else if (e.key === "Tab") {
            trapFocus(e);
        }
    });

    if (modal && modalCloseBtn) {
        modal.querySelectorAll("[data-close]").forEach(function (el) {
            el.addEventListener("click", function (e) {
                if (e.target === el) closeModal();
            });
        });
    }

    /* ---------- Card click / keyboard ---------- */
    document.addEventListener("click", function (e) {
        var card = e.target.closest(".p-card");
        if (card && card.dataset.id) openModal(card.dataset.id);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var card = e.target.closest ? e.target.closest(".p-card") : null;
        if (card && card.dataset.id) {
            e.preventDefault();
            openModal(card.dataset.id);
        }
    });

    /* ---------- Body scroll lock class ---------- */
    if (!document.querySelector("style[data-scrolllock]")) {
        var styleEl = document.createElement("style");
        styleEl.setAttribute("data-scrolllock", "");
        styleEl.textContent = "body.no-scroll { overflow: hidden; }";
        document.head.appendChild(styleEl);
    }
})();