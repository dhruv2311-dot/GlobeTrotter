require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Trip = require('./src/models/Trip');
const City = require('./src/models/City');

const cities = [
  {
    name: 'Paris', country: 'France', region: 'Europe',
    description: 'The City of Light, known for the Eiffel Tower, world-class cuisine, and romantic ambiance.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    costIndex: 8, popularityScore: 98, avgDailyBudget: 180, currency: 'EUR', timezone: 'Europe/Paris',
    language: 'French', bestTimeToVisit: 'April - June, September - October',
    tags: ['romantic', 'culture', 'food', 'art'], coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    name: 'Tokyo', country: 'Japan', region: 'Asia',
    description: 'A vibrant metropolis blending ultra-modern technology with ancient temples and traditions.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    costIndex: 7, popularityScore: 95, avgDailyBudget: 150, currency: 'JPY', timezone: 'Asia/Tokyo',
    language: 'Japanese', bestTimeToVisit: 'March - May, September - November',
    tags: ['culture', 'food', 'technology', 'temples'], coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    name: 'New York', country: 'USA', region: 'North America',
    description: 'The Big Apple — iconic skyline, Broadway shows, Central Park, and endless energy.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    costIndex: 9, popularityScore: 96, avgDailyBudget: 200, currency: 'USD', timezone: 'America/New_York',
    language: 'English', bestTimeToVisit: 'April - June, September - November',
    tags: ['nightlife', 'shopping', 'culture', 'food'], coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    name: 'Bali', country: 'Indonesia', region: 'Asia',
    description: 'Tropical paradise with stunning beaches, lush rice terraces, and spiritual temples.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    costIndex: 3, popularityScore: 90, avgDailyBudget: 60, currency: 'IDR', timezone: 'Asia/Makassar',
    language: 'Indonesian', bestTimeToVisit: 'April - October',
    tags: ['beach', 'adventure', 'spiritual', 'nature'], coordinates: { lat: -8.3405, lng: 115.092 },
  },
  {
    name: 'Dubai', country: 'UAE', region: 'Middle East',
    description: 'City of superlatives — tallest buildings, luxury shopping, and desert adventures.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    costIndex: 8, popularityScore: 88, avgDailyBudget: 190, currency: 'AED', timezone: 'Asia/Dubai',
    language: 'Arabic', bestTimeToVisit: 'November - March',
    tags: ['luxury', 'shopping', 'adventure', 'architecture'], coordinates: { lat: 25.2048, lng: 55.2708 },
  },
  {
    name: 'Rome', country: 'Italy', region: 'Europe',
    description: 'The Eternal City with ancient ruins, Renaissance art, and the best pasta on earth.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    costIndex: 6, popularityScore: 93, avgDailyBudget: 140, currency: 'EUR', timezone: 'Europe/Rome',
    language: 'Italian', bestTimeToVisit: 'April - June, September - October',
    tags: ['history', 'food', 'art', 'culture'], coordinates: { lat: 41.9028, lng: 12.4964 },
  },
  {
    name: 'Bangkok', country: 'Thailand', region: 'Asia',
    description: 'Street food capital with ornate temples, floating markets, and vibrant nightlife.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
    costIndex: 2, popularityScore: 87, avgDailyBudget: 45, currency: 'THB', timezone: 'Asia/Bangkok',
    language: 'Thai', bestTimeToVisit: 'November - February',
    tags: ['food', 'temples', 'nightlife', 'budget'], coordinates: { lat: 13.7563, lng: 100.5018 },
  },
  {
    name: 'London', country: 'UK', region: 'Europe',
    description: 'Historic landmarks, world-class museums, and a thriving multicultural food scene.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    costIndex: 9, popularityScore: 94, avgDailyBudget: 195, currency: 'GBP', timezone: 'Europe/London',
    language: 'English', bestTimeToVisit: 'May - September',
    tags: ['history', 'culture', 'museums', 'shopping'], coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    name: 'Sydney', country: 'Australia', region: 'Oceania',
    description: 'Harbour city with iconic Opera House, stunning beaches, and laid-back lifestyle.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    costIndex: 8, popularityScore: 85, avgDailyBudget: 170, currency: 'AUD', timezone: 'Australia/Sydney',
    language: 'English', bestTimeToVisit: 'September - November, March - May',
    tags: ['beach', 'nature', 'adventure', 'food'], coordinates: { lat: -33.8688, lng: 151.2093 },
  },
  {
    name: 'Jaipur', country: 'India', region: 'Asia',
    description: 'The Pink City — majestic forts, colorful bazaars, and rich Rajasthani culture.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    costIndex: 2, popularityScore: 80, avgDailyBudget: 35, currency: 'INR', timezone: 'Asia/Kolkata',
    language: 'Hindi', bestTimeToVisit: 'October - March',
    tags: ['history', 'culture', 'architecture', 'budget'], coordinates: { lat: 26.9124, lng: 75.7873 },
  },
];

