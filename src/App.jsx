import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Music2, Volume2, VolumeX, ArrowRight, ArrowLeft, Sparkles, Camera, Mail, Gift, Stars, QrCode, Download, Copy, RotateCcw } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { chapters, memories, loveLetter, proposalMessage, senderName } from './data'

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(5px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.25 } }
}

function Petals() {
  return <div className="petal-field" aria-hidden="true">{Array.from({ length: 18 }, (_, i) =>
    <span className="petal" key={i} style={{ '--i': i, '--delay': `${(i % 7) * -1.8}s`, '--left': `${(i * 17) % 100}%` }}>✿</span>
  )}</div>
}

function Shell({ children }) {
  const [musicOn, setMusicOn] = useState(false)
  const audioRef = useRef(null)
  const location = useLocation()
  useEffect(() => {
    if (!audioRef.current) return
    if (musicOn) audioRef.current.play().catch(() => setMusicOn(false))
    else audioRef.current.pause()
  }, [musicOn])
  useEffect(() => { setMusicOn(false) }, [location.pathname])
  return <div className="app-shell">
    <audio ref={audioRef} src="/music/romantic.mp3" loop preload="none" />
    <div className="ambient-glow" />
    <Petals />
    <header className="topbar">
      <NavLink to="/" className="brand"><span className="brand-mark"><Heart size={15} fill="currentColor" /></span> a little thing for Shreya</NavLink>
      <button className={`music-toggle ${musicOn ? 'is-playing' : ''}`} onClick={() => setMusicOn(v => !v)} aria-label={musicOn ? 'Pause music' : 'Play music'}>
        {musicOn ? <Volume2 size={16} /> : <Music2 size={16} />} <span>{musicOn ? 'Music on' : 'Play music'}</span>
      </button>
    </header>
    <main className="main-content">{children}</main>
    <footer className="footer-note">made with care by {senderName} <Heart size={12} fill="currentColor" /></footer>
  </div>
}

function PageFrame({ children, className = '' }) {
  return <motion.section className={`page-frame ${className}`} variants={pageVariants} initial="initial" animate="animate" exit="exit">{children}</motion.section>
}

function Eyebrow({ children }) { return <div className="eyebrow"><span />{children}<span /></div> }
function PrimaryLink({ to, children }) { return <NavLink to={to} className="primary-button">{children}<ArrowRight size={17} /></NavLink> }

function Welcome() {
  return <PageFrame className="welcome-page">
    <div className="hero-orbit"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-heart"><Heart size={42} fill="currentColor" /></div><span className="orbit-star star-a">✦</span><span className="orbit-star star-b">✧</span></div>
    <Eyebrow>A small surprise, made just for you</Eyebrow>
    <h1 className="display-title">Hey, <em>Shreya.</em></h1>
    <p className="lead">There’s something I’ve been wanting to share with you.<br />I made a little journey. Will you take a look?</p>
    <PrimaryLink to="/hello">Open your surprise</PrimaryLink>
    <p className="microcopy">best experienced with a little quiet time <Heart size={11} fill="currentColor" /></p>
  </PageFrame>
}

function Hello() {
  return <PageFrame className="center-page">
    <div className="illustration-card envelope-art"><div className="envelope"><div className="envelope-flap" /><Mail size={48} strokeWidth={1.1} /><span className="seal"><Heart size={16} fill="currentColor" /></span></div></div>
    <Eyebrow>Chapter one · a note for you</Eyebrow>
    <h1 className="display-title small">A little corner of the world, <em>just for you.</em></h1>
    <p className="lead">No big speech. No expectations. Just a few thoughts, memories and a question from me to you.</p>
    <PrimaryLink to="/story">Let's begin</PrimaryLink>
  </PageFrame>
}

function Story() {
  return <PageFrame className="content-page">
    <Eyebrow>Chapter two · the story</Eyebrow>
    <h1 className="display-title small">Little moments, <em>dear memories.</em></h1>
    <p className="lead narrow">Some moments look small while they're happening. Later, they become the ones we hold close.</p>
    <div className="timeline">{chapters.map((item, i) => <motion.article className="timeline-item" key={item.title} initial={{ opacity: 0, x: i % 2 ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * .12 }}>
      <div className="timeline-dot"><Heart size={13} fill="currentColor" /></div><div className="timeline-card"><span className="timeline-date">{item.date}</span><h3>{item.title}</h3><p>{item.text}</p></div>
    </motion.article>)}</div>
    <PrimaryLink to="/letter">A note from my heart</PrimaryLink>
  </PageFrame>
}

