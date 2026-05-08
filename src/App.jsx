import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaMusic } from 'react-icons/fa'
import confetti from 'canvas-confetti'
import { gallery } from '../public/data/gallery'
import { letters } from '../public/data/letters'
import { timeline } from '../public/data/timeline'

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="relative">
      <FloatingHearts />
      <MusicPlayer />
      <Hero />
      <PhotoGallery />
      <Timeline />
      <VideoSection />
      <LettersSection />
      <FinalMessage />
    </div>
  )
}

// ============================================
// LOADING SCREEN
// ============================================
const LoadingScreen = () => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300"
    >
      <div className="text-center">
        {/* Animated Cake */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-9xl mb-8"
        >
          🎂
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-4xl font-dancing text-pink-600 mb-4"
        >
          Loading something special{dots}
        </motion.h2>

        {/* Floating Hearts */}
        <div className="flex justify-center gap-4 text-4xl">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              💖
            </motion.span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-pink-200 rounded-full mt-8 mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// HERO SECTION
// ============================================
const Hero = () => {
  const [showSubtitle, setShowSubtitle] = useState(false)

  useEffect(() => {
    // Confetti animation
    const duration = 3 * 1000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ec4899', '#f472b6', '#fbcfe8']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#f472b6', '#fbcfe8']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    setTimeout(() => setShowSubtitle(true), 1000)
  }, [])

  const scrollToGallery = () => {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: 0.1,
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {['💖', '✨', '🎂', '🎈', '🌸', '💫'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 1
          }}
          className="text-7xl md:text-9xl font-playfair font-bold mb-6 glow gradient-text"
        >
          Happy Birthday
        </motion.h1>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-6xl md:text-8xl font-dancing text-pink-600 mb-8"
        >
          Beautiful Soul 💖
        </motion.div>

        {showSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl md:text-2xl font-poppins text-pink-700 mb-12 max-w-2xl mx-auto"
          >
            Today we celebrate YOU and all the magic you bring to this world ✨
          </motion.p>
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToGallery}
          className="px-8 py-4 bg-pink-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 "
        >
          Explore Your Special Day 🎁
        </motion.button>

        {/* Floating Birthday Cake */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mt-12"
        >
          🎂
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-pink-600 text-4xl">↓</div>
      </motion.div>
    </section>
  )
}

// ============================================
// PHOTO GALLERY
// ============================================
const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-pink-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-6xl font-playfair font-bold text-pink-600 mb-4">
          Our Beautiful Memories 📸
        </h2>
        <p className="text-xl text-pink-500 font-poppins">
          Every picture tells our story
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {gallery.map((image, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
            className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Memory ${index + 1}`}
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23fbcfe8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23ec4899">Photo ${index + 1}</text></svg>`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-600/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <p className="text-white font-semibold p-4 text-lg">
                Memory #{index + 1}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <motion.img
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            src={selectedImage}
            alt="Selected"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-pink-400 transition-colors"
          >
            ✕
          </button>
        </motion.div>
      )}
    </section>
  )
}

// ============================================
// TIMELINE
// ============================================
const Timeline = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-6xl font-playfair font-bold text-pink-600 mb-4">
          Our Journey Together 🌸
        </h2>
        <p className="text-xl text-pink-500 font-poppins">
          Every step of our beautiful story
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 hidden md:block" />

        {timeline.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className={`relative mb-16 md:mb-24 ${
              index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'
            }`}
          >
            <div className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
              {/* Content */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-1 glass p-6 rounded-2xl shadow-xl"
              >
                <span className="inline-block px-4 py-1 bg-pink-500 text-white rounded-full text-sm font-semibold mb-3">
                  {item.date}
                </span>
                <h3 className="text-2xl font-playfair font-bold text-pink-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-pink-600 font-poppins">
                  {item.description}
                </p>
              </motion.div>

              {/* Center Dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                <motion.div
                  whileHover={{ scale: 1.5 }}
                  className="w-6 h-6 bg-pink-500 rounded-full border-4 border-white shadow-lg"
                />
              </div>

              {/* Image */}
              <motion.div
                whileHover={{ rotate: Math.random() * 10 - 5 }}
                className="flex-1"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-2xl shadow-xl"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23fbcfe8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%23ec4899">${item.title}</text></svg>`
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ============================================
// VIDEO SECTION
// ============================================
const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)

  const videos = [
    {
      src: "/videos/memory1.mp4",
      title: "Our First Adventure",
      thumbnail: "/images/photo1.jpg"
    },
    {
      src: "/videos/memory2.mp4",
      title: "Unforgettable Moments",
      thumbnail: "/images/photo2.jpg"
    },
    {
      src: "/videos/memory3.mp4",
      title: "Beautiful Times",
      thumbnail: "/images/photo3.jpg"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-pink-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-6xl font-playfair font-bold text-pink-600 mb-4">
          Video Memories 🎬
        </h2>
        <p className="text-xl text-pink-500 font-poppins">
          Relive our favorite moments together
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ y: -10 }}
            className="relative group cursor-pointer"
            onClick={() => setSelectedVideo(video.src)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23fbcfe8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23ec4899">Video ${index + 1}</text></svg>`
                }}
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all duration-300">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <FaPlay className="text-white text-2xl ml-1" />
                </motion.div>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">
                  {video.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg shadow-2xl"
            >
              Your browser doesn't support video playback.
            </video>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-pink-400 transition-colors"
            >
              ✕ Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

// ============================================
// LETTERS SECTION
// ============================================
const LettersSection = () => {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [displayedText, setDisplayedText] = useState('')

  const openLetter = (letter) => {
    setSelectedLetter(letter)
    setDisplayedText('')
    
    // Typewriter effect
    let index = 0
    const text = letter.content
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-6xl font-playfair font-bold text-pink-600 mb-4">
          Letters From The Heart 💌
        </h2>
        <p className="text-xl text-pink-500 font-poppins">
          Words that come straight from my soul
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ y: -10, rotate: Math.random() * 6 - 3 }}
            className="cursor-pointer"
            onClick={() => openLetter(letter)}
          >
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 p-8 rounded-lg shadow-xl border-2 border-pink-200 relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
                💌
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-dancing font-bold text-pink-700 mb-4">
                  {letter.title}
                </h3>
                <p className="text-pink-600 font-poppins line-clamp-3">
                  {letter.content.substring(0, 100)}...
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors"
                >
                  Read Letter
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Letter Modal */}
      {selectedLetter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedLetter(null)}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-gradient-to-br from-pink-50 to-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative stamp */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center border-4 border-pink-400 rotate-12">
              <span className="text-3xl">💖</span>
            </div>

            <h3 className="text-4xl font-dancing font-bold text-pink-700 mb-6">
              {selectedLetter.title}
            </h3>
            
            <div className="text-pink-800 font-poppins text-lg leading-relaxed whitespace-pre-line">
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
            </div>

            <button
              onClick={() => setSelectedLetter(null)}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Close Letter
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

// ============================================
// MUSIC PLAYER
// ============================================
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const value = (audio.currentTime / audio.duration) * 100
      setProgress(isNaN(value) ? 0 : value)
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => audio.removeEventListener('timeupdate', updateProgress)
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/music/song.mp3" type="audio/mpeg" />
      </audio>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 z-40 glass p-6 rounded-2xl shadow-2xl w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <FaMusic className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-pink-700">Birthday Song</h3>
                  <p className="text-xs text-pink-500">For you 💖</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-pink-500 hover:text-pink-700 text-xl"
              >
                −
              </button>
            </div>

            <div className="mb-4">
              <div className="w-full h-2 bg-pink-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Player */}
      {isMinimized && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-2xl"
        >
          <FaMusic className={`text-2xl ${isPlaying ? 'animate-pulse' : ''}`} />
        </motion.button>
      )}
    </>
  )
}

