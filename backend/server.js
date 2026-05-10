import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'local-secret';
const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

const uploadFolder = path.resolve('uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ Error:', err));

// Cloudinary Config
if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const storage = hasCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'birthday-website',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4']
      }
    })
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadFolder),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
      }
    });

const upload = multer({ storage });

if (!hasCloudinary) {
  app.use('/uploads', express.static(uploadFolder));
}

// Models
const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

const photoSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  caption: String,
  category: String
}, { timestamps: true });

const Photo = mongoose.model('Photo', photoSchema);

const letterSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String
}, { timestamps: true });

const Letter = mongoose.model('Letter', letterSchema);

const timelineSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  image: String
}, { timestamps: true });

const Timeline = mongoose.model('Timeline', timelineSchema);

const wishSchema = new mongoose.Schema({
  name: String,
  message: String,
  approved: { type: Boolean, default: false }
}, { timestamps: true });

const GuestWish = mongoose.model('GuestWish', wishSchema);

// Middleware
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PHOTO ROUTES
app.get('/api/photos', async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.json(photos);
});

app.post('/api/photos', protect, upload.single('photo'), async (req, res) => {
  try {
    const photoData = {
      caption: req.body.caption,
      category: req.body.category,
      publicId: req.file.filename,
      url: hasCloudinary ? req.file.path : `/uploads/${req.file.filename}`
    };

    const photo = await Photo.create(photoData);
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/photos/:id', protect, async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  try {
    if (hasCloudinary && photo.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    } else if (photo.url?.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), photo.url);
      await fs.promises.unlink(filePath).catch(() => null);
    }
  } catch (error) {
    console.warn('Error deleting photo asset:', error);
  }

  await photo.deleteOne();
  res.json({ message: 'Deleted' });
});

// LETTER ROUTES
app.get('/api/letters', async (req, res) => {
  const letters = await Letter.find();
  res.json(letters);
});

app.post('/api/letters', protect, async (req, res) => {
  const letter = await Letter.create(req.body);
  res.json(letter);
});

app.delete('/api/letters/:id', protect, async (req, res) => {
  await Letter.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// TIMELINE ROUTES
app.get('/api/timeline', async (req, res) => {
  const events = await Timeline.find().sort({ date: 1 });
  res.json(events);
});

app.post('/api/timeline', protect, upload.single('image'), async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = hasCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
  const event = await Timeline.create(data);
  res.json(event);
});

// WISH ROUTES
app.get('/api/wishes', async (req, res) => {
  const wishes = await GuestWish.find({ approved: true });
  res.json(wishes);
});

app.post('/api/wishes', async (req, res) => {
  const wish = await GuestWish.create(req.body);
  res.json(wish);
});

app.get('/', (req, res) => {
  res.json({ message: '🎂 Birthday API Running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});