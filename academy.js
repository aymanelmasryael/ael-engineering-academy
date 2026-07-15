/* ═══════════════════════════════════════════════════════════════
   AEL Engineering Academy — Product Layer
   Thin customization layer on top of AEL Reference Framework
   ═══════════════════════════════════════════════════════════════ */

'use strict';

window.ACADEMY = {
  version: '1.0.0',
  name: 'AEL Engineering Academy',
  author: 'Ayman Elmasry — AEL Digital Studio',

  /* ── Branding ── */

  brand: {
    name: 'AEL Engineering Academy',
    tagline: 'Learn LLM Engineering from Zero to Production',
    colors: {
      primary: '#0074FF',
      gold: '#FFD700',
      teal: '#00FFCC',
      purple: '#6C47FF',
      pink: '#FF4D8D',
      green: '#00FF88',
      red: '#FF4444'
    }
  },

  /* ── Module Colors ── */

  moduleColors: {
    'MOD-FOUNDATIONS': '#00FF88',
    'MOD-CORE-TECHNIQUES': '#0074FF',
    'MOD-APPLIED-ENGINEERING': '#6C47FF',
    'MOD-PRODUCTION': '#FFD700'
  },

  /* ── Difficulty Badges ── */

  difficultyBadge(difficulty) {
    const map = {
      'basic': 'badge-beginner',
      'beginner': 'badge-beginner',
      'intermediate': 'badge-intermediate',
      'advanced': 'badge-advanced',
      'expert': 'badge-expert'
    };
    return map[difficulty] || 'badge-beginner';
  },

  /* ── Module Short Names ── */

  moduleShort(moduleId) {
    const map = {
      'MOD-FOUNDATIONS': 'FOU',
      'MOD-CORE-TECHNIQUES': 'COR',
      'MOD-APPLIED-ENGINEERING': 'APL',
      'MOD-PRODUCTION': 'PRD'
    };
    return map[moduleId] || 'UNK';
  },

  /* ── Certificate Verification URL ── */

  certificateUrl(weekId) {
    return `https://aymanelmasryael.github.io/ael-engineering-academy/#verify-${weekId}`;
  }
};
