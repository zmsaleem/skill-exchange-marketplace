require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  console.log('Tables cleared.');

  const alicePassword = await bcrypt.hash('password123', 10);
  const bobPassword = await bcrypt.hash('password123', 10);
  const carolPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Instructor',
      email: 'alice@example.com',
      password: alicePassword,
      role: 'instructor',
      bio: 'Experienced software engineer and educator with 10+ years of teaching programming.',
      skillsToTeach: ['JavaScript', 'Python', 'React'],
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Learner',
      email: 'bob@example.com',
      password: bobPassword,
      role: 'learner',
      bio: 'Passionate learner eager to expand my skills in tech and music.',
      skillsToTeach: [],
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: 'Carol Both',
      email: 'carol@example.com',
      password: carolPassword,
      role: 'both',
      bio: 'Graphic designer who loves to teach design principles and learn new languages.',
      skillsToTeach: ['Figma', 'Adobe Illustrator', 'UI/UX Design'],
    },
  });

  const dana = await prisma.user.create({
    data: {
      name: 'Dana Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      bio: 'Admin user with access to manage bookings and users.',
      skillsToTeach: [],
    },
  });

  console.log('Users created.');

  const jsSkill = await prisma.skill.create({
    data: {
      title: 'Introduction to JavaScript',
      description:
        'Learn the fundamentals of JavaScript including variables, functions, loops, and DOM manipulation. Perfect for beginners who want to start their web development journey.',
      category: 'Programming',
      availability: 'Weekends',
      instructorId: alice.id,
    },
  });

  const pythonSkill = await prisma.skill.create({
    data: {
      title: 'Python for Data Science',
      description:
        'Master Python programming with a focus on data analysis using pandas, numpy, and matplotlib. Includes hands-on projects with real datasets.',
      category: 'Programming',
      availability: 'Evenings',
      instructorId: alice.id,
    },
  });

  const reactSkill = await prisma.skill.create({
    data: {
      title: 'React.js Fundamentals',
      description:
        'Build modern web applications with React. Covers components, state management, hooks, and connecting to APIs. Suitable for those with basic JavaScript knowledge.',
      category: 'Programming',
      availability: 'Flexible',
      instructorId: alice.id,
    },
  });

  const uiSkill = await prisma.skill.create({
    data: {
      title: 'UI/UX Design Principles',
      description:
        'Discover the core principles of user interface and user experience design. Learn to create wireframes, prototypes, and conduct usability testing using Figma.',
      category: 'Design',
      availability: 'Weekdays',
      instructorId: carol.id,
    },
  });

  const spanishSkill = await prisma.skill.create({
    data: {
      title: 'Spanish for Beginners',
      description:
        'Start your Spanish language journey with conversational Spanish covering greetings, common phrases, grammar basics, and everyday vocabulary.',
      category: 'Language',
      availability: 'Weekends',
      instructorId: carol.id,
    },
  });

  const businessSkill = await prisma.skill.create({
    data: {
      title: 'Business Communication Skills',
      description:
        'Enhance your professional communication with techniques for effective presentations, emails, negotiations, and team collaboration in a business setting.',
      category: 'Business',
      availability: 'Evenings',
      instructorId: carol.id,
    },
  });

  console.log('Skills created.');

  await prisma.booking.createMany({
    data: [
      {
        skillId: jsSkill.id,
        learnerId: bob.id,
        instructorId: alice.id,
        date: new Date('2024-01-15'),
        status: 'completed',
        message: 'Looking forward to learning JavaScript!',
      },
      {
        skillId: pythonSkill.id,
        learnerId: bob.id,
        instructorId: alice.id,
        date: new Date('2024-02-10'),
        status: 'completed',
        message: 'Excited to dive into data science.',
      },
      {
        skillId: uiSkill.id,
        learnerId: bob.id,
        instructorId: carol.id,
        date: new Date('2024-03-05'),
        status: 'completed',
        message: 'I want to improve my design skills.',
      },
      {
        skillId: reactSkill.id,
        learnerId: bob.id,
        instructorId: alice.id,
        date: new Date('2024-04-20'),
        status: 'accepted',
        message: 'Ready to learn React!',
      },
      {
        skillId: spanishSkill.id,
        learnerId: alice.id,
        instructorId: carol.id,
        date: new Date('2024-05-01'),
        status: 'completed',
        message: 'Hola! I want to learn Spanish.',
      },
    ],
  });

  console.log('Bookings created.');

  await prisma.review.createMany({
    data: [
      {
        skillId: jsSkill.id,
        reviewerId: bob.id,
        instructorId: alice.id,
        rating: 5,
        comment:
          'Alice is an amazing teacher! Her explanations are clear and she is very patient. I went from knowing nothing to building my first website.',
      },
      {
        skillId: pythonSkill.id,
        reviewerId: bob.id,
        instructorId: alice.id,
        rating: 4,
        comment:
          'Great course on Python and data science. The hands-on projects really helped solidify my understanding. Would recommend to anyone interested in data.',
      },
      {
        skillId: uiSkill.id,
        reviewerId: bob.id,
        instructorId: carol.id,
        rating: 5,
        comment:
          'Carol has a fantastic eye for design and explains concepts so intuitively. The Figma exercises were incredibly helpful.',
      },
      {
        skillId: spanishSkill.id,
        reviewerId: alice.id,
        instructorId: carol.id,
        rating: 4,
        comment:
          'Carol makes learning Spanish fun and engaging. I already feel confident having basic conversations. ¡Muchas gracias!',
      },
    ],
  });

  console.log('Reviews created.');

  console.log('\n✅ Seed data inserted successfully!');
  console.log('Sample credentials:');
  console.log('  Instructor - alice@example.com / password123');
  console.log('  Learner    - bob@example.com   / password123');
  console.log('  Both       - carol@example.com / password123');
  console.log('  Admin      - admin@example.com / password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