// ============================================
// FINAL MESSAGE
// ============================================
const FinalMessage = () => {
  useEffect(() => {
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f472b6', '#fbcfe8', '#fce7f3']
      })
    }

    const interval = setInterval(triggerConfetti, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 py-20 px-4">
      {/* Animated Stars */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 1 }}
          className="mb-12"
        >
          <div className="text-8xl mb-6">🎂🎉🎈</div>
          <h2 className="text-6xl md:text-7xl font-playfair font-bold gradient-text mb-6">
            You Are Loved
          </h2>
          <div className="text-5xl mb-8">💖</div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass p-8 md:p-12 rounded-3xl shadow-2xl mb-12"
        >
          <p className="text-2xl md:text-3xl font-dancing text-pink-700 mb-6 leading-relaxed">
            On this special day, I want you to know that you are cherished beyond words.
          </p>
          <p className="text-lg md:text-xl font-poppins text-pink-600 leading-relaxed">
            May your birthday be filled with endless joy, laughter, and all the love you deserve.
            You make the world a brighter place just by being in it. Here's to celebrating YOU
            today and always! 🎊
          </p>
          <div className="mt-8 text-4xl">🌟💫✨</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <p className="text-3xl font-dancing text-pink-600">
            Wishing you the happiest of birthdays! 🎂
          </p>
          <p className="text-xl font-poppins text-pink-500">
            Made with endless love ❤️
          </p>
          <div className="text-6xl animate-pulse mt-8">
            💝
          </div>
        </motion.div>

        {/* Floating Birthday Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {['🎈', '🎁', '🎊', '🎉', '🍰', '💐'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl"
              initial={{ y: 0, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000) }}
              animate={{
                y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 1000)],
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                rotate: [0, 360],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// FLOATING HEARTS
// ============================================
const FloatingHearts = () => {
  const hearts = [...Array(15)].map((_, i) => ({
    id: i,
    size: Math.random() * 30 + 20,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-400 opacity-20"
          style={{
            fontSize: `${heart.size}px`,
            left: `${heart.left}%`,
            bottom: -50,
          }}
          animate={{
            y: [-50, -(typeof window !== 'undefined' ? window.innerHeight : 1000) - 100],
            x: [0, Math.sin(heart.id) * 100],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          💖
        </motion.div>
      ))}
    </div>
  )
}

export default App