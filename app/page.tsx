"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Bell, 
  Search, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  PlayCircle,
  MessageSquare,
  UploadCloud,
  Plus,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// Simulated Data for preview
const STATS = [
  { label: "Active Students", value: "2,845", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
  { label: "Total Courses", value: "48", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-100" },
  { label: "Completion Rate", value: "76%", icon: GraduationCap, color: "text-green-500", bg: "bg-green-100" },
];

const COURSES = [
  { id: 1, title: "Cloudflare Workers Masterclass", category: "Edge Computing", progress: 85, students: 1204, image: "https://picsum.photos/seed/cfw/400/250" },
  { id: 2, title: "Next.js & React Architecture", category: "Frontend", progress: 40, students: 850, image: "https://picsum.photos/seed/next/400/250" },
  { id: 3, title: "Zero Trust Security Fundamentals", category: "Security", progress: 10, students: 2300, image: "https://picsum.photos/seed/zt/400/250" },
];

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, manage, chat

  // Responsive sidebar handling
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const requestNotifications = async () => {
    // Simulated FCM request
    alert("Requesting Push Notifications via Firebase Cloud Messaging (FCM)...");
    setNotificationsEnabled(true);
  };

  const renderContent = () => {
    if (activeTab === "manage") return <ManageCoursesView />;
    if (activeTab === "chat") return <ChatView />;
    return <DashboardView />;
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 flex flex-col"
          >
            <div className="p-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">CF-LMS</span>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
              <SidebarItem icon={BookOpen} label="My Courses" active={activeTab === "my_courses"} onClick={() => setActiveTab("my_courses")} />
              <SidebarItem icon={Plus} label="Manage Courses" active={activeTab === "manage"} onClick={() => setActiveTab("manage")} />
              <SidebarItem icon={MessageSquare} label="Community Chat" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
              <SidebarItem icon={Settings} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
            </div>

            <div className="p-4 border-t border-slate-100">
              <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:bg-slate-100 rounded-md transition-colors text-sm">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold hidden md:block text-slate-900">Admin Overview</h1>
            <span className="hidden md:inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-mono">prod-edge-v2.1</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none outline-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-orange-500 text-slate-700 placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-3">
              {/* FCM Notifications Trigger */}
              <button 
                onClick={requestNotifications}
                className={`p-2 rounded-full transition-colors relative ${notificationsEnabled ? 'text-orange-600 bg-orange-50' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Enable FCM Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationsEnabled && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Zero Trust Profile Badge */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-bold text-slate-900">Admin User</div>
                  <div className="text-[10px] text-orange-600 font-medium uppercase tracking-wider">Zero Trust Verified</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 text-sm">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Dashboard View
// --------------------------------------------------------
function DashboardView() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Welcome back, Admin!</h1>
        <p className="text-sm text-slate-500 mt-1">Here is what is happening with your learning platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start mb-2">
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Active Courses</h2>
          <button className="px-4 py-1.5 bg-slate-900 text-white text-xs rounded-md font-medium">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <motion.div 
              whileHover={{ y: -2 }}
              key={course.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer group transition-shadow hover:shadow-md"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={course.image} 
                  alt={course.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
                  {course.category}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col border-t border-slate-100">
                <h3 className="font-semibold text-slate-900 text-base leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {course.title}
                </h3>
                
                <div className="mt-auto pt-3 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.students} Enrolled</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">Progress</span>
                      <span className="text-orange-600">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Status / Cloudflare Architecture Note */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col mt-8">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-900">
          <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
          Cloudflare Architecture Status
        </h3>
        <div className="relative z-10 text-slate-600">
          <p className="text-sm max-w-3xl mb-4 leading-relaxed">
            This LMS dashboard is deployed on <strong>Cloudflare Workers with Assets</strong>. 
            Data is served from <strong className="text-slate-800">Cloudflare D1</strong> at the edge, media from <strong className="text-slate-800">R2</strong>, 
            and user access is protected by <strong className="text-slate-800">Cloudflare Zero Trust</strong>. Notifications 
            are routed through <strong className="text-slate-800">Firebase Cloud Messaging (FCM)</strong>.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge>D1 SQLite Database</Badge>
            <Badge>R2 Object Storage</Badge>
            <Badge>Workers KV</Badge>
            <Badge>Firebase FCM</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Course Management View (Admin/Instructor)
// --------------------------------------------------------
function ManageCoursesView() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Course Management</h2>
          <p className="text-sm text-slate-500">Create courses, structure modules, and upload materials to Cloudflare R2.</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-semibold text-slate-900">Cloudflare Workers Masterclass</h3>
          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">PUBLISHED</span>
        </div>
        
        <div className="p-5">
          <div className="space-y-4">
            {/* Module 1 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="font-medium text-sm text-slate-900">Module 1: Introduction to The Edge</span>
                <button className="text-xs text-orange-600 font-medium hover:underline">Add Lesson</button>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">1.1 What is Edge Computing?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">12:45</span>
                    <button className="text-slate-400 hover:text-slate-600"><Settings className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">1.2 Setting up Wrangler</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Read</span>
                    <button className="text-slate-400 hover:text-slate-600"><Settings className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add New Module
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-orange-600" /> Upload Materials to Cloudflare R2
          </h4>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700">Drag & drop files here</p>
            <p className="text-xs text-slate-500 mt-1">PDF, MP4, or ZIP up to 500MB</p>
            <button className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors">
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Real-Time Chat View (Durable Objects)
// --------------------------------------------------------
function ChatView() {
  const [messages, setMessages] = useState([
    { id: 1, user: "Jane Doe", text: "Has anyone figured out the issue with D1 bindings?", time: "10:24 AM" },
    { id: 2, user: "Admin User", text: "Yes! Make sure your wrangler.toml preview ID matches.", time: "10:26 AM", isMe: true },
    { id: 3, user: "John Smith", text: "Awesome, that fixed it. Thanks!", time: "10:30 AM" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      user: "Admin User", 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      isMe: true 
    }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" /> General Discussion
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Powered by Cloudflare Durable Objects + WebSockets</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-slate-600">32 Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-700">{msg.user}</span>
              <span className="text-[10px] text-slate-400">{msg.time}</span>
            </div>
            <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
              msg.isMe 
                ? 'bg-orange-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <form onSubmit={sendMessage} className="flex items-center gap-3 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <PlayCircle className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Helpers
// --------------------------------------------------------

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors font-medium text-sm ${
        active 
          ? "bg-orange-50 text-orange-600" 
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      {children}
    </span>
  );
}

