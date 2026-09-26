// Exercises shown on exercises.html, grouped and filtered by need.
// After editing, rebuild the page: node scripts/build-library.mjs
//
// Needs live in ./needs.js (re-exported here so existing importers keep working).
// exercises: id (used in links), title, optional time, needs (first = home need), blocks.
// Block types: paragraph {text}, meta {items:[{label,value}]}, scriptures {items:[{ref,text,summary?}]},
//   anchor {label,text}, steps {items:[]}, prayer {lines:[]}.
// Inline text supports **bold** and [text](url) only.

export { needs } from './needs.js';

export const exercises = [
  {
    id: 'forgiveness-release',
    title: 'Forgiveness Release',
    time: '5 min',
    needs: ['forgive'],
    blocks: [
      { type: 'paragraph', text: "This exercise helps us release personal vengeance and practice the mercy we have already received in Christ. Forgiving others does not earn God's forgiveness or maintain salvation. It brings our responses into alignment with Jesus' heart. Forgiveness is a choice; it does not require denying harm, erasing memory, abandoning healthy boundaries, or restoring trust without change." },
      {
        type: 'scriptures',
        items: [
          { ref: 'Deuteronomy 32:35', text: 'Vengeance is Mine, and recompense; their foot shall slip in due time; for the day of their calamity is at hand, and the things to come hasten upon them.', summary: "Read this through Jesus' call to love our enemies: entrust justice to God and let go of personal retaliation." },
          { ref: 'Matthew 7:1-2', text: 'Do not judge, or you too will be judged. For in the same way you judge others, you will be judged, and with the measure you use, it will be measured to you.', summary: 'Release others from your judgment and leave final judgment to God: the measure of mercy you show others is the measure you will live by.' },
          { ref: 'Matthew 5:43-45', text: 'You have heard that it was said, "You shall love your neighbor and hate your enemy." But I say to you, love your enemies and pray for those who persecute you, so that you may be sons of your Father who is in heaven; for He causes His sun to rise on the evil and the good, and sends rain on the righteous and the unrighteous.', summary: 'Love and pray for those who hurt you: as the Father shows kindness to the good and the evil alike, we reflect His heart when we bless our enemies.' },
          { ref: 'Matthew 6:12, 14-15', text: 'And forgive us our debts, as we also have forgiven our debtors. For if you forgive others for their transgressions, your heavenly Father will also forgive you. But if you do not forgive others, then your Father will not forgive your transgressions.', summary: 'Forgive others as God has forgiven you: unforgiveness does not undo your salvation, but it hinders your fellowship with the Father and your experience of His forgiveness.' },
        ],
      },
      { type: 'paragraph', text: "Jesus' teaching takes forgiveness seriously. The framework reads these passages through His finished work: salvation is a gift, and extending mercy expresses the grace already received. We can ask for help while difficult feelings remain." },
      { type: 'paragraph', text: "**Practice:** Spend about 5 minutes considering Jesus' teaching on forgiveness. Notice His intention of love, and begin with an honest prayer:" },
      {
        type: 'prayer',
        lines: [
          'Jesus, You know what happened and how it has affected me.',
          'Because You have shown me mercy, I choose to release (Name) from my personal vengeance.',
          'Let Your words loosen the hold of bitterness and renew my mind.',
          'Help me forgive while acting with wisdom, truth, and appropriate boundaries.',
          'Show me where I need to acknowledge my own wrongs and make amends.',
          'Thank You for forgiveness already given through Christ. Teach me to walk in Your love. Amen.',
        ],
      },
    ],
  },
  {
    id: 'breath-prayer',
    title: 'Breath Prayer',
    time: '10 breaths',
    needs: ['anxious', 'rest'],
    blocks: [
      { type: 'paragraph', text: 'On inhale: "Lord Jesus, draw me near." On exhale: "I rest in Your grace." Repeat for 10 slow breaths to center before prayer.' },
    ],
  },
  {
    id: 'scripture-walk',
    title: 'Scripture Walk',
    time: '10 min',
    needs: ['anxious', 'closer'],
    blocks: [
      { type: 'paragraph', text: 'Walk for 10 minutes reciting a single verse (Ps. 23:1 or Jn. 14:27). Let the rhythm of your steps reinforce the promise.' },
    ],
  },
  {
    id: 'protection-reset',
    title: 'Protection Reset',
    needs: ['attack', 'home'],
    blocks: [
      { type: 'paragraph', text: `Pray, "Lord, surround this home with Your peace in Jesus' name." If helpful, trace a small cross as a reminder of Christ. The gesture has no independent power.` },
    ],
  },
  {
    id: 'baptism-reflection',
    title: 'Baptism Renewal',
    time: '10 min',
    needs: ['condemned'],
    blocks: [
      { type: 'meta', items: [{ label: 'Time', value: '10 minutes' }, { label: 'Focus', value: 'Identity in Christ' }] },
      { type: 'paragraph', text: 'Stand near water (sink, river, shower). Touch the water and say, "I am buried with Christ; I am raised with Christ." Read Romans 6:3-4 aloud and pray for a fresh mind set on resurrection life.' },
      { type: 'anchor', label: 'Scripture to anchor', text: 'Romans 6:3-4' },
    ],
  },
  {
    id: 'communion-pause',
    title: 'Communion Pause',
    time: '5 min',
    needs: ['closer'],
    blocks: [
      { type: 'paragraph', text: 'Set aside 5 minutes midweek. Read 1 Corinthians 11:23-26, thank Jesus for His body and blood, and journal one line of gratitude.' },
    ],
  },
  {
    id: 'daily-devotion',
    title: 'Daily Devotion Pattern',
    time: '15 min',
    needs: ['closer'],
    blocks: [
      { type: 'meta', items: [{ label: 'Time', value: '15 minutes' }, { label: 'Tools', value: 'Bible, journal, quiet spot' }] },
      { type: 'paragraph', text: "1) Ask for the Spirit's help. 2) Read a short teaching of Jesus (start with John 15). 3) Consider what it reveals about His heart, intentions, and way of responding. 4) Hold His words in mind and choose one action that reflects them today. 5) Pray and end with gratitude. Read other passages of Scripture in the light of Christ." },
      { type: 'anchor', label: 'Scripture to anchor', text: 'John 15:4-5' },
    ],
  },
  {
    id: 'fasting',
    title: 'Prayer & Fasting Starter',
    time: 'One meal',
    needs: ['faith', 'closer'],
    blocks: [
      { type: 'meta', items: [{ label: 'Time', value: 'One meal' }, { label: 'Focus', value: 'Dependence and clarity' }] },
      { type: 'paragraph', text: "Set aside an ordinary comfort or distraction and use the time for prayer; a food fast is optional. Reflect on God's faithfulness, sovereignty, and care as expressed in His names. Close by thanking Jesus for being the Bread of Life. The time set aside is a response to grace, not payment for an answer." },
      { type: 'anchor', label: 'Scripture to anchor', text: 'Matthew 6:16-18; John 6:35' },
    ],
  },
  {
    id: 'communion-family',
    title: 'House Communion',
    time: '20 min',
    needs: ['home', 'closer'],
    blocks: [
      { type: 'meta', items: [{ label: 'Time', value: '20 minutes' }, { label: 'Focus', value: 'Gratitude and unity' }] },
      { type: 'paragraph', text: 'Gather bread and juice. Read Luke 22:19-20, invite each person to name one way Jesus has carried them this week, then partake together. Close with Psalm 23 read in unison.' },
      { type: 'anchor', label: 'Scripture to anchor', text: 'Luke 22:19-20; Psalm 23' },
    ],
  },
  {
    id: 'space-clearing',
    title: 'Space-Clearing Prayer',
    time: '8 min',
    needs: ['home', 'attack'],
    blocks: [
      { type: 'meta', items: [{ label: 'Time', value: '8 minutes' }, { label: 'Focus', value: 'Peace in your home' }] },
      { type: 'paragraph', text: `Pray through each room: "Lord, this home belongs to You. Help us fill it with truth, peace, and love in Jesus' name." Ask God to send His ministers as He wills, and thank Him for His presence. Let prayer lead to a practical act of hospitality, reconciliation, or care.` },
      { type: 'anchor', label: 'Scripture to anchor', text: 'Psalm 91:11-12' },
    ],
  },
];
