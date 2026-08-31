// Resume data for VishalRavi's Portfolio OS
window.PORTFOLIO_DATA = {
  user: {
    name: "Vishal Ravi Muthaiah",
    handle: "vishal",
    title: "Data Scientist & ML Engineer",
    location: "Buffalo, NY",
    email: "mvishalravi@gmail.com",
    // Masked on purpose — the real number is deliberately not in this file,
    // since anything here ships to the browser and is readable via view-source.
    phone: "(***) 235-9*4*",
    github: "https://github.com/VishalRavi12",
    linkedin: "https://www.linkedin.com/in/vishal-ravi-m-8b537a204/",
    tagline: "Building intelligent systems with deep learning, RL, and ML at scale.",
    // One string per paragraph — no hard wrapping, so the UI can reflow the
    // text to whatever width it is given.
    bio: [
      "I'm a Master's student in Data Science at the University at Buffalo, SUNY, with prior experience as a Software Engineer at L&T Technology Services and ML internships at Bosch Global Software Technologies and Neuberg-Anand Diagnostic Laboratory.",
      "My work spans Multi-Agent Reinforcement Learning, Medical Imaging, Computer Vision, and full-stack ML deployment. I enjoy taking research-grade models and shipping them behind real APIs, dashboards and interfaces.",
      "Currently exploring cooperative RL, recommender systems, and Responsible AI tooling.",
    ],
  },

  education: [
    {
      school: "University at Buffalo, SUNY",
      location: "Buffalo, NY",
      degree: "Master of Science in Data Science",
      period: "Present",
      highlights: [
        "Advanced ML, Deep Learning, Reinforcement Learning",
        "Probabilistic Modeling and Statistical Inference",
      ],
    },
    {
      school: "Dayananda Sagar College of Engineering",
      location: "Bengaluru, India",
      degree: "Bachelor of Engineering in Computer Science",
      period: "Graduated",
      highlights: [
        "Best Innovative Project — Project Open Day",
        "Published research in IJFMR",
      ],
    },
  ],

  experience: [
    {
      company: "L&T Technology Services",
      // A `logo` path renders the real image. Drop a file in assets/ and add
      // the path here; without it the entry falls back to a drop-slot.
      logo: "assets/LTTS.png",
      logoSlotId: "logo-lt",
      logoPlaceholder: "drop logo",
      role: "Software Engineer",
      location: "Bengaluru, India",
      period: "Jun 2024 – Jul 2025",
      bullets: [
        "Designed RESTful backend services in Python (Flask) and Node.js with MongoDB and SQL, handling structured product data across hundreds of part combinations.",
        "Built a real-time Socket.io chat platform with group messaging and notifications, adopted by 100+ users and cutting cross-team response latency to under 200ms in production.",
        "Developed ML models for anomaly detection and predictive maintenance on sensor data, improving failure prediction accuracy by 35% over the existing rule-based system.",
        "Presented bi-weekly updates to engineering leadership, translating model metrics into business impact to shape the division's AI roadmap.",
      ],
      stack: ["Python", "Flask", "Node.js", "MongoDB", "Socket.io", "ML"],
    },
    {
      company: "Bosch Global Software Technologies",
      logo: "assets/bosch.jpg",
      logoSlotId: "logo-bosch",
      logoPlaceholder: "drop logo",
      role: "Data Science Intern",
      location: "Bengaluru, India",
      period: "Aug 2023 – Jun 2024",
      bullets: [
        "Built a Responsible AI monitoring dashboard tracking model drift, fairness metrics, and inference latency across production ML models.",
        "Connected NLP and ML monitoring APIs to Power BI reporting, cutting stakeholder decision turnaround by ~25%.",
        "Translated analytical findings into recommendations for technical and non-technical audiences.",
      ],
      stack: ["Python", "Power BI", "NLP", "Responsible AI"],
    },
    {
      company: "Neuberg-Anand Diagnostic Laboratory",
      logo: "assets/anandlab.jpeg",
      logoSlotId: "logo-neuberg",
      logoPlaceholder: "drop logo",
      role: "Machine Learning Intern",
      location: "Bengaluru, India",
      period: "Sep 2023 – Feb 2024",
      bullets: [
        "Automated antibiotic susceptibility measurement using Python and TensorFlow, replacing a manual lab workflow.",
        "Improved measurement accuracy by 30% while cutting manual effort by ~60% across daily testing runs.",
        "Work was recognized with a Best Innovative Project award and later published in IJFMR.",
      ],
      stack: ["Python", "TensorFlow", "OpenCV", "YOLOv5"],
    },
  ],

  projects: [
    {
      id: "marl-recsys",
      name: "Multi-Agent RL Movie Recommendation",
      filename: "marl-recsys/",
      type: "folder",
      tags: ["QMIX", "MAPPO", "DQN", "FastAPI", "Next.js"],
      summary: "11-agent cooperative recommender system with persona-based reward shaping.",
      bullets: [
        "Built an 11-agent cooperative recommendation system using QMIX, MAPPO, and DQN with persona-based reward shaping across 5 user archetypes.",
        "MAPPO converged 13× faster than DQN and outperformed SVD-based collaborative filtering on cold-start users with no rating history while maintaining warm-start Hit@10 parity.",
        "Designed a mixed reward function combining preference similarity, genre relevance, and rating quality with a cooperative coverage bonus and redundancy penalty.",
        "Improved team reward by 12.6% and scaled catalog coverage 4.6× as the number of agents grew from 2 to 10.",
        "Deployed a FastAPI + Next.js interface with Borda rank fusion across all 11 agents, persona-matched onboarding, and per-movie explainability scores.",
        "Evaluated using Hit@10, NDCG@10, ILD, and paired bootstrap significance tests across 5,000 resamples.",
      ],
    },
    {
      id: "ct-scan",
      name: "CT Scan Tampering & Lesion Detection",
      filename: "ct-scan-detection/",
      type: "folder",
      tags: ["PyTorch", "EfficientNet-B0", "ResNet18", "Grad-CAM", "CUDA"],
      summary: "Deep learning for medical imaging with interpretability via Grad-CAM.",
      bullets: [
        "Fine-tuned EfficientNet-B0 and ResNet18 in PyTorch for binary lesion classification.",
        "Reached 0.80 validation accuracy on held-out patient scans.",
        "CUDA/cuDNN preprocessing pipeline ran roughly 5× faster than the CPU-only baseline.",
        "Applied Grad-CAM to verify the model focused on clinically relevant regions, improving interpretability and building stakeholder trust.",
      ],
    },
    {
      id: "zone-inhibition",
      name: "Zone of Inhibition Detection",
      filename: "zone-of-inhibition/",
      type: "folder",
      tags: ["YOLOv5", "OpenCV", "TensorFlow", "MySQL", "Published"],
      summary: "Automated antibiotic susceptibility testing — published in IJFMR.",
      bullets: [
        "Built an automated antibiotic susceptibility testing system using YOLOv5, OpenCV, and TensorFlow.",
        "Reached 95% accuracy on resistance classification across a curated dataset of lab plate images.",
        "Improved zone measurement accuracy by 30% through custom image preprocessing and segmentation.",
        "Trained detection models with hyperparameter tuning to handle variable lighting and plate conditions.",
        "Deployed the full ML workflow behind REST APIs with MySQL-backed storage and monitoring dashboards used by lab technicians in daily operations.",
      ],
    },
    {
      id: "nn-scratch",
      name: "Neural Network from Scratch (MNIST)",
      filename: "nn-from-scratch/",
      type: "folder",
      tags: ["NumPy", "Backprop", "MNIST", "97.85%"],
      summary: "One-hidden-layer feedforward NN in pure NumPy with hand-derived backprop.",
      bullets: [
        "Implemented a one-hidden-layer feedforward neural network in pure NumPy for binary MNIST classification (even vs. odd digits).",
        "Hand-derived backpropagation and full-batch gradient descent without any autodiff framework.",
        "Verified analytical gradients against centered finite differences in float64, achieving differences on the order of 1e-10.",
        "Debugged a float32 catastrophic cancellation issue during gradient checking.",
        "Benchmarked learning rates and hidden layer widths (64, 128, 256), reaching 97.85% test accuracy with the best configuration.",
      ],
    },
  ],

  skills: {
    "Languages": ["Python", "SQL", "Java", "C++", "C", "JavaScript", "TypeScript", "R", "HTML/CSS"],
    "ML / Generative AI": [
      "PyTorch", "TensorFlow", "Hugging Face Transformers", "Scikit-learn", "Keras",
      "OpenCV", "Prompt Engineering", "RAG", "Embeddings", "Fine-tuning", "Grad-CAM",
      "Deep Learning", "Reinforcement Learning", "Multi-Agent RL (QMIX, MAPPO)",
      "PettingZoo", "Gymnasium", "Reward Shaping", "Recommender Systems", "NLP", "Computer Vision",
    ],
    "Web & Backend": [
      "React.js", "Node.js", "Express.js", "FastAPI", "Flask", "Django",
      "REST APIs", "Socket.io",
    ],
    "Infra & Cloud": ["Docker", "Git", "CI/CD", "AWS", "Azure", "Linux", "CUDA"],
    "Data & Analytics": [
      "Pandas", "NumPy", "MongoDB", "MySQL", "PostgreSQL", "Power BI",
      "Tableau", "Matplotlib", "Seaborn", "Jupyter", "Excel",
    ],
  },

  achievements: [
    {
      title: "Published — Inhibition Zones: A Window into Antibiotic Resistance",
      org: "International Journal for Multidisciplinary Research (IJFMR)",
      year: "2024",
      type: "Publication",
      detail: "Co-authored research paper on automated antibiotic susceptibility testing using deep learning.",
    },
    {
      title: "Best Innovative Project",
      org: "Project Open Day, Dayananda Sagar College of Engineering",
      year: "2024",
      type: "Award",
      detail: "Recognized for the Zone of Inhibition Detection project — an end-to-end ML system used by lab technicians.",
    },
  ],

  links: {
    github: "https://github.com/VishalRavi12",
    linkedin: "https://www.linkedin.com/in/vishal-ravi-m-8b537a204/",
    email: "mailto:mvishalravi@gmail.com",
    resume: "assets/Vishal_Ravi_Muthaiah_Resume.pdf",
  },
};
