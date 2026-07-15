/* AEL Engineering Academy — Export Plugin v1.0 */

window.AELExport = {
  version: '1.0.0',

  exportProgress(format = 'json') {
    const state = this.loadState();
    if (format === 'json') {
      return JSON.stringify(state.progress, null, 2);
    }
    if (format === 'csv') {
      const rows = [['Item ID', 'Completed', 'Timestamp']];
      for (const [id, data] of Object.entries(state.progress)) {
        rows.push([id, data.completed, new Date(data.timestamp).toISOString()]);
      }
      return rows.map(r => r.join(',')).join('\n');
    }
    return null;
  },

  exportNotes(format = 'json') {
    const state = this.loadState();
    if (format === 'json') {
      return JSON.stringify(state.notes, null, 2);
    }
    if (format === 'markdown') {
      let md = '# My AEL Academy Notes\n\n';
      for (const [itemId, note] of Object.entries(state.notes)) {
        md += `## ${itemId}\n\n${note.content}\n\n---\n\n`;
      }
      return md;
    }
    return null;
  },

  exportQuizResults() {
    const state = this.loadState();
    return JSON.stringify(state.quizResults, null, 2);
  },

  exportCertificate(weekId, score) {
    return {
      type: 'AEL Engineering Academy Certificate',
      recipient: 'Student',
      week: weekId,
      score: score,
      date: new Date().toISOString(),
      issuer: 'AEL Digital Studio',
      verification: `https://aymanelmasryael.github.io/ael-engineering-academy/#verify-${weekId}`
    };
  },

  download(content, filename, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  loadState() {
    try {
      return JSON.parse(localStorage.getItem('ael-academy-state') || '{}');
    } catch (e) {
      return { progress: {}, notes: {}, quizResults: {} };
    }
  }
};