function Letter() {
  const [opened, setOpened] = useState(false)
  return <PageFrame className="center-page">
    <Eyebrow>Chapter three · from my heart</Eyebrow>
    <h1 className="display-title small">A few words, <em>for you.</em></h1>
    {!opened ? <button className="letter-envelope" onClick={() => setOpened(true)}><span className="letter-seal"><Heart fill="currentColor" /></span><span>Tap to open your letter</span><span className="envelope-hint">with love · {senderName}</span></button> :
      <motion.article className="letter-paper" initial={{ opacity: 0, scale: .92, rotateX: 12 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: .7 }}>
        <div className="letter-top">A letter for Shreya <Heart size={15} fill="currentColor" /></div>
        <p className="letter-copy">{loveLetter}</p>
        <div className="letter-bottom">always with warmth <span>♡</span></div>
      </motion.article>}
    <div className="below-link"><PrimaryLink to="/memories">Our little gallery</PrimaryLink></div>
  </PageFrame>
}

function Memories() {
  const [active, setActive] = useState(0)
  const [showCaption, setShowCaption] = useState(false)
  const item = memories[active]
  return <PageFrame className="content-page">
    <Eyebrow>Chapter four · little keepsakes</Eyebrow>
    <h1 className="display-title small">A gallery of <em>what matters.</em></h1>
    <p className="lead narrow">Replace these frames with your favourite photographs. The memories are yours to add.</p>
    <div className="memory-stage">
      <button className="memory-photo" onClick={() => setShowCaption(v => !v)} aria-label="Reveal photo caption">
        <img src={item.src} alt={item.caption} onError={e => { e.currentTarget.style.display = 'none' }} />
        <div className="photo-placeholder"><Camera size={30} /><span>Add your photo</span><small>{item.src}</small></div>
        <div className="photo-caption">{showCaption ? item.caption : 'Tap the photo for its note'}</div>
      </button>
    </div>
    <div className="gallery-controls"><button className="round-control" onClick={() => { setActive((active + memories.length - 1) % memories.length); setShowCaption(false) }}><ArrowLeft /></button><span>{String(active + 1).padStart(2, '0')} <i>/</i> {String(memories.length).padStart(2, '0')}</span><button className="round-control" onClick={() => { setActive((active + 1) % memories.length); setShowCaption(false) }}><ArrowRight /></button></div>
    <PrimaryLink to="/surprise">One more surprise</PrimaryLink>
  </PageFrame>
}

