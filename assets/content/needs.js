// Needs used to group and filter the library pages (exercises.html and prayers.html).
// Each page only shows the needs its own items use.
// After editing, rebuild the pages: node scripts/build-library.mjs
//
// needs: id, title (headings and status line), label (filter button), tagline.

export const needs = [
  { id: 'anxious', title: "When I'm anxious or afraid", label: 'Anxious or afraid', tagline: 'Peace for a troubled heart' },
  { id: 'healing', title: 'When I need healing', label: 'Healing', tagline: 'Standing on His finished work' },
  { id: 'attack', title: "When I'm under spiritual attack", label: 'Spiritual attack', tagline: 'Your authority in Christ' },
  { id: 'deliverance', title: 'When someone needs deliverance', label: 'Deliverance', tagline: "Freedom in Jesus' name" },
  { id: 'temptation', title: "When I'm struggling with temptation", label: 'Temptation', tagline: 'Submit to God, resist the devil' },
  { id: 'forgive', title: 'When I need to forgive', label: 'Forgiveness', tagline: "Releasing others as you've been released" },
  { id: 'condemned', title: 'When I feel condemned or ashamed', label: 'Condemned or ashamed', tagline: 'No condemnation in Christ' },
  { id: 'closer', title: 'To grow closer to Jesus', label: 'Closer to Jesus', tagline: 'Abiding in His words' },
  { id: 'faith', title: 'To build up my faith', label: 'Building faith', tagline: 'Praise, promises, and prayer' },
  { id: 'home', title: 'For my home and family', label: 'Home and family', tagline: 'Covering those you love' },
  { id: 'rest', title: "When I'm worn out and need rest", label: 'Rest', tagline: 'Rest in Him' },
];
