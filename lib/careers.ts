import type { ProjectField } from "./projects";

export interface CareerLink { name: string; url: string; note: string }
export interface CareerSalary {
  occupation: string; geography: string; currency: "USD"; period: string;
  median: number; percentile10: number; percentile90: number;
  source: string; sourceName: string; accessed: string; explanation: string;
}
export interface Career {
  field: ProjectField; title: string; overview: string; dayInLife: string;
  majors: string[]; courses: string[]; extracurriculars: string[];
  competitions: CareerLink[]; summerPrograms: CareerLink[];
  salary: CareerSalary; sources: CareerLink[];
}
export const careerAccessDate = "2026-10-05";
export const programAvailabilityNote = "These are opportunities to explore, not open-registration promises. Ask a parent, guardian or school counselor to check the organizer's current age/grade rules, prerequisites, dates, location, cost and financial aid. Summer 2026 has ended; check for the next announced session. Local clubs, libraries and community colleges may offer lower-cost alternatives.";
export const careerGuidanceNote = "Course and activity lists are EngiQuest exploration suggestions, not admission requirements. Day-in-the-life examples are illustrative composites, not interviews. There are many routes into engineering, including technician, community-college, apprenticeship and university pathways.";
const salary = (occupation: string, median: number, percentile10: number, percentile90: number, source: string): CareerSalary => ({
  occupation, geography:"United States, national", currency:"USD", period:"May 2025 annual wages", median, percentile10, percentile90,
  source, sourceName:"U.S. Bureau of Labor Statistics, Occupational Outlook Handbook / OEWS", accessed:careerAccessDate,
  explanation:"Median means half of workers earned more and half earned less. The 10th and 90th percentile figures mark wage-distribution thresholds across workers; they are not entry-, mid- or senior-career pay promises. Pay varies by location, employer, role and experience. These occupational wages are not a salary forecast for every job in this field."
});
const scienceOlympiad: CareerLink = {name:"Science Olympiad",url:"https://www.soinc.org/participants/discover-science-olympiad",note:"School teams explore science and engineering events. Division B serves grades 6–9 and Division C grades 9–12; consult current team and event rules."};
const first: CareerLink = {name:"FIRST Tech Challenge",url:"https://www.firstinspires.org/programs/ftc/",note:"Mentored robot design and programming teams for grades 7–12. Check local team availability, costs and the current season's rules."};
const futureCity: CareerLink = {name:"Future City",url:"https://futurecity.org/",note:"Teams research and design a future city. The organizer has middle-school and high-school programs; check the relevant division and current challenge."};
const fair: CareerLink = {name:"Society for Science affiliated fairs",url:"https://www.societyforscience.org/isef/affiliated-fair-network/",note:"Find a local fair and work with a teacher on the rules before starting research. Fair eligibility and advancement routes vary; ISEF itself is a high-school competition."};
const eei: CareerLink = {name:"Johns Hopkins Explore Engineering Innovation",url:"https://ei.jhu.edu/programs/eei/",note:"College-level summer exploration across several engineering fields, including civil, electrical and mechanical. Review academic prerequisites and format-specific age rules with a counselor."};
const purdue: CareerLink = {name:"Purdue INSPIRE/SCALE summer engineering camps",url:"https://engineering.purdue.edu/INSPIRE/Workshops/summer-camps",note:"The 2026 listing included camps for students entering grades 1–9, with a grades 7–9 session. Check the next published season and whether its grade range fits you."};
const bwsi: CareerLink = {name:"MIT Beaver Works Summer Institute",url:"https://bwsi.mit.edu/",note:"Project-based STEM courses aimed at students entering their senior year of high school; topics include autonomy and electronics. Check prerequisites, selection, costs and in-person housing arrangements."};

