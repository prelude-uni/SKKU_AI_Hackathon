// src/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { SupportedLanguage } from '@/types';
import { Sparkles, Globe, Users, CheckSquare, MessageSquareText, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t, currentUser, currentProjectId, currentProject } = useApp();
  const pathname = usePathname();
  const [showAcornHelp, setShowAcornHelp] = useState(false);

  const langNames: Record<SupportedLanguage, string> = {
    ko: '한국어',
    en: 'English',
    zh: '中文',
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} id="nav-brand-logo">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
          }}>
            🐿️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em' }}>
                {t.appTitle}
              </span>
              <span style={{
                fontSize: '0.675rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}>
                AI SYNC
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Task Unstuck & Mutual Aid
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link
            href="/projects"
            id="nav-link-projects"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: pathname === '/projects' || pathname === '/' ? '#fff' : 'var(--text-muted)',
              background: pathname === '/projects' || pathname === '/' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <Users size={16} />
            <span>{t.projects}</span>
          </Link>

          <Link
            href={`/projects/${currentProjectId}/dashboard`}
            id="nav-link-dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: pathname.includes('/dashboard') ? '#fff' : 'var(--text-muted)',
              background: pathname.includes('/dashboard') ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
              border: pathname.includes('/dashboard') ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <CheckSquare size={16} />
            <span>{t.dashboard}</span>
          </Link>

          <Link
            href="/mediation/med_001"
            id="nav-link-mediation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: pathname.includes('/mediation') ? '#c084fc' : 'var(--text-muted)',
              background: pathname.includes('/mediation') ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
              border: pathname.includes('/mediation') ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <MessageSquareText size={16} />
            <span>{t.mediationRoom}</span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#f43f5e',
              boxShadow: '0 0 8px #f43f5e',
            }} />
          </Link>
        </nav>

        {/* Right Section: Language + Acorns + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            {(['ko', 'en', 'zh'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                id={`lang-btn-${lang}`}
                onClick={() => setLanguage(lang)}
                style={{
                  background: language === lang ? 'var(--primary-indigo)' : 'transparent',
                  color: language === lang ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Acorn Badge with tooltip */}
          <div style={{ position: 'relative' }}>
            <button
              id="acorn-status-btn"
              onClick={() => setShowAcornHelp(!showAcornHelp)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--acorn-bg)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: 'var(--acorn-gold)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <span>🌰</span>
              <span>{currentUser.acorns}</span>
              <HelpCircle size={14} style={{ opacity: 0.7 }} />
            </button>

            {showAcornHelp && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '280px',
                padding: '12px',
                background: '#1a1f2e',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                zIndex: 60,
                fontSize: '0.8rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--acorn-gold)', marginBottom: '4px' }}>
                  <span>🌰 도토리(Acorn) 시스템이란?</span>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  과업 지연 시 배려나 도움을 받은 사람에게 도토리가 적립됩니다.
                  추후 다른 팀원에게 긴급 병목이 발생하면 **도토리가 많은 사람이 1순위로 지원**하여 빚을 갚는 공정한 상호부조 메커니즘입니다.
                </p>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px 4px 4px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}>
              {currentUser.avatar}
            </div>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#fff' }}>
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
