export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export const dictionaries = {
  fa: {
    locale: "fa" as Locale,
    dir: "rtl" as "rtl" | "ltr",
    nav: {
      home: "خانه",
      about: "درباره ما",
      services: "خدمات",
      portfolio: "نمونه‌کارها",
      contact: "تماس با ما",
      cta: "مشاوره رایگان",
      store: "فروشگاه‌ساز",
      goldApp: "اپ طلا و جواهر     ",
    },
    hero: {
      eyebrow: "شرکت دانش‌بنیان توسعه نرم‌افزار",
      title: "طراحی سایت و نرم‌افزار سازمانی، حرفه‌ای و نتیجه‌محور",
      subtitle:
        "بیش از ۱۵ سال تجربه در طراحی وب‌سایت، پرتال‌های سازمانی، فروشگاه اینترنتی و نرم‌افزارهای تحت وب برای کسب‌وکارها، نهادهای دولتی و صنایع بزرگ کشور.",
      ctaPrimary: "درخواست مشاوره رایگان",
      ctaSecondary: "مشاهده نمونه‌کارها",
      trustBadge: "دارای تاییدیه دانش‌بنیان از معاونت علمی و فناوری ریاست‌جمهوری",
    },
    stats: {
      clients: "مشتری",
      projects: "پروژه انجام‌شده",
      years: "سال سابقه فعالیت",
      awards: "جایزه و تقدیرنامه",
    },
    services: {
      eyebrow: "خدمات",
      title: "چطور می‌توانیم کمک کنیم؟",
      subtitle:
        "از طراحی وب‌سایت شرکتی گرفته تا سامانه‌های سازمانی پیچیده و راهکارهای هوش مصنوعی.",
      items: [
        {
          title: "طراحی وب‌سایت و پرتال سازمانی",
          desc: "طراحی مدرن، واکنش‌گرا و سئو-محور، متناسب با هویت برند و نیاز کسب‌وکار شما.",
        },
        {
          title: "نرم‌افزارهای تحت وب و سازمانی",
          desc: "توسعه سامانه‌های مدیریت فرآیند، داشبورد مدیریتی و اتوماسیون اداری با فناوری‌های روز.",
        },
        {
          title: "فروشگاه اینترنتی و تجارت الکترونیک",
          desc: "راه‌اندازی فروشگاه آنلاین اختصاصی با درگاه پرداخت امن و تجربه خرید روان.",
        },
        {
          title: "سئو و افزایش رتبه در گوگل",
          desc: "بهینه‌سازی فنی، محتوایی و ساختاری برای دیده‌شدن در نتایج جستجو و جذب مشتری واقعی.",
        },
        {
          title: "DevOps و زیرساخت ابری",
          desc: "استقرار، مانیتورینگ و مقیاس‌پذیری زیرساخت روی AWS، Azure و سرورهای اختصاصی.",
        },
        {
          title: "راهکارهای مبتنی بر هوش مصنوعی",
          desc: "اتوماسیون فروش و بازاریابی، چت‌بات هوشمند و تحلیل داده با آخرین ابزارهای AI.",
        },
      ],
    },
   process: {
  eyebrow: "فرآیند توسعه ما",
  title: "از ایده تا اجرا، قدم به قدم",
  subtitle: "یک متدولوژی اثبات‌شده ۷ مرحله‌ای که ایده شما را به یک راهکار نرم‌افزاری قدرتمند تبدیل می‌کند",
  finalLabel: "پروژه تحویل داده شد",
  finalDesc: "محصول شما با موفقیت راه‌اندازی و در حال اجراست",
  ctaLabel: "پروژه خود را شروع کنید",
  steps: [
    {
      title: "مشاوره و کشف نیازها",
      duration: "۱ تا ۲ هفته",
      desc: "با جلسات مشاوره تخصصی، عمیقاً وارد اهداف کسب‌وکار، چالش‌ها و چشم‌انداز شما می‌شویم تا نیازهای شما را کاملاً درک کنیم.",
      deliverables: [
        "تحلیل نیازمندی‌های کسب‌وکار",
        "مصاحبه با ذینفعان پروژه",
        "مطالعه امکان‌سنجی پروژه",
      ],
    },
    {
      title: "ارائه پروپوزال و برنامه‌ریزی",
      duration: "۱ هفته",
      desc: "یک پروپوزال جامع شامل محدوده پروژه، زمان‌بندی، استک تکنولوژی و برآورد دقیق هزینه‌ها متناسب با نیازهای شما ارائه می‌شود.",
      deliverables: [
        "سند پروپوزال فنی",
        "نقشه راه و زمان‌بندی پروژه",
        "برآورد هزینه و منابع",
      ],
    },
    {
      title: "طراحی رابط و تجربه کاربری",
      duration: "۲ تا ۳ هفته",
      desc: "خلق وایرفریم‌های زیبا، پروتوتایپ‌های تعاملی و طراحی‌های دقیق که تجربه کاربری استثنایی را ارائه می‌دهند.",
      deliverables: [
        "وایرفریم و جریان کاربری",
        "پروتوتایپ تعاملی",
        "سیستم طراحی نهایی",
      ],
    },
    {
      title: "توسعه و کدنویسی",
      duration: "۴ تا ۱۲ هفته",
      desc: "توسعه‌دهندگان متخصص ما با استفاده از تکنولوژی‌های روز و اصول کدنویسی تمیز، طراحی‌ها را به واقعیت تبدیل می‌کنند.",
      deliverables: [
        "توسعه فرانت‌اند و بک‌اند",
        "معماری پایگاه داده",
        "توسعه و یکپارچه‌سازی API",
      ],
    },
    {
      title: "تست و تضمین کیفیت",
      duration: "۱ تا ۲ هفته",
      desc: "تست‌های دقیق در محیط‌های مختلف برای اطمینان از عملکرد بی‌نقص، امنیت بالا و کارایی نرم‌افزار در هر شرایطی.",
      deliverables: [
        "تست واحد و یکپارچگی",
        "ممیزی عملکرد و امنیت",
        "تست پذیرش کاربر",
      ],
    },
    {
      title: "استقرار و راه‌اندازی",
      duration: "۳ تا ۵ روز",
      desc: "استقرار بی‌وقفه روی سرورهای عملیاتی بدون قطعی، تا اطمینان حاصل شود نرم‌افزار شما با موفقیت راه‌اندازی می‌شود.",
      deliverables: [
        "راه‌اندازی سرورهای عملیاتی",
        "پیکربندی CI/CD",
        "راه‌اندازی و مانیتورینگ",
      ],
    },
    {
      title: "پشتیبانی و نگهداری",
      duration: "مستمر",
      desc: "پشتیبانی مداوم، به‌روزرسانی‌های منظم و نگهداری فعالانه برای اطمینان از اجرای همیشگی نرم‌افزار با بهترین عملکرد.",
      deliverables: [
        "پشتیبانی فنی ۲۴/۷",
        "به‌روزرسانی و پچ‌های منظم",
        "مانیتورینگ عملکرد",
      ],
    },
  ],
},
    portfolio: {
      eyebrow: "نمونه‌کارها",
      title: "پروژه‌هایی که ساخته‌ایم",
      subtitle: "بخشی از سامانه‌ها، پرتال‌ها و وب‌سایت‌هایی که برای مشتریان طراحی و اجرا کرده‌ایم.",
      viewAll: "مشاهده همه نمونه‌کارها",
      viewProject: "مشاهده پروژه",
      empty: "به‌زودی نمونه‌کارهای بیشتری اضافه می‌شود.",
      backToAll: "بازگشت به همه نمونه‌کارها",
      client: "کارفرما",
      year: "سال اجرا",
      category: "دسته‌بندی",
      technologies: "فناوری‌های استفاده‌شده",
      liveLink: "مشاهده سایت",
   
  backToPortfolio: "بازگشت به نمونه‌کارها",
  responsivePreview: "نمای ریسپانسیو",
  responsiveTitle: "در هر صفحه نمایشی زیباست",
  theChallenge: "چالش پروژه",
  ourSolution: "راه‌حل ما",
  keyFeatures: "ویژگی‌های کلیدی",
  techStack: "استک فنی",
  relatedProjects: "پروژه‌های مرتبط",
  viewLive: "مشاهده آنلاین",
    },
    clients: {
      eyebrow: "مشتریان و کارفرمایان",
      title: "مورد اعتماد سازمان‌ها و صنایع پیشرو",
    },
    testimonials: {
      eyebrow: "مشتریان می‌گویند",
      title: "چند نمونه از رضایت کارفرمایان",
    },
    contact: {
      eyebrow: "تماس با ما",
      title: "بیایید پروژه بعدی‌تان را شروع کنیم",
      subtitle: "برای مشاوره رایگان و برآورد پروژه، فرم زیر را پر کنید یا مستقیم تماس بگیرید.",
      form: {
        name: "نام و نام‌خانوادگی",
        email: "ایمیل",
        phone: "شماره تماس",
        subject: "موضوع",
        message: "توضیحات پروژه",
        submit: "ارسال پیام",
        submitting: "در حال ارسال...",
        success: "پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.",
        error: "ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید یا مستقیم تماس بگیرید.",
      },
      infoTitle: "اطلاعات تماس",
      addressLabel: "آدرس دفتر",
      hoursLabel: "ساعات کاری",
      phoneLabel: "تلفن",
      emailLabel: "ایمیل",
    },
    footer: {
      description:
        "شرکت دانش‌بنیان پیشگامان ایده‌نگار؛ طراحی وب‌سایت، پرتال‌های سازمانی و نرم‌افزارهای تحت وب در کرمانشاه و سراسر ایران.",
      quickLinks: "دسترسی سریع",
      servicesTitle: "خدمات",
      contactTitle: "تماس",
      rights: "تمامی حقوق محفوظ است.",
      madeWith: "طراحی و توسعه توسط ایده‌نگار",
    },
    common: {
      readMore: "بیشتر بخوانید",
      learnMore: "بیشتر بدانید",
      switchLang: "English",
      skipToContent: "رفتن به محتوای اصلی",
      callUs: "تماس تلفنی",
      whatsapp: "واتس‌اپ",
      allCategories: "همه دسته‌ها",
      notFoundTitle: "صفحه پیدا نشد",
      notFoundDesc: "صفحه‌ای که دنبالش بودید وجود ندارد یا جابه‌جا شده است.",
      backHome: "بازگشت به صفحه اصلی",
    },
  },
  en: {
    locale: "en" as Locale,
    dir: "ltr" as "rtl" | "ltr",
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      portfolio: "Portfolio",
      contact: "Contact",
      cta: "Free Consultation",
      store :"Store Builder",
           goldApp: "   Gold APP     ",
    },
    hero: {
      eyebrow: "Knowledge-Based Software Company",
      title: "Professional, Results-Driven Web & Software Development",
      subtitle:
        "15+ years of experience building websites, enterprise portals, online stores, and web software for businesses, government bodies, and major industries.",
      ctaPrimary: "Get a Free Consultation",
      ctaSecondary: "View Our Work",
      trustBadge: "Certified Knowledge-Based Company by Iran's Vice Presidency for Science & Technology",
    },
    stats: {
      clients: "Clients",
      projects: "Projects Delivered",
      years: "Years of Experience",
      awards: "Awards & Certificates",
    },
    services: {
      eyebrow: "Services",
      title: "How can we help?",
      subtitle: "From corporate websites to complex enterprise systems and AI-driven solutions.",
      items: [
        {
          title: "Website & Enterprise Portal Design",
          desc: "Modern, responsive, SEO-first design tailored to your brand and business needs.",
        },
        {
          title: "Web & Enterprise Software",
          desc: "Process management systems, management dashboards, and back-office automation built on modern stacks.",
        },
        {
          title: "E-commerce & Online Stores",
          desc: "Custom online stores with secure payment gateways and a smooth shopping experience.",
        },
        {
          title: "SEO & Google Ranking",
          desc: "Technical, content, and structural optimization to get found in search and win real customers.",
        },
        {
          title: "DevOps & Cloud Infrastructure",
          desc: "Deployment, monitoring, and scaling on AWS, Azure, and dedicated servers.",
        },
        {
          title: "AI-Powered Solutions",
          desc: "Sales & marketing automation, intelligent chatbots, and data analysis with the latest AI tools.",
        },
      ],
    },
    process: {
  eyebrow: "Our Development Process",
  title: "From idea to launch, step by step",
  subtitle: "A proven 7-step methodology that transforms your vision into powerful software solutions",
  finalLabel: "Project Delivered",
  finalDesc: "Your product is live and running successfully",
  ctaLabel: "Start Your Project",
  steps: [
    {
      title: "Discovery & Consultation",
      duration: "1-2 Weeks",
      desc: "We dive deep into your business goals, challenges, and vision through in-depth consultation sessions to fully understand your requirements.",
      deliverables: [
        "Business Requirement Analysis",
        "Stakeholder Interviews",
        "Project Feasibility Study",
      ],
    },
    {
      title: "Proposal & Planning",
      duration: "1 Week",
      desc: "A comprehensive proposal including project scope, timeline, technology stack, and detailed cost estimation tailored to your needs.",
      deliverables: [
        "Technical Proposal Document",
        "Project Roadmap & Timeline",
        "Cost & Resource Estimation",
      ],
    },
    {
      title: "UI/UX Design",
      duration: "2-3 Weeks",
      desc: "Creating stunning wireframes, interactive prototypes, and pixel-perfect designs that deliver exceptional user experiences.",
      deliverables: [
        "Wireframes & User Flows",
        "Interactive Prototypes",
        "Final UI Design System",
      ],
    },
    {
      title: "Development & Coding",
      duration: "4-12 Weeks",
      desc: "Our expert developers bring designs to life using cutting-edge technologies, following best practices and clean code principles.",
      deliverables: [
        "Frontend & Backend Development",
        "Database Architecture",
        "API Integration & Development",
      ],
    },
    {
      title: "Testing & Quality Assurance",
      duration: "1-2 Weeks",
      desc: "Rigorous testing across multiple environments to ensure your software is bug-free, secure, and performs flawlessly under any load.",
      deliverables: [
        "Unit & Integration Testing",
        "Performance & Security Audits",
        "User Acceptance Testing",
      ],
    },
    {
      title: "Deployment & Launch",
      duration: "3-5 Days",
      desc: "Seamless deployment to production servers with zero downtime, ensuring your software goes live smoothly and successfully.",
      deliverables: [
        "Production Server Setup",
        "CI/CD Pipeline Configuration",
        "Go-Live & Monitoring",
      ],
    },
    {
      title: "Support & Maintenance",
      duration: "Ongoing",
      desc: "Continuous support, regular updates, and proactive maintenance to keep your software running at peak performance always.",
      deliverables: [
        "24/7 Technical Support",
        "Regular Updates & Patches",
        "Performance Monitoring",
      ],
    },
  ],
},
    portfolio: {
      eyebrow: "Portfolio",
      title: "Projects we've built",
      subtitle: "A selection of the systems, portals, and websites we've designed and delivered for our clients.",
      viewAll: "View all projects",
      viewProject: "View project",
      empty: "More case studies coming soon.",
      backToAll: "Back to all projects",
      client: "Client",
      year: "Year",
      category: "Category",
      technologies: "Technologies used",
      liveLink: "Visit website",
   
  backToPortfolio: "Back to Portfolio",
  responsivePreview: "Responsive Preview",
  theChallenge: "The Challenge",
  ourSolution: "Our Solution",
  keyFeatures: "Key Features",
  techStack: "Tech Stack",
  relatedProjects: "Related Projects",
  viewLive: "View Live",
    },
    clients: {
      eyebrow: "Clients & Partners",
      title: "Trusted by leading organizations and industries",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What our clients say",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's start your next project",
      subtitle: "Fill out the form for a free consultation and project estimate, or reach out directly.",
      form: {
        name: "Full name",
        email: "Email",
        phone: "Phone number",
        subject: "Subject",
        message: "Project details",
        submit: "Send message",
        submitting: "Sending...",
        success: "Your message has been sent. We'll get back to you shortly.",
        error: "Something went wrong. Please try again or contact us directly.",
      },
      infoTitle: "Contact information",
      addressLabel: "Office address",
      hoursLabel: "Working hours",
      phoneLabel: "Phone",
      emailLabel: "Email",
    },
    footer: {
      description:
        "Idehnegar Pioneers, a certified knowledge-based company — websites, enterprise portals, and web software from Kermanshah, Iran.",
      quickLinks: "Quick Links",
      servicesTitle: "Services",
      contactTitle: "Contact",
      rights: "All rights reserved.",
      madeWith: "Designed & built by the Idehnegar team",
    },
    common: {
      readMore: "Read more",
      learnMore: "Learn more",
      switchLang: "فارسی",
      skipToContent: "Skip to content",
      callUs: "Call us",
      whatsapp: "WhatsApp",
      allCategories: "All categories",
      notFoundTitle: "Page not found",
      notFoundDesc: "The page you're looking for doesn't exist or has moved.",
      backHome: "Back to homepage",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale ];
}

export type Dictionary = (typeof dictionaries)[Locale];
