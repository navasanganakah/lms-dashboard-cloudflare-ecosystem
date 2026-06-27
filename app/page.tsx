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
  Video,
  Eye,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Book,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// Stats configuration
const STAT_CONFIG = [
  { key: "students", label: "Active Students", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
  { key: "courses", label: "Total Courses", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-100" },
  { key: "completion", label: "Completion Rate", icon: GraduationCap, color: "text-green-500", bg: "bg-green-100" },
];

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, manage, chat
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("auth_token");
        }
      })
      .catch(() => setIsAuthenticated(false));
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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

  const handleLogout = () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/auth/logout", { method: "POST", headers: { "Authorization": `Bearer ${token}` } });
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (isAuthenticated === null) {
    return <div className="h-screen flex items-center justify-center text-slate-500 font-medium">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={(token, user) => {
      localStorage.setItem("auth_token", token);
      setUser(user);
      setIsAuthenticated(true);
    }} />;
  }

  const renderContent = () => {
    if (activeTab === "manage" && user?.role === 'admin') return <ManageCoursesView />;
    if (activeTab === "chat") return <ChatView user={user} />;
    if (activeTab === "catalog") return <CourseCatalogView user={user} />;
    
    if (user?.role === 'admin') return <AdminDashboardView user={user} />;
    return <StudentDashboardView user={user} />;
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
              {user?.role === 'admin' ? (
                <>
                  <SidebarItem icon={LayoutDashboard} label="Admin Overview" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                  <SidebarItem icon={Plus} label="Manage Courses" active={activeTab === "manage"} onClick={() => setActiveTab("manage")} />
                </>
              ) : (
                <>
                  <SidebarItem icon={LayoutDashboard} label="My Learning" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                  <SidebarItem icon={BookOpen} label="Course Catalog" active={activeTab === "catalog"} onClick={() => setActiveTab("catalog")} />
                </>
              )}
              <SidebarItem icon={MessageSquare} label="Community Chat" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
              <SidebarItem icon={Settings} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
            </div>

            <div className="p-4 border-t border-slate-100">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:bg-slate-100 rounded-md transition-colors text-sm">
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
            <h1 className="text-xl font-semibold hidden md:block text-slate-900">
              {activeTab === 'manage' ? 'Admin Panel' : activeTab === 'catalog' ? 'Course Catalog' : 'Overview'}
            </h1>
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

              {/* User Profile Badge */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-bold text-slate-900">{user?.name || "Admin"}</div>
                  <div className="text-[10px] text-orange-600 font-medium uppercase tracking-wider">{user?.role === 'admin' ? 'Admin Access' : 'Student'}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 text-sm">
                  {user?.name?.substring(0, 2).toUpperCase() || "AD"}
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
// Admin Dashboard View
// --------------------------------------------------------
function AdminDashboardView({ user }: { user: any }) {
  const [statsData, setStatsData] = useState<any>({ students: 0, courses: 0, completion: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<any>(null);
  
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [csvUploadMessage, setCsvUploadMessage] = useState('');

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    
    setIsUploadingCsv(true);
    setCsvUploadMessage('Parsing CSV...');
    
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error('Invalid CSV format');
        
        const headers = lines[0].split(',').map(h => h.trim());
        const userIdIndex = headers.indexOf('user_id');
        const courseIdIndex = headers.indexOf('course_id');
        const progressIndex = headers.indexOf('progress');
        
        if (userIdIndex === -1 || courseIdIndex === -1) {
          throw new Error('CSV must contain user_id and course_id columns');
        }
        
        const enrollments = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          enrollments.push({
            user_id: values[userIdIndex],
            course_id: values[courseIdIndex],
            progress: progressIndex !== -1 ? parseInt(values[progressIndex]) || 0 : 0
          });
        }
        
        setCsvUploadMessage('Uploading enrollments...');
        const token = typeof window !== 'undefined' ? localStorage.getItem('ns_session_token') : '';
        const res = await fetch('/api/enrollments/bulk', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(enrollments)
        });
        
        if (res.ok) {
          const data = await res.json();
          setCsvUploadMessage(`Successfully imported ${data.count || enrollments.length} enrollments!`);
        } else {
          setCsvUploadMessage('Failed to upload enrollments.');
        }
      } catch (err: any) {
        setCsvUploadMessage(`Error: ${err.message || 'Invalid CSV file.'}`);
      } finally {
        setIsUploadingCsv(false);
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('ns_session_token') : '';
    try {
      const res = await fetch(`/api/courses/${courseToDelete.id}`, {
        method: 'DELETE',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== courseToDelete.id));
      }
    } catch (e) {
      console.error("Failed to delete course", e);
    } finally {
      setCourseToDelete(null);
    }
  };

  const handleExport = () => {
    window.open('/api/backup', '_blank');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsRestoring(true);
        setRestoreMessage('Restoring backup...');
        const json = JSON.parse(event.target?.result as string);
        const res = await fetch('/api/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        });
        if (res.ok) {
          setRestoreMessage('Restore successful! Please refresh the page.');
        } else {
          setRestoreMessage('Failed to restore backup.');
        }
      } catch (err) {
        setRestoreMessage('Invalid backup file.');
      } finally {
        setIsRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [stats, coursesData] = await Promise.all([
        fetch('/api/stats').then(res => res.ok ? res.json() : { students: 0, courses: 0, completion: 0 }).catch(() => ({ students: 0, courses: 0, completion: 0 })),
        fetch('/api/courses').then(res => res.ok ? res.json() : []).catch(() => [])
      ]);
      setStatsData(stats);
      setCourses(coursesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Welcome back, {user?.name || "Admin"}!</h1>
          <p className="text-sm text-slate-500 mt-1">Here is what is happening with your learning platform today.</p>
        </div>
        <button 
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAT_CONFIG.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start mb-2">
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {isLoading ? "-" : (stat.key === 'completion' ? `${statsData[stat.key]}%` : statsData[stat.key])}
              </div>
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 text-sm">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
            <BookOpen className="w-8 h-8 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-900">No active courses found</p>
            <p className="text-xs text-slate-500 mt-1">Courses fetched from D1 will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div 
                whileHover={{ y: -2 }}
                key={course.id} 
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer group transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center">
                  {course.image ? (
                    <Image 
                      src={course.image} 
                      alt={course.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
                    {course.category}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCourseToDelete(course); }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-md text-red-500 hover:text-red-700 shadow-sm hover:bg-red-50 transition-colors z-10"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-4 flex-1 flex flex-col border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-base leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="mt-auto pt-3 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.students || 0} Enrolled</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700">Progress</span>
                        <span className="text-orange-600">{course.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Backup and Restore Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col mt-8">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-900">
          <Database className="w-4 h-4 text-orange-500" />
          Data Management (Cloudflare D1)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-slate-800">Backup & Restore</h4>
            <p className="text-sm text-slate-600 mb-4">
              Export your entire database schema and data as a JSON file, or restore from a previously exported backup.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON Backup
              </button>
              
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                <Upload className="w-4 h-4" />
                {isRestoring ? 'Restoring...' : 'Import JSON Backup'}
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleImport}
                  disabled={isRestoring}
                />
              </label>
            </div>
            
            {restoreMessage && (
              <div className={`mt-4 text-sm font-medium p-3 rounded-lg ${restoreMessage.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                {restoreMessage}
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2 text-slate-800">Bulk Enrollment Import</h4>
            <p className="text-sm text-slate-600 mb-4">
              Upload a CSV file containing <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">user_id,course_id,progress</code> to bulk enroll students.
            </p>
            
            <div>
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex">
                <UploadCloud className="w-4 h-4" />
                {isUploadingCsv ? 'Parsing...' : 'Upload CSV File'}
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleCsvUpload}
                  disabled={isUploadingCsv}
                />
              </label>
            </div>
            
            {csvUploadMessage && (
              <div className={`mt-4 text-sm font-medium p-3 rounded-lg ${csvUploadMessage.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-700'}`}>
                {csvUploadMessage}
              </div>
            )}
          </div>
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {courseToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Course?</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to delete <strong className="text-slate-900">{courseToDelete.title}</strong>? 
                  This will temporarily remove it from the platform. It will be permanently deleted after 7 days.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setCourseToDelete(null)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Course
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --------------------------------------------------------
// Student Dashboard View
// --------------------------------------------------------
function StudentDashboardView({ user }: { user: any }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch enrollments (fallback to mock data if API fails)
    const token = typeof window !== 'undefined' ? localStorage.getItem('ns_session_token') : '';
    
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch('/api/enrollments', { headers })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data)) {
          setCourses(data);
        } else {
          // Fallback mock data
          setCourses([
            { id: '1', title: 'Introduction to Flutter and Dart', category: 'Mobile Dev', progress: 45, image: 'https://picsum.photos/seed/flutter/800/600' },
            { id: '2', title: 'Advanced State Management', category: 'Architecture', progress: 12, image: 'https://picsum.photos/seed/state/800/600' }
          ]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback mock data on fetch error
        setCourses([
          { id: '1', title: 'Introduction to Flutter and Dart', category: 'Mobile Dev', progress: 45, image: 'https://picsum.photos/seed/flutter/800/600' },
          { id: '2', title: 'Advanced State Management', category: 'Architecture', progress: 12, image: 'https://picsum.photos/seed/state/800/600' }
        ]);
        setIsLoading(false);
      });
  }, []);

  const stats = [
    { label: "Enrolled Courses", value: courses.length, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Completed Courses", value: 0, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-100" },
    { label: "Overall Progress", value: "25%", icon: LayoutDashboard, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Welcome back, {user?.name || "Student"}!</h1>
        <p className="text-sm text-slate-500 mt-1">Ready to continue your learning journey today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start mb-2">
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {isLoading ? "-" : stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 text-sm">Loading your courses...</div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
            <BookOpen className="w-8 h-8 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-900">You haven't enrolled in any courses yet</p>
            <p className="text-xs text-slate-500 mt-1">Go to Course Catalog to start learning.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div 
                whileHover={{ y: -2 }}
                key={course.id} 
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer group transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {course.image ? (
                    <Image 
                      src={course.image} 
                      alt={course.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                  {course.progress === 100 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" /> Completed
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-base leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="mt-auto pt-3 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700">Progress</span>
                        <span className={course.progress === 100 ? "text-green-600" : "text-orange-600"}>{course.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${course.progress === 100 ? 'bg-green-500' : 'bg-orange-500'}`} 
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    {course.progress === 100 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-bold transition-colors border border-green-200"
                      >
                        <Download className="w-4 h-4" /> Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Course Catalog View
// --------------------------------------------------------
function CourseCatalogView({ user }: { user: any }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [justEnrolledCourseId, setJustEnrolledCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('ns_session_token') : '';
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // Fetch courses and enrollments concurrently
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/enrollments', { headers })
        ]);

        let coursesData = coursesRes.ok ? await coursesRes.json() : null;
        let enrollmentsData = enrollmentsRes.ok ? await enrollmentsRes.json() : null;
        
        // Fallback for mock environment
        if (!coursesData || !Array.isArray(coursesData) || coursesData.length === 0) {
          coursesData = [
            { id: '1', title: 'Introduction to Flutter and Dart', category: 'Mobile Dev', image: 'https://picsum.photos/seed/flutter/800/600', description: 'Start building natively compiled applications for mobile from a single codebase.' },
            { id: '2', title: 'Advanced State Management', category: 'Architecture', image: 'https://picsum.photos/seed/state/800/600', description: 'Master Provider, Riverpod, and BLoC patterns for complex apps.' },
            { id: '3', title: 'UI/UX Design for Developers', category: 'Design', image: 'https://picsum.photos/seed/design/800/600', description: 'Learn how to create beautiful, accessible, and intuitive interfaces.' }
          ];
        }

        if (!enrollmentsData || !Array.isArray(enrollmentsData)) {
          enrollmentsData = [
            { id: '1', title: 'Introduction to Flutter and Dart' }
          ];
        }

        setCourses(coursesData);
        setEnrolledCourseIds(new Set(enrollmentsData.map((e: any) => e.id || e.course_id)));
      } catch (e) {
        setCourses([
            { id: '1', title: 'Introduction to Flutter and Dart', category: 'Mobile Dev', image: 'https://picsum.photos/seed/flutter/800/600', description: 'Start building natively compiled applications for mobile from a single codebase.' },
            { id: '2', title: 'Advanced State Management', category: 'Architecture', image: 'https://picsum.photos/seed/state/800/600', description: 'Master Provider, Riverpod, and BLoC patterns for complex apps.' },
            { id: '3', title: 'UI/UX Design for Developers', category: 'Design', image: 'https://picsum.photos/seed/design/800/600', description: 'Learn how to create beautiful, accessible, and intuitive interfaces.' }
        ]);
        setEnrolledCourseIds(new Set(['1']));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  const filteredCourses = courses.filter(course => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (course.title && course.title.toLowerCase().includes(query)) ||
      (course.category && course.category.toLowerCase().includes(query));
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = async (courseId: string) => {
    if (!user?.id) return;
    setEnrollingCourseId(courseId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('ns_session_token') : '';
      const payload = [{ user_id: user.id, course_id: courseId }];
      
      const res = await fetch('/api/enrollments/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setEnrolledCourseIds(prev => new Set(prev).add(courseId));
        setJustEnrolledCourseId(courseId);
        setTimeout(() => setJustEnrolledCourseId(null), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Course Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Explore all available courses and enroll.</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:w-72"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2 sm:mb-6">
        {categories.map(category => (
          <button
            key={category as string}
            onClick={() => setSelectedCategory(category as string)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {category as string}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-500 text-sm">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
          <BookOpen className="w-8 h-8 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-900">
            {courses.length === 0 ? "No courses available yet" : "No courses found matching your search"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div 
              whileHover={{ y: -2 }}
              key={course.id} 
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group transition-shadow hover:shadow-md cursor-pointer"
            >
              <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center">
                {course.image ? (
                  <Image 
                    src={course.image} 
                    alt={course.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <BookOpen className="w-8 h-8 text-slate-300" />
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
                  {course.category}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col border-t border-slate-100">
                <h3 className="font-semibold text-slate-900 text-base leading-tight mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {course.description || "A comprehensive learning module for your journey."}
                </p>
                <div className="mt-auto pt-3 border-t border-slate-100">
                  {enrolledCourseIds.has(course.id) ? (
                    <div className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Enrolled
                    </div>
                  ) : (
                    <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Course Details Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative my-auto"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative h-64 w-full bg-slate-100">
                {selectedCourse.image ? (
                  <Image 
                    src={selectedCourse.image} 
                    alt={selectedCourse.title} 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                    <BookOpen className="w-16 h-16 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider bg-orange-500 text-white rounded-full shadow-sm">
                    {selectedCourse.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                    {selectedCourse.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Est. 12 Hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Book className="w-4 h-4 text-orange-500" />
                    <span>6 Modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>1,204 Enrolled</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About This Course</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {selectedCourse.description || "This course provides a comprehensive deep dive into the subject matter. You will learn fundamental concepts, advanced techniques, and practical applications that you can use immediately in your projects."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Syllabus Highlights</h3>
                    <ul className="space-y-3">
                      {[1, 2, 3].map((moduleNum) => (
                        <li key={moduleNum} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
                            {moduleNum}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm">Module {moduleNum} Fundamentals</h4>
                            <p className="text-xs text-slate-500 mt-1">Core concepts and setting up your environment.</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                  {justEnrolledCourseId === selectedCourse.id ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-6 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Enrolled!
                    </motion.div>
                  ) : enrolledCourseIds.has(selectedCourse.id) ? (
                    <div className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Already Enrolled
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEnroll(selectedCourse.id)}
                      disabled={enrollingCourseId === selectedCourse.id}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-70 text-white rounded-xl text-sm font-bold transition-colors shadow-sm hover:shadow flex items-center gap-2"
                    >
                      {enrollingCourseId === selectedCourse.id && <RefreshCw className="w-4 h-4 animate-spin" />}
                      Enroll Now for Free
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --------------------------------------------------------
// Course Management View (Admin/Instructor)
// --------------------------------------------------------
function ManageCoursesView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewCourse, setPreviewCourse] = useState<any>(null);
  
  const [editingCourse, setEditingCourse] = useState<boolean>(false);
  const [draftCourse, setDraftCourse] = useState<{ id?: string; title: string; description: string; category?: string }>({ title: '', description: '', category: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch from Cloudflare Worker API
    fetch('/api/courses')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!editingCourse) return;
    
    // Auto-save logic
    const handler = setTimeout(async () => {
      // Don't save if it's completely empty
      if (!draftCourse.title && !draftCourse.description) return;
      
      setIsSaving(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('ns_session_token') : '';
        const res = await fetch('/api/courses/draft', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(draftCourse)
        });
        
        if (res.ok) {
          const data = await res.json();
          setLastSaved(new Date());
          if (!draftCourse.id && data.id) {
            setDraftCourse(prev => ({ ...prev, id: data.id }));
          }
        }
      } catch (err) {
        console.error('Failed to auto-save draft', err);
      } finally {
        setIsSaving(false);
      }
    }, 5000);

    return () => clearTimeout(handler);
  }, [draftCourse, editingCourse]);

  const handleEditClick = (course?: any) => {
    if (course) {
      setDraftCourse({ id: course.id, title: course.title, description: course.description || '', category: course.category || '' });
    } else {
      setDraftCourse({ title: '', description: '', category: '' });
      setLastSaved(null);
    }
    setEditingCourse(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Course Management</h2>
          <p className="text-sm text-slate-500">Create courses, structure modules, and upload materials to Cloudflare R2.</p>
        </div>
        <button 
          onClick={() => handleEditClick()}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-500 text-sm">Loading course data...</div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
          <BookOpen className="w-8 h-8 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-900">No courses managed yet</p>
          <p className="text-xs text-slate-500 mt-1">Create your first course to begin.</p>
        </div>
      ) : (
        courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-semibold text-slate-900">{course.title}</h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleEditClick(course)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setPreviewCourse(course)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${course.published ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                  {course.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
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
        ))
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {editingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  {draftCourse.id ? 'Edit Course' : 'Create New Course'}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />}
                    {lastSaved ? `Draft saved at ${lastSaved.toLocaleTimeString()}` : 'Editing...'}
                  </span>
                  <button 
                    onClick={() => {
                      setEditingCourse(false);
                      // Force a refresh of the courses list here ideally
                      fetch('/api/courses')
                        .then(res => res.ok ? res.json() : [])
                        .then(data => setCourses(data))
                        .catch(() => {});
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                  <input 
                    type="text" 
                    value={draftCourse.title}
                    onChange={(e) => setDraftCourse({ ...draftCourse, title: e.target.value })}
                    placeholder="e.g. Introduction to Next.js"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input 
                    type="text" 
                    value={draftCourse.category}
                    onChange={(e) => setDraftCourse({ ...draftCourse, category: e.target.value })}
                    placeholder="e.g. Web Development"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={draftCourse.description}
                    onChange={(e) => setDraftCourse({ ...draftCourse, description: e.target.value })}
                    placeholder="Describe what students will learn..."
                    rows={5}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <p className="text-xs text-slate-500 italic flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Auto-saves every 5 seconds while typing
                </p>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setEditingCourse(false);
                    // Force a refresh of the courses list here ideally
                    fetch('/api/courses')
                      .then(res => res.ok ? res.json() : [])
                      .then(data => setCourses(data))
                      .catch(() => {});
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Done Editing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-orange-600" /> Course Preview
                </h3>
                <button 
                  onClick={() => setPreviewCourse(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md mb-3 border border-slate-200">
                    {previewCourse.category || 'Uncategorized'}
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{previewCourse.title}</h1>
                  <p className="text-slate-600 leading-relaxed">{previewCourse.description || 'No description provided. This is where the course overview would be displayed for students.'}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">Curriculum Structure Preview</h4>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <Video className="w-4 h-4 text-orange-500" /> Module 1: Getting Started
                      </div>
                      <span className="text-xs text-slate-400">12 mins</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <BookOpen className="w-4 h-4 text-blue-500" /> Module 2: Core Concepts
                      </div>
                      <span className="text-xs text-slate-400">Reading</span>
                    </div>
                    <p className="text-xs text-slate-500 italic mt-4 pt-4 border-t border-slate-200">
                      Note: Detailed module fetching from Cloudflare D1 would be implemented here to show live curriculum.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setPreviewCourse(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Close Preview
                </button>
                {!previewCourse.published && (
                  <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Publish Now
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --------------------------------------------------------
// Real-Time Chat View (Durable Objects)
// --------------------------------------------------------
function ChatView({ user }: { user: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Attempt WebSocket connection to Cloudflare Durable Objects
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/chat/general`;
    
    try {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => setIsOnline(true);
      socket.onclose = () => setIsOnline(false);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "history") {
            setMessages(data.data.map((m: any) => ({
              id: m.id,
              user: m.user_name,
              text: m.content,
              time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: m.user_id === user?.id
            })));
          } else if (data.type === "chat") {
            const m = data.data;
            setMessages(prev => [...prev, {
              id: Date.now(),
              user: m.user_name,
              text: m.content,
              time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: m.user_id === user?.id
            }]);
          }
        } catch (e) {
          console.error("Invalid message format", e);
        }
      };

      setWs(socket);
      return () => socket.close();
    } catch (e) {
      console.warn("WebSocket connection failed, server may not be running.");
    }
  }, [user]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "chat",
        userId: user?.id || "anonymous",
        userName: user?.name || "Guest",
        content: input
      }));
    } else {
      // Optimistic offline update fallback
      setMessages([...messages, { 
        id: Date.now(), 
        user: user?.name || "Guest", 
        text: input, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        isMe: true 
      }]);
    }
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
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
          <span className="text-xs font-medium text-slate-600">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
            <p>No messages in this channel yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
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
          ))
        )}
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

// --------------------------------------------------------
// Login View (Email + OTP)
// --------------------------------------------------------
function LoginView({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.error || "Failed to request OTP");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">CF-LMS</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">Admin Access</h2>
        <p className="text-slate-500 text-sm mb-6 text-center">Sign in with your email to continue</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md text-center font-medium">{error}</div>}

        {step === 1 ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Continue with Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
              <input 
                type="text" 
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors text-center tracking-widest text-lg font-mono"
                placeholder="123456"
                maxLength={6}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">Check the worker logs for the OTP</p>
            </div>
            <button 
              disabled={loading}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