export const careers: Career[] = [
  {
    field:"mechanical",title:"Mechanical & Aerospace",
    overview:"Explore how machines move, materials carry loads and energy changes form. Mechanical engineers develop and test devices from pumps to robots; aerospace work adds flight and space systems, with its own specialized roles.",
    dayInLife:"Illustrative day: review a test stand's vibration data, adjust a bracket in CAD, discuss manufacturing tolerances with a technician, then compare a new prototype with the team's requirements. The last task is writing down what changed and why.",
    majors:["Mechanical engineering", "Aerospace engineering", "Mechatronics", "Mechanical engineering technology"],
    courses:["Algebra, geometry and trigonometry", "Physics", "Calculus when available", "CAD, design or manufacturing", "Technical writing"],
    extracurriculars:["Keep a measured design notebook for a model vehicle", "Join a supervised robotics or maker club", "Help a school team test and improve mechanisms"],
    competitions:[first,scienceOlympiad],summerPrograms:[eei,purdue],
    salary:salary("Mechanical engineers (representative occupation)",104110,73990,164340,"https://www.bls.gov/ooh/architecture-and-engineering/mechanical-engineers.htm"),
    sources:[{name:"BLS: Mechanical engineers",url:"https://www.bls.gov/ooh/architecture-and-engineering/mechanical-engineers.htm",note:"Primary source for occupational duties, education and the displayed wage distribution. Aerospace jobs are not included in this wage figure."}]
  },
  {
    field:"civil",title:"Civil & Structural",
    overview:"Design and improve the infrastructure people rely on: bridges, buildings, roads, drainage and water systems. Civil engineers balance loads, materials, communities, budgets and maintenance; structural engineering concentrates on how structures resist forces.",
    dayInLife:"Illustrative day: visit a drainage project with appropriate site supervision, compare measurements with drawings, check a beam calculation, and meet a community representative about access during construction. Update the design notes so the next reviewer can follow every assumption.",
    majors:["Civil engineering", "Structural engineering concentration", "Environmental engineering", "Construction engineering"],
    courses:["Algebra, geometry and trigonometry", "Physics", "Earth or environmental science", "CAD and drafting", "Writing and public speaking"],
    extracurriculars:["Compare small bridge models using the same safe load", "Map school-area drainage from public paths", "Join a design club and practice explaining trade-offs"],
    competitions:[futureCity,scienceOlympiad],summerPrograms:[eei,purdue],
    salary:salary("Civil engineers",100840,68240,163220,"https://www.bls.gov/ooh/architecture-and-engineering/civil-engineers.htm"),
    sources:[{name:"BLS: Civil engineers",url:"https://www.bls.gov/ooh/architecture-and-engineering/civil-engineers.htm",note:"Primary source for occupational duties, education and the displayed wage distribution."}]
  },
  {
    field:"electrical",title:"Electrical & Electronics",
    overview:"Work with power, signals, sensors and electronic systems. Electrical engineers may design motors and power equipment; electronics engineers focus on components and circuits used in communication, measurement and control.",
    dayInLife:"Illustrative day: inspect a low-voltage sensor waveform, compare circuit simulations with bench measurements, discuss a noisy connection with a teammate, then revise the board layout and write a repeatable test procedure. Safety reviews are part of the design work.",
    majors:["Electrical engineering", "Electronics engineering", "Computer engineering", "Electrical engineering technology"],
    courses:["Algebra, trigonometry and calculus when available", "Physics", "Computer science", "Digital electronics", "Technical communication"],
    extracurriculars:["Build current-limited low-voltage paper circuits", "Join a supervised electronics or robotics club", "Use simulation software to predict and test circuit behavior"],
    competitions:[scienceOlympiad,first],summerPrograms:[bwsi,eei],
    salary:salary("Electrical engineers (not the separate electronics occupation)",120630,76550,184300,"https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm"),
    sources:[{name:"BLS: Electrical and electronics engineers",url:"https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm",note:"Primary source. This page contains two occupations; the displayed figures use electrical engineers only, not a blended salary."}]
  },
  {
    field:"robotics",title:"Robotics & Software",
    overview:"Combine software, sensing, mechanisms and feedback to make systems respond to the world. Robotics teams include software, mechanical and electrical specialists; software developers also build the applications and systems that run many devices.",
    dayInLife:"Illustrative day: reproduce a robot's missed turn in a simulator, inspect sensor logs, adjust a control rule and write a test for the edge case. After a supervised test in a clear space, compare results with teammates and document the remaining uncertainty.",
    majors:["Computer science", "Software engineering", "Robotics or mechatronics", "Computer or electrical engineering", "Mechanical engineering with controls"],
    courses:["Computer science", "Algebra, trigonometry and statistics", "Physics", "Engineering design", "Writing and teamwork-focused courses"],
    extracurriculars:["Build a small game or simulation with tests", "Join a school coding or robotics team", "Keep a log of bugs, hypotheses and fixes"],
    competitions:[first,scienceOlympiad],summerPrograms:[bwsi,purdue],
    salary:salary("Software developers (one pathway within this field)",135980,82460,214670,"https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm"),
    sources:[{name:"BLS: Software developers",url:"https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",note:"Primary source. Figures are for software developers, not the combined developer/QA group or a dedicated robotics-engineer category."}]
  },
  {
    field:"biomedical",title:"Biomedical",
    overview:"Use engineering and life science to develop tools that support health research and care. Biomedical engineers may work on devices, materials, measurements or software, collaborating with clinicians and other specialists and testing designs carefully.",
    dayInLife:"Illustrative day: review anonymized equipment test data, ask a clinical collaborator how a device is used, refine a pump component, and run a bench test with a synthetic fluid. Record risks and results for review before any design could approach real patient use.",
    majors:["Biomedical engineering", "Bioengineering", "Mechanical or electrical engineering with biomedical study", "Materials science"],
    courses:["Biology and chemistry", "Physics", "Algebra, calculus and statistics when available", "Computer science", "Ethics and technical writing"],
    extracurriculars:["Explore synthetic biosignals without connecting to a body", "Join biology, engineering or science-fair clubs", "Design accessible everyday tools using teacher-reviewed model tests"],
    competitions:[scienceOlympiad,fair],
    summerPrograms:[{name:"Johns Hopkins Biomedical Engineering Innovation",url:"https://ei.jhu.edu/programs/bmei/",note:"Online college-level program with fall, spring and summer sessions. The published prerequisites include Algebra II, trigonometry and a full year of high-school physics with a lab; review all current requirements."},bwsi],
    salary:salary("Bioengineers and biomedical engineers",109370,71850,168180,"https://www.bls.gov/ooh/architecture-and-engineering/biomedical-engineers.htm"),
    sources:[{name:"BLS: Bioengineers and biomedical engineers",url:"https://www.bls.gov/ooh/architecture-and-engineering/biomedical-engineers.htm",note:"Primary source for occupational duties, education and the displayed wage distribution."}]
  },
  {
    field:"green",title:"Green Tech & Environmental",
    overview:"Develop ways to reduce pollution, protect water and use resources more effectively. Environmental engineering overlaps with civil, chemical, mechanical and electrical work; clean-energy jobs span several occupations rather than one single career category.",
    dayInLife:"Illustrative day: compare a treatment model with laboratory results, estimate an energy system's losses, meet a community team about a proposed improvement, and update a monitoring plan. The design review considers environmental benefits alongside cost, reliability and maintenance.",
    majors:["Environmental engineering", "Civil engineering", "Chemical engineering", "Mechanical or electrical engineering with energy study", "Environmental science"],
    courses:["Chemistry and biology", "Environmental or earth science", "Physics", "Algebra, statistics and calculus when available", "Geography and public speaking"],
    extracurriculars:["Measure school energy use with an adult-approved plan", "Join an environmental or repair club", "Compare safe model filters without drinking their output"],
    competitions:[{name:"KidWind Challenge",url:"https://kidwind.org/challenges/",note:"Student teams build and test small wind turbines or solar homes. Check current categories, rules, regional events and online options."},futureCity],
    summerPrograms:[{name:"Johns Hopkins Sustainable Energy Engineering",url:"https://ei.jhu.edu/",note:"The organizer lists a summer energy-engineering program. Follow its program link for the next session's eligibility, prerequisites, formats, dates and cost."},purdue],
    salary:salary("Environmental engineers (representative occupation)",107110,69990,162220,"https://www.bls.gov/ooh/architecture-and-engineering/environmental-engineers.htm"),
    sources:[{name:"BLS: Environmental engineers",url:"https://www.bls.gov/ooh/architecture-and-engineering/environmental-engineers.htm",note:"Primary source. These wages describe environmental engineers; they do not combine all renewable-energy occupations."}]
  }
];
