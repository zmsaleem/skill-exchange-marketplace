require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

async function main() {
  await connectDB();

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('Collections cleared.');

  // Create users
  const users = await User.create([
    {
      name: 'Alice Instructor',
      email: 'alice@example.com',
      password: 'password123',
      role: 'instructor',
      bio: 'Experienced software engineer and educator with 10+ years of teaching programming.',
      skillsToTeach: ['JavaScript', 'Python', 'React'],
    },
    {
      name: 'Bob Learner',
      email: 'bob@example.com',
      password: 'password123',
      role: 'learner',
      bio: 'Passionate learner eager to expand my skills in tech and music.',
      skillsToTeach: [],
    },
    {
      name: 'Carol Both',
      email: 'carol@example.com',
      password: 'password123',
      role: 'both',
      bio: 'Graphic designer who loves to teach design principles and learn new languages.',
      skillsToTeach: ['Figma', 'Adobe Illustrator', 'UI/UX Design'],
    },
  ]);

  const [alice, bob, carol] = users;
  console.log('Users created.');

  // Create skills
  const skills = await Skill.create([
    {
      title: 'Introduction to JavaScript',
      description:
        'Learn the fundamentals of JavaScript including variables, functions, loops, and DOM manipulation. Perfect for beginners who want to start their web development journey.',
      category: 'Programming',
      availability: 'Weekends',
      instructor: alice._id,
    },
    {
      title: 'Python for Data Science',
      description:
        'Master Python programming with a focus on data analysis using pandas, numpy, and matplotlib. Includes hands-on projects with real datasets.',
      category: 'Programming',
      availability: 'Evenings',
      instructor: alice._id,
    },
    {
      title: 'React.js Fundamentals',
      description:
        'Build modern web applications with React. Covers components, state management, hooks, and connecting to APIs. Suitable for those with basic JavaScript knowledge.',
      category: 'Programming',
      availability: 'Flexible',
      instructor: alice._id,
    },
    {
      title: 'UI/UX Design Principles',
      description:
        'Discover the core principles of user interface and user experience design. Learn to create wireframes, prototypes, and conduct usability testing using Figma.',
      category: 'Design',
      availability: 'Weekdays',
      instructor: carol._id,
    },
    {
      title: 'Spanish for Beginners',
      description:
        'Start your Spanish language journey with conversational Spanish covering greetings, common phrases, grammar basics, and everyday vocabulary.',
      category: 'Language',
      availability: 'Weekends',
      instructor: carol._id,
    },
    {
      title: 'Business Communication Skills',
      description:
        'Enhance your professional communication with techniques for effective presentations, emails, negotiations, and team collaboration in a business setting.',
      category: 'Business',
      availability: 'Evenings',
      instructor: carol._id,
    },
  ]);

  const [jsSkill, pythonSkill, reactSkill, uiSkill, spanishSkill, businessSkill] = skills;
  console.log('Skills created.');

  // Create completed bookings so reviews can be made
  const bookings = await Booking.create([
    {
      skill: jsSkill._id,
      learner: bob._id,
      instructor: alice._id,
      date: new Date('2024-01-15'),
      status: 'completed',
      message: 'Looking forward to learning JavaScript!',
    },
    {
      skill: pythonSkill._id,
      learner: bob._id,
      instructor: alice._id,
      date: new Date('2024-02-10'),
      status: 'completed',
      message: 'Excited to dive into data science.',
    },
    {
      skill: uiSkill._id,
      learner: bob._id,
      instructor: carol._id,
      date: new Date('2024-03-05'),
      status: 'completed',
      message: 'I want to improve my design skills.',
    },
    {
      skill: reactSkill._id,
      learner: bob._id,
      instructor: alice._id,
      date: new Date('2024-04-20'),
      status: 'accepted',
      message: 'Ready to learn React!',
    },
    {
      skill: spanishSkill._id,
      learner: alice._id,
      instructor: carol._id,
      date: new Date('2024-05-01'),
      status: 'completed',
      message: 'Hola! I want to learn Spanish.',
    },
  ]);
  console.log('Bookings created.');

  // Create reviews (only for completed bookings)
  await Review.create([
    {
      skill: jsSkill._id,
      reviewer: bob._id,
      instructor: alice._id,
      rating: 5,
      comment:
        'Alice is an amazing teacher! Her explanations are clear and she is very patient. I went from knowing nothing to building my first website.',
    },
    {
      skill: pythonSkill._id,
      reviewer: bob._id,
      instructor: alice._id,
      rating: 4,
      comment:
        'Great course on Python and data science. The hands-on projects really helped solidify my understanding. Would recommend to anyone interested in data.',
    },
    {
      skill: uiSkill._id,
      reviewer: bob._id,
      instructor: carol._id,
      rating: 5,
      comment:
        'Carol has a fantastic eye for design and explains concepts so intuitively. The Figma exercises were incredibly helpful.',
    },
    {
      skill: spanishSkill._id,
      reviewer: alice._id,
      instructor: carol._id,
      rating: 4,
      comment:
        'Carol makes learning Spanish fun and engaging. I already feel confident having basic conversations. ¡Muchas gracias!',
    },
  ]);
  console.log('Reviews created.');

  console.log('\n✅ Seed data inserted successfully!');
  console.log('Sample credentials:');
  console.log('  Instructor - alice@example.com / password123');
  console.log('  Learner    - bob@example.com   / password123');
  console.log('  Both       - carol@example.com / password123');

  await mongoose.disconnect();
  console.log('MongoDB disconnected.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
