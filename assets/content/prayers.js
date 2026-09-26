// Prayers shown on prayers.html, grouped and filtered by need (needs live in needs.js).
// After editing, rebuild the pages: node scripts/build-library.mjs
// Same item format as exercises.js, plus block types list {items:[]} and guide {href,label}.

export const prayers = [
  {
    id: 'heavenly-places',
    title: 'Prayer to Banish Negative Influences in the Heavenly Places',
    needs: ['attack', 'healing'],
    blocks: [
      { type: 'paragraph', text: 'This prayer uses our delegated authority in Christ to command any enemy operating from the heavenly realms to cease every operation of negativity against us: against our minds, our bodies, and our livelihoods.' },
      { type: 'paragraph', text: 'Scripture gives many examples of a spirit working against a person to cause delays, sickness, and setbacks:' },
      { type: 'list', items: [
        "**Daniel 10:12-13** - The prince of the kingdom of Persia withstood the answer to Daniel's prayer for twenty-one days.",
        "**Job 2:7** - Satan struck Job's health, afflicting him with painful sores.",
        '**Zechariah 3:1-2** - Satan stood at the right hand of Joshua the high priest to resist him. On earth, people were working to stop the rebuilding of the temple, but God showed Zechariah in a vision that a demonic force stood behind that opposition.',
      ] },
      { type: 'paragraph', text: 'This prayer is aimed specifically at spiritual forces in the heavenly places that may be trying to hinder your progress, your health, or your finances; to block your path; or to block what God is doing in your life.' },
      { type: 'anchor', label: 'Key Scriptures', text: 'Daniel 10:12-13, Job 2:7, Zechariah 3:1-2, Ephesians 6:12, Luke 10:19' },
      { type: 'guide', href: 'heavenly-places-prayer.html', label: 'View Complete Step-by-Step Guide →' },
    ],
  },
  {
    id: 'banishing-and-clearing',
    title: 'Prayer of Banishing and Clearing',
    needs: ['home', 'attack'],
    blocks: [
      { type: 'paragraph', text: "This prayer helps us seek peace, protection, and renewed attention to Christ. The guide begins with the Crucified Cross, then calls on God's names (YHWH, El Shaddai, El Elyon, and Yahweh) with a short petition in Jesus' name after each." },
      { type: 'paragraph', text: 'According to Article 22, the source, object, authority, intention, and posture of a practice matter. Use this guide to attend to Christ, reject fear and condemnation, and pray in faith.' },
      { type: 'anchor', label: 'Key Scriptures', text: 'Psalm 91:11-12, Hebrews 1:14, Matthew 18:10, Exodus 3:14, Genesis 17:1, Psalm 7:17' },
      { type: 'guide', href: 'banishing-and-clearing.html', label: 'View Complete Step-by-Step Guide →' },
    ],
  },
  {
    id: 'exorcism',
    title: 'Exorcism Prayer',
    needs: ['deliverance', 'attack'],
    blocks: [
      { type: 'paragraph', text: 'This is a prayer rooted in Christ and divine authority, meant to exorcise evil spirits and deliver a person from evil.' },
      { type: 'paragraph', text: "The goal of this prayer is to exercise the authority Christ has given us over any evil spirit that is currently in a person or attached to them. We believe spirits can dwell in a person's body or attach themselves to a person. This prayer is specifically for driving out a demonic force from within a person, or breaking its hold where it is attached. Scripture records a man possessed by a legion of demons, whom Jesus set completely free (Mark 5:1-20)." },
      { type: 'paragraph', text: 'Our framework teaches that demons can never attach to or indwell the regenerated spirit of a believer, but they may influence the mind, the body, or the subconscious ([Article 13](index.html#/beliefs?article=13)). Believers hold delegated authority from Christ to speak directly to these spirits and command them to leave in the name of Jesus ([Article 21](index.html#/beliefs?article=21)). Spirits differ in rank and resistance, so some may require greater preparation through prayer and fasting before they leave (Mark 9:28-29).' },
      { type: 'paragraph', text: 'The framework recognizes spiritual warfare while affirming that not all suffering is demonic or caused by personal failure. Prayer belongs alongside compassionate community support and appropriate medical care. The guide helps believers pray without using symptoms as a diagnosis of spiritual attack.' },
      { type: 'anchor', label: 'Key Scriptures', text: 'Mark 5:1-20, Mark 9:28-29, Mark 16:17, Luke 10:19, Acts 16:18, James 4:7, Exodus 3:14, Isaiah 43:11-13' },
      { type: 'guide', href: 'exorcism-prayer.html', label: 'View Complete Prayer Guide →' },
    ],
  },
  {
    id: 'crucified-cross',
    title: 'The Crucified Cross',
    needs: ['condemned', 'closer'],
    blocks: [
      { type: 'paragraph', text: "The Crucified Cross is a mental and physical meditation on Jesus' finished work. This collection uses it as a Christ-centered adaptation of a symbolic cross gesture. The movement is optional: its purpose is to turn attention to Christ's self-giving love and the grace already received in Him." },
      { type: 'paragraph', text: "In this practice, the believer visualizes Christ on the cross—battered, bruised, and suffering—as they form the cross upon their own body through simple gestures. This tangible reminder helps the Christian internalize the gravity of sin and the magnitude of God's sacrificial love." },
      { type: 'paragraph', text: 'This would be a good time to confess any shortcomings or sins and [make renunciations](renunciations.html) before continuing with the prayer.' },
      { type: 'prayer', lines: [
        'Jesus Christ is Lord.',
        'I belong to Jesus Christ.',
        'I have been brought near to God through Christ.',
        'I am joined to Christ, and the Holy Spirit dwells within me.',
        'There is now no condemnation for me in Christ Jesus.',
        "I have been delivered from the authority of darkness and brought into the kingdom of God's beloved Son.",
        'Jesus Christ is Lord over me—spirit, mind, body, and life.',
      ] },
      { type: 'anchor', label: 'Key Scriptures', text: '1 Corinthians 1:18, Galatians 6:14, Colossians 1:20, Isaiah 53:5, 1 Peter 2:24' },
    ],
  },
];
