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
];
