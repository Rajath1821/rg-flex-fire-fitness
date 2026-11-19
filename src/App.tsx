import React, { useState, useEffect } from 'react';
import { Member, MembershipPlanType } from './types';
import { StorageService } from './services/storage';

// Home Components
import { Navbar } from './components/home/Navbar';
import { Hero } from './components/home/Hero';
import { FacilitiesSection } from './components/home/FacilitiesSection';
import { MembershipPlans } from './components/home/MembershipPlans';
import { ContactSection } from './components/home/ContactSection';
import { Footer } from './components/home/Footer';
import { JoinModal } from './components/home/JoinModal';

// Separate Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Separate User / Member Components
import { MemberLogin } from './components/member/MemberLogin';
import { MemberPortal } from './components/member/MemberPortal';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin-login' | 'admin-dashboard' | 'member-login' | 'member-portal'>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedMember, setLoggedMember] = useState<Member | null>(null);

  // Join modal state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<MembershipPlanType>('Standard Package (3 Months)');
  const [initialStatsForJoin, setInitialStatsForJoin] = useState<{ weight: number; height: number } | undefined>(undefined);

  // Initialize session state and handle hash routing
  useEffect(() => {
    const adminAuth = StorageService.isAdminAuthenticated();
    setIsAdmin(adminAuth);

    const mem = StorageService.getLoggedMember();
    setLoggedMember(mem);

    const handleRouteChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      const route = hash || path;

      if (route === 'admin' || route === 'admin-login' || route === 'admin-dashboard') {
        if (StorageService.isAdminAuthenticated()) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else if (route === 'user' || route === 'member' || route === 'member-login' || route === 'member-portal') {
        const activeMem = StorageService.getLoggedMember();
        if (activeMem) {
          setLoggedMember(activeMem);
          setCurrentView('member-portal');
        } else {
          setCurrentView('member-login');
        }
      } else {
        setCurrentView('home');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleNavigate = (view: string, sectionId?: string) => {
    if (view === 'admin' || view === 'admin-login' || view === 'admin-dashboard') {
      if (isAdmin) {
        setCurrentView('admin-dashboard');
        window.location.hash = 'admin';
      } else {
        setCurrentView('admin-login');
        window.location.hash = 'admin';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'user' || view === 'member-login' || view === 'member-portal') {
      if (loggedMember) {
        setCurrentView('member-portal');
        window.location.hash = 'user';
      } else {
        setCurrentView('member-login');
        window.location.hash = 'user';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default 'home'
    setCurrentView('home');
    window.location.hash = '';
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setCurrentView('admin-dashboard');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    StorageService.setAdminSession(false);
    setIsAdmin(false);
    setCurrentView('home');
    window.location.hash = '';
  };

  const handleMemberLoginSuccess = (m: Member) => {
    setLoggedMember(m);
    setCurrentView('member-portal');
    window.location.hash = 'user';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMemberLogout = () => {
    StorageService.setMemberSession(null);
    setLoggedMember(null);
    setCurrentView('home');
    window.location.hash = '';
  };

  const handleJoinModalSuccess = (newMember: Member) => {
    setLoggedMember(newMember);
    setJoinModalOpen(false);
    setCurrentView('member-portal');
    window.location.hash = 'user';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenJoinModal = (plan?: string) => {
    if (plan && Object.keys(StorageService.getMembers()).length) {
      setSelectedPlanForModal(plan as MembershipPlanType);
    }
    setJoinModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gym-black text-slate-100 flex flex-col font-sans selection:bg-gym-neon selection:text-black">
      
      {/* Top Navbar ONLY renders on the Home Page - completely separate from Admin and User Pages */}
      {currentView === 'home' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isAdmin={isAdmin}
          loggedMember={loggedMember}
          onAdminLogout={handleAdminLogout}
          onMemberLogout={handleMemberLogout}
          onOpenJoinModal={handleOpenJoinModal}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* 1. HOME PAGE */}
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-300">
            <Hero
              onJoinClick={() => handleOpenJoinModal()}
              onExplorePlans={() => {
                const el = document.getElementById('plans');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onGoToMember={() => handleNavigate('user')}
            />
            <MembershipPlans />
            <FacilitiesSection />
            <ContactSection />
            <Footer onNavigate={handleNavigate} />
          </div>
        )}

        {/* 2. SEPARATE ADMIN PAGE: LOGIN */}
        {currentView === 'admin-login' && (
          <div className="animate-in fade-in duration-300">
            <AdminLogin
              onSuccess={handleAdminLoginSuccess}
              onBackToHome={() => handleNavigate('home')}
            />
          </div>
        )}

        {/* 3. SEPARATE ADMIN PAGE: DASHBOARD */}
        {currentView === 'admin-dashboard' && (
          <div className="animate-in fade-in duration-300">
            <AdminDashboard
              onLogout={handleAdminLogout}
              onNavigateHome={() => handleNavigate('home')}
            />
          </div>
        )}

        {/* 4. SEPARATE USER PAGE: LOGIN */}
        {currentView === 'member-login' && (
          <div className="animate-in fade-in duration-300">
            <MemberLogin
              onSuccess={handleMemberLoginSuccess}
              onBackToHome={() => handleNavigate('home')}
              onGoToJoin={() => handleOpenJoinModal()}
            />
          </div>
        )}

        {/* 5. SEPARATE USER PAGE: PORTAL DASHBOARD */}
        {currentView === 'member-portal' && loggedMember && (
          <div className="animate-in fade-in duration-300">
            <MemberPortal
              member={loggedMember}
              onLogout={handleMemberLogout}
              onNavigateHome={() => handleNavigate('home')}
              onMemberUpdated={(updated) => setLoggedMember(updated)}
            />
          </div>
        )}
      </main>

      <JoinModal
        isOpen={joinModalOpen}
        initialPlan={selectedPlanForModal}
        initialStats={initialStatsForJoin}
        onClose={() => setJoinModalOpen(false)}
        onSuccessEnroll={handleJoinModalSuccess}
      />

    </div>
  );
}

export default App;