const tripsData = [
  {
    tripName: 'Parisian Dreams',
    description: 'A romantic week exploring the art, food, and charm of Paris.',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
    startDate: '2026-04-10', endDate: '2026-04-17', currency: 'EUR', isPublic: true,
    tags: ['romantic', 'culture', 'food'],
    stops: [{
      city: 'Paris', country: 'France', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      startDate: '2026-04-10', endDate: '2026-04-17', accommodation: 'Hotel Le Marais',
      activities: [
        { name: 'Eiffel Tower Visit', category: 'sightseeing', cost: 26, duration: 3, startTime: '10:00', description: 'Climb to the top of the iconic tower' },
        { name: 'Louvre Museum', category: 'culture', cost: 17, duration: 4, startTime: '09:00', description: 'See the Mona Lisa and thousands of masterpieces' },
        { name: 'Seine River Cruise', category: 'sightseeing', cost: 15, duration: 1.5, startTime: '18:00', description: 'Sunset cruise along the Seine' },
        { name: 'French Cooking Class', category: 'food', cost: 85, duration: 3, startTime: '14:00', description: 'Learn to make croissants and macarons' },
      ]
    }],
  },
  {
    tripName: 'Tokyo Adventure',
    description: 'Discover the perfect blend of ancient tradition and futuristic innovation.',
    coverPhoto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    startDate: '2026-05-01', endDate: '2026-05-08', currency: 'JPY', isPublic: true,
    tags: ['culture', 'food', 'technology'],
    stops: [{
      city: 'Tokyo', country: 'Japan', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      startDate: '2026-05-01', endDate: '2026-05-08', accommodation: 'Shinjuku Capsule Hotel',
      activities: [
        { name: 'Senso-ji Temple', category: 'culture', cost: 0, duration: 2, startTime: '09:00', description: 'Visit Tokyo\'s oldest Buddhist temple' },
        { name: 'Tsukiji Outer Market Food Tour', category: 'food', cost: 40, duration: 3, startTime: '07:00', description: 'Fresh sushi and street food paradise' },
        { name: 'Shibuya Crossing & Harajuku', category: 'sightseeing', cost: 0, duration: 3, startTime: '14:00', description: 'The world\'s busiest crossing and kawaii fashion' },
        { name: 'Robot Restaurant Show', category: 'culture', cost: 55, duration: 2, startTime: '19:00', description: 'Wild neon robot entertainment' },
      ]
    }],
  },
  {
    tripName: 'NYC City Break',
    description: 'Five action-packed days in the city that never sleeps.',
    coverPhoto: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
    startDate: '2026-03-15', endDate: '2026-03-20', currency: 'USD', isPublic: true,
    tags: ['nightlife', 'shopping', 'food'],
    stops: [{
      city: 'New York', country: 'USA', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      startDate: '2026-03-15', endDate: '2026-03-20', accommodation: 'Times Square Hotel',
      activities: [
        { name: 'Statue of Liberty & Ellis Island', category: 'sightseeing', cost: 24, duration: 4, startTime: '09:00', description: 'Ferry to Lady Liberty' },
        { name: 'Broadway Show', category: 'culture', cost: 120, duration: 3, startTime: '19:30', description: 'Catch a hit Broadway musical' },
        { name: 'Central Park Bike Tour', category: 'adventure', cost: 35, duration: 2.5, startTime: '10:00', description: 'Cycle through 843 acres of urban oasis' },
        { name: 'Pizza Walking Tour', category: 'food', cost: 45, duration: 2, startTime: '12:00', description: 'Best NY-style slices in Manhattan' },
      ]
    }],
  },
  {
    tripName: 'Bali Bliss Retreat',
    description: 'Beaches, temples, rice terraces, and total relaxation in tropical paradise.',
    coverPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
    startDate: '2026-06-01', endDate: '2026-06-10', currency: 'USD', isPublic: true,
    tags: ['beach', 'adventure', 'spiritual'],
    stops: [{
      city: 'Bali', country: 'Indonesia', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      startDate: '2026-06-01', endDate: '2026-06-10', accommodation: 'Ubud Villa Resort',
      activities: [
        { name: 'Tegallalang Rice Terraces', category: 'sightseeing', cost: 5, duration: 2, startTime: '08:00', description: 'Walk through stunning emerald-green terraces' },
        { name: 'Uluwatu Temple Sunset', category: 'culture', cost: 3, duration: 2, startTime: '17:00', description: 'Cliff-top temple with Kecak fire dance' },
        { name: 'White Water Rafting', category: 'adventure', cost: 30, duration: 3, startTime: '09:00', description: 'Rafting down the Ayung River' },
        { name: 'Balinese Spa & Massage', category: 'other', cost: 20, duration: 2, startTime: '15:00', description: 'Traditional Balinese healing spa' },
      ]
    }],
  },
  {
    tripName: 'Dubai Luxury Escape',
    description: 'Experience the height of luxury in the city of gold and skyscrapers.',
    coverPhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
    startDate: '2026-11-20', endDate: '2026-11-27', currency: 'USD', isPublic: true,
    tags: ['luxury', 'shopping', 'adventure'],
    stops: [{
      city: 'Dubai', country: 'UAE', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      startDate: '2026-11-20', endDate: '2026-11-27', accommodation: 'Atlantis The Palm',
      activities: [
        { name: 'Burj Khalifa Observation Deck', category: 'sightseeing', cost: 40, duration: 2, startTime: '17:00', description: 'Sunset from the world\'s tallest building' },
        { name: 'Desert Safari & BBQ', category: 'adventure', cost: 65, duration: 5, startTime: '15:00', description: 'Dune bashing, camel rides, and BBQ under the stars' },
        { name: 'Dubai Mall & Aquarium', category: 'shopping', cost: 35, duration: 4, startTime: '10:00', description: 'World\'s largest mall with underwater zoo' },
        { name: 'Dhow Cruise Dinner', category: 'food', cost: 55, duration: 2.5, startTime: '19:30', description: 'Dinner cruise on Dubai Marina' },
      ]
    }],
  },
  {
    tripName: 'Roman Holiday',
    description: 'Walk through centuries of history, art, and incredible Italian cuisine.',
    coverPhoto: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
    startDate: '2026-09-05', endDate: '2026-09-12', currency: 'EUR', isPublic: true,
    tags: ['history', 'food', 'art'],
    stops: [{
      city: 'Rome', country: 'Italy', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      startDate: '2026-09-05', endDate: '2026-09-12', accommodation: 'Hotel Trastevere',
      activities: [
        { name: 'Colosseum & Roman Forum', category: 'sightseeing', cost: 18, duration: 3, startTime: '09:00', description: 'Walk through the ancient gladiator arena' },
        { name: 'Vatican Museums & Sistine Chapel', category: 'culture', cost: 20, duration: 4, startTime: '08:00', description: 'Michelangelo\'s masterpiece ceiling' },
        { name: 'Pasta Making Class', category: 'food', cost: 60, duration: 3, startTime: '11:00', description: 'Learn authentic Roman pasta recipes' },
        { name: 'Trastevere Night Walk', category: 'sightseeing', cost: 0, duration: 2, startTime: '20:00', description: 'Cobblestone streets, gelato, and live music' },
      ]
    }],
  },
  {
    tripName: 'Bangkok Street Food Trail',
    description: 'The ultimate budget-friendly food and temple hopping adventure.',
    coverPhoto: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200',
    startDate: '2026-12-01', endDate: '2026-12-07', currency: 'USD', isPublic: true,
    tags: ['food', 'temples', 'budget'],
    stops: [{
      city: 'Bangkok', country: 'Thailand', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
      startDate: '2026-12-01', endDate: '2026-12-07', accommodation: 'Khao San Road Hostel',
      activities: [
        { name: 'Grand Palace & Wat Phra Kaew', category: 'culture', cost: 15, duration: 3, startTime: '08:30', description: 'Thailand\'s most sacred Buddhist temple' },
        { name: 'Floating Market Tour', category: 'food', cost: 12, duration: 4, startTime: '07:00', description: 'Damnoen Saduak floating market' },
        { name: 'Chinatown Street Food Crawl', category: 'food', cost: 8, duration: 2.5, startTime: '18:00', description: 'Yaowarat Road — the best street food strip' },
        { name: 'Muay Thai Show', category: 'culture', cost: 25, duration: 2, startTime: '20:00', description: 'Watch live Thai boxing at Rajadamnern Stadium' },
      ]
    }],
  },
  {
    tripName: 'London Calling',
    description: 'Tea, history, and theatre — the quintessential British experience.',
    coverPhoto: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200',
    startDate: '2026-07-10', endDate: '2026-07-17', currency: 'GBP', isPublic: true,
    tags: ['history', 'culture', 'museums'],
    stops: [{
      city: 'London', country: 'UK', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
      startDate: '2026-07-10', endDate: '2026-07-17', accommodation: 'Covent Garden B&B',
      activities: [
        { name: 'Tower of London', category: 'sightseeing', cost: 33, duration: 3, startTime: '09:00', description: 'See the Crown Jewels and 1000 years of history' },
        { name: 'British Museum', category: 'culture', cost: 0, duration: 3.5, startTime: '10:00', description: 'Free entry — Rosetta Stone, Egyptian mummies, and more' },
        { name: 'West End Musical', category: 'culture', cost: 75, duration: 3, startTime: '19:30', description: 'World-class theatre in London\'s West End' },
        { name: 'Borough Market Food Tour', category: 'food', cost: 30, duration: 2, startTime: '12:00', description: 'London\'s finest food market since 1756' },
      ]
    }],
  },
  {
    tripName: 'Sydney Coastal Explorer',
    description: 'Sun, surf, and stunning harbour views in Australia\'s most iconic city.',
    coverPhoto: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200',
    startDate: '2026-10-01', endDate: '2026-10-08', currency: 'AUD', isPublic: true,
    tags: ['beach', 'nature', 'adventure'],
    stops: [{
      city: 'Sydney', country: 'Australia', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
      startDate: '2026-10-01', endDate: '2026-10-08', accommodation: 'Bondi Beach Hotel',
      activities: [
        { name: 'Sydney Opera House Tour', category: 'culture', cost: 43, duration: 2, startTime: '10:00', description: 'Behind-the-scenes tour of the iconic sails' },
        { name: 'Bondi to Coogee Coastal Walk', category: 'adventure', cost: 0, duration: 3, startTime: '08:00', description: '6km clifftop walk with ocean pools' },
        { name: 'Harbour Bridge Climb', category: 'adventure', cost: 174, duration: 3.5, startTime: '14:00', description: 'Climb to the summit of the Sydney Harbour Bridge' },
        { name: 'Taronga Zoo Ferry Trip', category: 'sightseeing', cost: 47, duration: 4, startTime: '09:30', description: 'Ferry across the harbour to see native wildlife' },
      ]
    }],
  },
  {
    tripName: 'Royal Rajasthan — Jaipur',
    description: 'Explore the Pink City\'s majestic forts, colorful bazaars, and spicy Rajasthani food.',
    coverPhoto: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200',
    startDate: '2026-12-15', endDate: '2026-12-22', currency: 'INR', isPublic: true,
    tags: ['history', 'culture', 'budget'],
    stops: [{
      city: 'Jaipur', country: 'India', order: 0,
      cityImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
      startDate: '2026-12-15', endDate: '2026-12-22', accommodation: 'Haveli Heritage Stay',
      activities: [
        { name: 'Amber Fort Elephant Ride', category: 'sightseeing', cost: 8, duration: 3, startTime: '09:00', description: 'Majestic hilltop fort with mirror palace' },
        { name: 'Hawa Mahal & City Palace', category: 'culture', cost: 5, duration: 2.5, startTime: '11:00', description: 'The Palace of Winds and royal residence' },
        { name: 'Johari Bazaar Shopping', category: 'shopping', cost: 20, duration: 2, startTime: '16:00', description: 'Gems, textiles, and Rajasthani handicrafts' },
        { name: 'Dal Baati Churma Dinner', category: 'food', cost: 4, duration: 1.5, startTime: '19:30', description: 'Authentic Rajasthani thali experience' },
      ]
    }],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create or find a system user for the trips
    let systemUser = await User.findOne({ email: 'globetrotter@demo.com' });
    if (!systemUser) {
      systemUser = await User.create({
        firstName: 'Globe',
        lastName: 'Trotter',
        email: 'globetrotter@demo.com',
        password: 'GlobeTrotter@2026',
        city: 'Worldwide',
        country: 'Earth',
        bio: 'Official GlobeTrotter demo account showcasing amazing trips around the world!',
        role: 'user',
      });
      console.log('👤 Created demo user: globetrotter@demo.com');
    } else {
      console.log('👤 Demo user already exists');
    }

    // Seed cities
    for (const cityData of cities) {
      const existing = await City.findOne({ name: cityData.name, country: cityData.country });
      if (!existing) {
        await City.create(cityData);
        console.log(`🏙  Added city: ${cityData.name}, ${cityData.country}`);
      } else {
        console.log(`🏙  City already exists: ${cityData.name}`);
      }
    }

    // Seed trips
    const existingTrips = await Trip.countDocuments({ userId: systemUser._id });
    if (existingTrips >= 10) {
      console.log(`✈️  ${existingTrips} demo trips already exist, skipping...`);
    } else {
      // Delete existing demo trips to avoid duplicates
      await Trip.deleteMany({ userId: systemUser._id });
      for (const tripData of tripsData) {
        await Trip.create({ ...tripData, userId: systemUser._id });
        console.log(`✈️  Created trip: ${tripData.tripName}`);
      }
    }

    console.log('\n🎉 Seed complete! 10 trips + 10 cities added.');
    console.log('📧 Demo account: globetrotter@demo.com / GlobeTrotter@2026');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