function Surprise() {
  const [open, setOpen] = useState(false)
  return <PageFrame className="center-page">
    <Eyebrow>Chapter five · just because</Eyebrow>
    <h1 className="display-title small">A little something <em>for you.</em></h1>
    <button className={`gift-button ${open ? 'gift-open' : ''}`} onClick={() => setOpen(true)} aria-label="Open the surprise gift"><Gift size={78} strokeWidth={1} /><span className="gift-spark">✦</span></button>
    {open ? <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="gift-message"><h2>One thing I know…</h2><p>If I could choose one person to create beautiful memories with, I would choose you again and again.</p><div className="rose-line">❧ ❀ ❧</div></motion.div> : <p className="lead">There's a tiny surprise waiting inside. Tap to open it.</p>}
    <PrimaryLink to="/proposal">The question</PrimaryLink>
  </PageFrame>
}

function Proposal() {
  const [answer, setAnswer] = useState('')
  const [showMoment, setShowMoment] = useState(false)
  return <PageFrame className="proposal-page">
    <div className="proposal-moon" />
    <div className="proposal-roses">❧ ❀ ❧</div>
    <Eyebrow>The last chapter · from {senderName}</Eyebrow>
    <h1 className="proposal-name">Shreya<span>❤️</span></h1>
    <p className="proposal-copy">{proposalMessage}</p>
    {!answer ? <>
      <div className="ring-box"><div className="ring-glow" /><div className="ring">◇</div></div>
      <h2 className="proposal-question">Will you be mine?</h2>
      <div className="proposal-actions"><button className="yes-button" onClick={() => setAnswer('yes')}>Yes, let's see where love takes us <Heart size={17} fill="currentColor" /></button><button className="soft-button" onClick={() => setShowMoment(true)}>I need a moment</button></div>
      {showMoment && <motion.p className="gentle-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Of course. Take all the time you need, Shreya. Your feelings matter. ❤️</motion.p>}
    </> : <motion.div className="celebration" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }}><div className="celebration-heart"><Heart size={56} fill="currentColor" /></div><h2>That means so much. ❤️</h2><p>Thank you for sharing this moment with me. Here's to kindness, honesty and beautiful memories ahead.</p><div className="confetti">{Array.from({ length: 30 }, (_, i) => <span key={i} style={{ '--i': i }}>♥</span>)}</div><PrimaryLink to="/final">One last little note</PrimaryLink></motion.div>}
  </PageFrame>
}

function FinalPage() {
  return <PageFrame className="center-page">
    <div className="final-heart"><Heart size={54} fill="currentColor" /></div>
    <Eyebrow>the end of this little journey</Eyebrow>
    <h1 className="display-title small">Thank you for being <em>you, Shreya.</em></h1>
    <p className="lead">Whatever tomorrow brings, I hope it brings you happiness, peace and reasons to smile.</p>
    <p className="signature">With warmth, {senderName}</p>
    <NavLink to="/" className="text-link"><RotateCcw size={15} /> Replay the journey</NavLink>
    <NavLink to="/qr" className="text-link"><QrCode size={15} /> Create your QR keepsake</NavLink>
  </PageFrame>
}

function QRPage() {
  const url = window.location.origin
  const local = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  const canvasRef = useRef(null)
  const download = () => {
    const canvas = document.querySelector('#proposal-qr canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'shreya-proposal-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); alert('Website link copied!') }
    catch { alert(`Copy this link: ${url}`) }
  }
  return <PageFrame className="center-page qr-page">
    <Eyebrow>A little surprise to share</Eyebrow>
    <h1 className="display-title small">A scan away from <em>a story.</em></h1>
    <p className="lead narrow">Let Shreya scan this code to open the whole experience.</p>
    <div className="qr-card">
      <div id="proposal-qr" className="qr-code"><QRCodeCanvas value={url} size={240} level="H" includeMargin bgColor="#fffaf7" fgColor="#4a1026" /></div>
      <div className="qr-caption"><Heart size={13} fill="currentColor" /> made with love for Shreya</div>
    </div>
    {local && <p className="warning-note">You're viewing this on localhost. Deploy the site first, then reopen this page to generate a QR code that works for Shreya.</p>}
    <div className="qr-actions"><button className="primary-button" onClick={download} disabled={local}><Download size={16} /> Download QR PNG</button><button className="secondary-button" onClick={copy}><Copy size={16} /> Copy website link</button></div>
    <p className="microcopy">Test the QR code with another phone before sharing or printing.</p>
  </PageFrame>
}

function NotFound() { return <PageFrame className="center-page"><h1 className="display-title small">This page wandered off.</h1><PrimaryLink to="/">Back to the beginning</PrimaryLink></PageFrame> }

const navItems = [
  ['/hello', 'Hello', Mail], ['/story', 'Our story', Stars], ['/letter', 'Letter', Heart],
  ['/memories', 'Memories', Camera], ['/surprise', 'Surprise', Gift], ['/proposal', 'Proposal', Sparkles]
]

export default function App() {
  const location = useLocation()
  return <Shell>
    <nav className="chapter-nav" aria-label="Journey chapters">
      {navItems.map(([path, label, Icon]) => <NavLink key={path} to={path} className={({ isActive }) => `chapter-link ${isActive ? 'active' : ''}`} title={label}><Icon size={14} /><span>{label}</span></NavLink>)}
    </nav>
    <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
      <Route path="/" element={<Welcome />} /><Route path="/hello" element={<Hello />} /><Route path="/story" element={<Story />} />
      <Route path="/letter" element={<Letter />} /><Route path="/memories" element={<Memories />} /><Route path="/surprise" element={<Surprise />} />
      <Route path="/proposal" element={<Proposal />} /><Route path="/final" element={<FinalPage />} /><Route path="/qr" element={<QRPage />} /><Route path="*" element={<NotFound />} />
    </Routes></AnimatePresence>
    <div className="bottom-qr"><NavLink to="/qr"><QrCode size={13} /> QR keepsake</NavLink></div>
  </Shell>
}