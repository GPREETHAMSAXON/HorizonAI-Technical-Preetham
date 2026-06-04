import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebGLBackground from './WebGLBackground';

// --- DEEP LINKEDIN-STYLE EXTRACTED DATA ---
const TRAJECTORIES = [
    {
        id: 1,
        name: "The Direct Route",
        prevalence: "42%",
        nodes: ["CS Student", "Junior Developer", "ML Engineer"],
        color: "from-sky-400 to-blue-600",
        analysis: {
            insight: "This looks like the standard path, but our data reveals massive survivorship bias. Most who attempt this without heavy external portfolio work get bottlenecked at the Junior Dev stage.",
            risk: "High automation displacement risk for generic Junior Devs. Requires immediate upskilling in distributed systems (Ray, Spark) to successfully jump to ML.",
        },
        profiles: [
            {
                id: "p1", name: "Alex K.", current: "ML Engineer @ Stripe", avatar: "AK",
                bio: "Transitioned from core backend to ML infrastructure by optimizing Stripe's fraud detection pipelines.",
                timeline: [
                    { role: "Junior Backend Eng", company: "Stripe", duration: "1.5 yrs", detail: "Maintained Ruby on Rails monolith. Felt stuck. Started contributing to Python microservices in free time." },
                    { role: "ML Ops Transfer", company: "Stripe", duration: "2 yrs", detail: "Internal pivot. Learned Docker, Kubernetes, and model deployment. Bridged the gap between Data Scientists and SWEs." },
                    { role: "ML Engineer", company: "Stripe", duration: "Current", detail: "Now writing PyTorch training loops and optimizing inference latency." }
                ]
            },
            {
                id: "p2", name: "Sarah J.", current: "Applied Scientist @ Amazon", avatar: "SJ",
                bio: "Skipped the traditional ML PhD requirement by mastering big data pipelines early.",
                timeline: [
                    { role: "Data Engineer", company: "Zillow", duration: "1 yr", detail: "Built ETL pipelines in Airflow. Realized data engineering was the secret backdoor to ML roles." },
                    { role: "Applied Scientist", company: "Amazon", duration: "Current", detail: "Leveraged her data pipeline skills to get hired into the Alexa speech recognition team." }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "The Breakthrough",
        prevalence: "35%",
        nodes: ["CS Student", "Stuck", "Junior Developer", "ML Engineer"],
        color: "from-indigo-400 to-purple-600",
        analysis: {
            insight: "The most common reality for non-target schools. The 'Stuck' phase usually lasts 8-14 months post-graduation. The breakthrough almost always comes from lateral networking, not blind applying.",
            risk: "Attrition is highest here. 60% of people in the 'Stuck' node pivot to unrelated fields. The defining factor for those who make it is contributing to open-source ML infrastructure.",
        },
        profiles: [
            {
                id: "p3", name: "Priya M.", current: "Senior ML Eng @ HuggingFace", avatar: "PM",
                bio: "Fought through a year of unemployment by building open-source NLP projects.",
                timeline: [
                    { role: "Unemployed / Self-Taught", company: "N/A", duration: "1 yr", detail: "Rejected from 200+ roles. Stopped applying and started building a custom LLM fine-tuning library." },
                    { role: "Junior Python Dev", company: "Mid-size Agency", duration: "2 yrs", detail: "Took a lower-paying job just to get professional Python code on her resume. Kept building ML side projects." },
                    { role: "Senior ML Eng", company: "HuggingFace", duration: "Current", detail: "Hired directly because her open-source repo went viral on GitHub." }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "The Late Bloomer",
        prevalence: "23%",
        nodes: ["Procrastinator", "CS Student", "Junior Developer", "ML Engineer"],
        color: "from-emerald-400 to-teal-600",
        analysis: {
            insight: "Characterized by early academic friction followed by hyper-focus. These individuals usually have lower baseline GPAs but vastly outperform in practical, unstructured environments like startups.",
            risk: "Slower overall trajectory. Usually requires joining an early-stage startup as a generalist SWE before specializing in ML as the company scales.",
        },
        profiles: [
            {
                id: "p4", name: "Marcus T.", current: "Founding Eng @ Stealth AI", avatar: "MT",
                bio: "Barely graduated, but thrived in the chaos of early-stage Y-Combinator startups.",
                timeline: [
                    { role: "Academic Probation", company: "University", duration: "1 yr", detail: "Failed Data Structures twice. Almost dropped out. Discovered a passion for hackathons." },
                    { role: "Fullstack Dev", company: "YC Startup", duration: "3 yrs", detail: "Wore every hat. React, Node, Postgres. When the company needed an AI feature, he volunteered." },
                    { role: "Founding ML Eng", company: "Stealth", duration: "Current", detail: "Leveraged his full-stack ability to build end-to-end RAG systems." }
                ]
            }
        ]
    }
];

const MarketTrajectories = ({ onContinue }) => {
    const [selectedPath, setSelectedPath] = useState(null);
    const [activeProfile, setActiveProfile] = useState(null);

    const handleSelectPath = (path) => {
        setSelectedPath(path);
        setActiveProfile(null); // Reset profile when switching paths
    };

    return (
        <div className="fixed inset-0 z-50 w-full min-h-screen text-white overflow-hidden flex flex-col items-center justify-center p-4 md:p-12">
            <WebGLBackground progress={100} isSimulating={false} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-7xl h-[90vh] bg-[#0a0a0c]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_100px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
            >
                {/* macOS Top Bar */}
                <div className="w-full h-12 bg-white/[0.02] border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
                    </div>
                    <div className="text-xs font-mono text-white/40 tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        LIVE DATA INGESTION // LINKEDIN API
                    </div>
                    <div className="w-12"></div> {/* Spacer for centering */}
                </div>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">

                    {/* COLUMN 1: The Macro Patterns */}
                    <div className={`w-full ${selectedPath ? 'md:w-1/3 border-r border-white/10' : 'md:w-full'} p-8 overflow-y-auto transition-all duration-500 flex flex-col`}>

                        <AnimatePresence mode="wait">
                            {!selectedPath && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-10">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-4">
                                        Extracted Reality.
                                    </h1>
                                    <p className="text-gray-400 font-light text-lg max-w-2xl">
                                        We scraped 500 profiles of people who actually made it to ML Engineer. Select a cluster below to view the quantitative analysis and reverse-engineer their exact resumes.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            {TRAJECTORIES.map((path) => (
                                <button
                                    key={path.id}
                                    onClick={() => handleSelectPath(path)}
                                    className={`w-full text-left bg-white/[0.02] border ${selectedPath?.id === path.id ? 'border-sky-500/50 bg-sky-900/10' : 'border-white/5'} rounded-xl p-5 hover:bg-white/[0.06] transition-all relative overflow-hidden group`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">{path.name}</h3>
                                        <span className="text-sky-400 font-mono text-xs border border-sky-500/30 px-2 py-1 rounded bg-sky-500/10">{path.prevalence}</span>
                                    </div>

                                    <div className="flex items-center gap-2 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity flex-wrap">
                                        {path.nodes.map((node, idx) => (
                                            <React.Fragment key={idx}>
                                                <span className="text-[10px] font-mono whitespace-nowrap bg-black/50 px-2 py-1 rounded-sm">{node}</span>
                                                {idx < path.nodes.length - 1 && <span className="text-sky-400/50 text-[10px]">→</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto pt-8">
                            <button onClick={onContinue} className="w-full relative overflow-hidden px-6 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform duration-300 rounded-lg">
                                <div className="absolute inset-0 bg-sky-400 translate-y-[100%] hover:translate-y-[0%] transition-transform duration-300 ease-in-out"></div>
                                <span className="relative z-10 transition-colors duration-300">Run Digital Twin Simulator</span>
                            </button>
                        </div>
                    </div>

                    {/* COLUMN 2: Claude Analysis & Profiles (Only shows when a path is selected) */}
                    <AnimatePresence>
                        {selectedPath && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="hidden md:flex w-2/3 flex-col h-full bg-[#020204]/40"
                            >

                                {/* Top Section: The Quantitative Claude Analysis */}
                                <div className="p-8 border-b border-white/10">
                                    <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                                        {selectedPath.name}
                                        <span className="text-xs font-mono font-normal text-purple-400 border border-purple-400/30 px-2 py-1 rounded-full bg-purple-400/10">
                                            AI Analysis Complete
                                        </span>
                                    </h2>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-blue-950/20 border border-blue-500/20 p-5 rounded-xl">
                                            <h4 className="text-blue-300 font-bold mb-2 text-sm uppercase tracking-wider">Survivorship Reality</h4>
                                            <p className="text-gray-300 text-sm leading-relaxed">{selectedPath.analysis.insight}</p>
                                        </div>
                                        <div className="bg-red-950/20 border border-red-500/20 p-5 rounded-xl">
                                            <h4 className="text-red-300 font-bold mb-2 text-sm uppercase tracking-wider">Displacement Risk</h4>
                                            <p className="text-gray-300 text-sm leading-relaxed">{selectedPath.analysis.risk}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section: The LinkedIn Profile Explorer */}
                                <div className="p-8 flex-grow overflow-y-auto">
                                    <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-white/50">Verified Profiles in this Cluster</h4>

                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedPath.profiles.map((profile) => (
                                            <div key={profile.id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">

                                                {/* Profile Header (Clickable) */}
                                                <div
                                                    onClick={() => setActiveProfile(activeProfile === profile.id ? null : profile.id)}
                                                    className="p-5 flex items-center gap-4 cursor-pointer hover:bg-white/[0.05] transition-colors"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg">
                                                        {profile.avatar}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h5 className="font-bold text-lg text-white">{profile.name}</h5>
                                                        <p className="text-sm font-mono text-sky-400">{profile.current}</p>
                                                    </div>
                                                    <div className="text-white/30 text-sm">
                                                        {activeProfile === profile.id ? 'Collapse View' : 'View Full Timeline'}
                                                    </div>
                                                </div>

                                                {/* Expanded Timeline View (The actual career history) */}
                                                <AnimatePresence>
                                                    {activeProfile === profile.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="border-t border-white/5 bg-black/40 p-6 overflow-hidden"
                                                        >
                                                            <p className="text-gray-300 text-sm italic mb-6">"{profile.bio}"</p>
                                                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">

                                                                {profile.timeline.map((event, idx) => (
                                                                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                                        {/* Timeline Dot */}
                                                                        <div className="flex items-center justify-center w-3 h-3 rounded-full border border-sky-500 bg-[#020204] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>

                                                                        {/* Timeline Content */}
                                                                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white/[0.03] border border-white/10 p-4 rounded-xl">
                                                                            <div className="flex justify-between items-start mb-1">
                                                                                <h6 className="font-bold text-white text-sm">{event.role}</h6>
                                                                                <span className="text-[10px] font-mono text-sky-400 bg-sky-900/30 px-2 py-0.5 rounded">{event.duration}</span>
                                                                            </div>
                                                                            <div className="text-xs text-white/50 mb-2">{event.company}</div>
                                                                            <p className="text-xs text-gray-400 leading-relaxed">{event.detail}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </motion.div>
        </div>
    );
};

export default MarketTrajectories;