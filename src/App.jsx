import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import samplePhoto1 from './assets/photo-1.svg';
import samplePhoto2 from './assets/photo-2.svg';
import samplePhoto3 from './assets/photo-3.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const localMedia = Object.entries(
  import.meta.glob('./assets/custom/*.{jpg,jpeg,png,webp,mp4,mp3,mpeg}', {
    eager: true,
    as: 'url'
  })
).map(([path, src]) => {
  const name = path.split('/').pop();
  return {
    _id: `local-${name}`,
    url: src,
    caption: name.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, ''),
    type: /\.(mp4|webm|ogg|mpeg)$/i.test(src) ? 'video' : /\.(mp3)$/i.test(src) ? 'audio' : 'image'
  };
});

function App() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [letters, setLetters] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showWishForm, setShowWishForm] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [wishData, setWishData] = useState({ name: '', message: '' });

  // ============ PERSONALIZE HERE ============
  const FRIEND_NAME = "Sakshi"; // 👈 CHANGE THIS TO YOUR FRIEND'S NAME
  const YOUR_NAME = "Nisarga";    // 👈 CHANGE THIS TO YOUR NAME
  const BIRTHDAY_MESSAGE = "Thank you for existing in my life the way you do. 🤍"; // 👈 CHANGE THIS

  const fallbackPhotos = [
    { _id: 'fallback-1', url: samplePhoto1, caption: 'Sweet snapshot of a fun day', type: 'image' },
    { _id: 'fallback-2', url: samplePhoto2, caption: 'Beautiful memories we share', type: 'image' },
    { _id: 'fallback-3', url: samplePhoto3, caption: 'A moment worth celebrating', type: 'image' }
  ];

  const fallbackLetters = [
    {
      _id: 'fallback-poem-1',
      title: 'A Quiet Storm',
      content: `You carry storms so quietly
that people mistake you for calm,
while I see galaxies in your silence
and poetry in everything you are.

Sakshi,
you were never meant
to shrink yourself
to fit inside people’s opinions.

The moon never asks the sky
if it is beautiful enough to shine,
the flowers never bloom
for the approval of strangers,
then why should you?

There is a softness in your soul
that this world does not deserve completely,
and yet you still choose kindness
like your heart has never been hurt before.

I hope one day
you stop looking into mirrors
searching for flaws
that only cruel eyes could create.

Because the truth is—
your beauty was never just your face,
it lives in your heart,
your laugh,
your care,
your existence.

And if people fail to see it,
let them remain blind.

Do not let temporary voices
make you question
the permanent magic within you.

You are art, Sakshi.
Not everyone understands art.
But that never makes it any less beautiful.`,
    },
    {
      _id: 'fallback-poem-2',
      title: 'Unspoken Thanks',
      content: `There are a lot of things
I never really said out loud.

Like how talking to you
became a part of my day
without me even realizing it.

Or how some days felt lighter
just because you were around.

I never told you properly,
but your presence matters.
More than you probably know.

It was always the small things—
the random conversations,
your stupid jokes,
the way you stayed
even when I wasn’t easy to deal with.

And maybe I got too used to that.

I think that’s why
the distance feels strange now.

But before anything changes more,
I just wanted to say thank you.

For every moment
you were there without trying too hard,
and for being someone
who made life feel a little softer.`,
    },
    {
      _id: 'fallback-poem-3',
      title: 'Borrow My Eyes',
      content: `You look at yourself
like someone searching for flaws
in a masterpiece,
while I stand here
wondering how someone so beautiful
can be so unaware of it.

You notice the things
you wish were different,
the insecurities,
the moments you think made you less worthy.

But I notice
the way your eyes soften
when you genuinely care,
the way your laughter feels real enough
to heal heavy days,
the way your silence
still carries warmth.

You see an ordinary girl.
I see someone
with the kind of soul
people write poetry about.

And maybe that is the saddest thing—
how harshly you see yourself,
while the world around you
quietly admires everything you are.

If only you could borrow my eyes
for a moment,
you would finally understand
why your presence feels like comfort,
why your existence feels important,
why losing you would feel
like losing a piece of peace.

You do not see yourself
the way I do.

Because if you did,
you would stop doubting
whether you were enough.

You always were.`,
    },
  ];

  const displayedPhotos = photos.length > 0 ? photos : localMedia.length > 0 ? localMedia : fallbackPhotos;
  const displayedLetters = letters.length > 0 ? letters : fallbackLetters;
  const poemCards = [...displayedLetters.slice(0, 3)];
  while (poemCards.length < 3) {
    poemCards.push({
      _id: `poem-placeholder-${poemCards.length + 1}`,
      title: `Poem ${poemCards.length + 1}`,
      content: 'Paste your poem here to make this section even more special.',
    });
  }
  const isUsingLocalMedia = photos.length === 0 && localMedia.length > 0;
  const directLetter = displayedLetters[0] || { content: '' };
  const directLetterPreview = directLetter.content.length > 360 && !showFullLetter
    ? directLetter.content.slice(0, 360) + '...'
    : directLetter.content;
  const canToggleLetter = directLetter.content.length > 360;

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setLoading(false);
      triggerConfetti();
    }, 2000);
  }, []);

  const fetchData = async () => {
    try {
      const [photosRes, lettersRes, timelineRes] = await Promise.all([
        axios.get(`${API_URL}/api/photos`),
        axios.get(`${API_URL}/api/letters`),
        axios.get(`${API_URL}/api/timeline`)
      ]);
      setPhotos(photosRes.data);
      setLetters(lettersRes.data);
      setTimeline(timelineRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B9D', '#C44569', '#FFC3A0']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6B9D', '#C44569', '#FFC3A0']
      });
    }, 30);
  };

  const submitWish = async () => {
    try {
      await axios.post(`${API_URL}/api/wishes`, wishData);
      toast.success('Your wish has been submitted! 💝');
      setWishData({ name: '', message: '' });
      setShowWishForm(false);
    } catch (error) {
      toast.error('Failed to submit wish');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-pink-200 to-rose-300 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🎂
          </motion.div>
          <h1 className="text-5xl font-script text-pink-600">
            Loading Something Special...
          </h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <Toaster position="top-right" />

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400 opacity-30 pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 10}px`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity
            }}
          >
            ❤️
          </motion.div>
        ))}

        <div className="text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-script text-pink-600 mb-6"
          >
            Happy Birthday
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-6xl md:text-8xl font-elegant text-rose-700 mb-8"
          >
            {FRIEND_NAME} 🎂
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-8"
          >
            {BIRTHDAY_MESSAGE}
          </motion.p>

          <motion.button
            onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg"
          >
            Explore Our Memories ✨
          </motion.button>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-script text-center text-pink-600 mb-16"
          >
            Our Beautiful Memories 📸
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedPhotos.map((photo, index) => (
                <motion.div
                  key={photo._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-lg"
                >
                  {photo.type === 'audio' || /\.(mp3)$/i.test(photo.url) ? (
                    <div className="w-full h-80 flex items-center justify-center bg-gray-100 p-4">
                      <audio src={photo.url} controls className="w-full" />
                    </div>
                  ) : photo.type === 'video' || /\.(mp4|webm|ogg|mpeg)$/i.test(photo.url) ? (
                    <video
                      src={photo.url}
                      controls
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold">{photo.caption}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
          {isUsingLocalMedia && (
            <div className="text-center mt-10">
              <p className="text-lg text-gray-500">Local photos/videos from <code>src/assets/custom</code> are being used.</p>
            </div>
          )}
          {photos.length === 0 && !isUsingLocalMedia && (
            <div className="text-center mt-10">
              <p className="text-lg text-gray-500">Sample photos are shown until you upload your own birthday memories.</p>
            </div>
          )}
        </div>
      </section>

      {/* POEMS SECTION */}
      <section className="py-24 px-4 bg-gradient-to-b from-pink-50 via-white to-rose-50 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-pink-200/40 to-transparent pointer-events-none" />
        <div className="absolute left-1/2 top-20 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl opacity-80 -translate-x-1/2 pointer-events-none" />
        <div className="absolute right-10 bottom-10 w-60 h-60 rounded-full bg-pink-200/30 blur-3xl opacity-80 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-script text-center text-pink-600 mb-4"
          >
            Poems From Nisarga For You 🌸
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Tap into each poem to feel the quiet thoughts, wishes, and memories written especially for your birthday.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {poemCards.map((letter, index) => (
                <motion.div
                  key={letter._id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, scale: 1.01 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, type: 'spring', stiffness: 120 }}
                  onClick={() => setSelectedLetter(letter)}
                  className="group bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] cursor-pointer border border-pink-100 shadow-[0_25px_80px_rgba(219,39,119,0.12)] hover:border-pink-200 transition-all"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-100 text-5xl mb-6 shadow-inner">
                    🌿
                  </div>
                  <h3 className="text-2xl font-elegant text-gray-800 mb-3">{letter.title}</h3>
                  <p className="text-gray-600 leading-relaxed min-h-[6rem]">{letter.content?.slice(0, 120) || 'Tap to open this gentle poem...'}</p>
                  <div className="mt-6 flex items-center justify-between text-pink-600 font-semibold">
                    <span>Read the poem</span>
                    <span className="text-2xl">→</span>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECT LETTER SECTION */}
      <section className="py-24 px-4 bg-gradient-to-b from-rose-50 via-white to-pink-50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-script text-center text-pink-600 mb-4"
          >
            A Letter from {YOUR_NAME}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            This special message is written just for {FRIEND_NAME}. Read it here anytime, without opening the card.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white/95 backdrop-blur-xl border border-pink-100 rounded-[2.5rem] shadow-[0_40px_120px_rgba(219,39,119,0.18)] p-10"
          >
            <div className="text-pink-600 text-lg font-semibold mb-4">Dear {FRIEND_NAME},</div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{directLetterPreview}</p>
            {canToggleLetter && (
              <button
                onClick={() => setShowFullLetter(!showFullLetter)}
                className="mt-6 inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-pink-700"
              >
                {showFullLetter ? 'Show less' : 'Read more'}
              </button>
            )}
            <div className="mt-10 text-right text-pink-600 font-semibold">— {YOUR_NAME}</div>
          </motion.div>
        </div>
      </section>

      {/* WISH FORM */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-script text-pink-600 mb-8">
            Send Your Birthday Wishes 🎉
          </h2>

          {!showWishForm ? (
            <button
              onClick={() => setShowWishForm(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-full text-lg font-semibold"
            >
              Write a Wish
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-50 p-8 rounded-3xl"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={wishData.name}
                onChange={(e) => setWishData({ ...wishData, name: e.target.value })}
                className="w-full p-4 rounded-lg mb-4 border-2 border-pink-200 focus:border-pink-500 outline-none"
              />
              <textarea
                placeholder="Your Birthday Message..."
                value={wishData.message}
                onChange={(e) => setWishData({ ...wishData, message: e.target.value })}
                rows="5"
                className="w-full p-4 rounded-lg mb-4 border-2 border-pink-200 focus:border-pink-500 outline-none"
              />
              <div className="flex gap-4">
                <button
                  onClick={submitWish}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold"
                >
                  Send Wish 💝
                </button>
                <button
                  onClick={() => setShowWishForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* PHOTO MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            {selectedPhoto.type === 'audio' || /\.(mp3)$/i.test(selectedPhoto.url) ? (
              <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                <audio src={selectedPhoto.url} controls autoPlay className="w-full" />
                <p className="mt-4 text-center text-white">{selectedPhoto.caption}</p>
              </div>
            ) : selectedPhoto.type === 'video' || /\.(mp4|webm|ogg|mpeg)$/i.test(selectedPhoto.url) ? (
              <video
                src={selectedPhoto.url}
                controls
                autoPlay
                className="max-w-4xl max-h-[90vh] rounded-lg"
              />
            ) : (
              <motion.img
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-w-4xl max-h-[90vh] rounded-lg"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* POEM MODAL */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLetter(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white via-pink-50 to-rose-50 max-w-3xl w-full rounded-[2.5rem] shadow-[0_40px_120px_rgba(219,39,119,0.25)] border border-pink-100 p-12 relative my-8"
            >
              <button
                onClick={() => setSelectedLetter(null)}
                className="absolute top-6 right-6 text-3xl text-gray-600 hover:text-pink-600"
              >
                ✕
              </button>

              <h2 className="text-4xl font-script text-pink-600 mb-6 text-center">
                {selectedLetter.title}
              </h2>

              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {selectedLetter.content}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-8 text-center">
        <p className="text-2xl font-script mb-2">
          Made with ❤️ by {YOUR_NAME}
        </p>
        <p className="text-sm opacity-80">For the most amazing {FRIEND_NAME} 🎂</p>
      </footer>
    </div>
  );
}

export default App;