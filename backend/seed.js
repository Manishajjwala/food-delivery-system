const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const foodItems = [
  { name: 'Royal Maharaja Thali', category: 'Main Course', price: 350, rating: 4.9, image: '/assets/Main course/thali.jpg' },
  { name: 'Hyderabadi Veg Biryani', category: 'Main Course', price: 280, rating: 4.8, image: '/assets/Main course/veg biryani.jpg' },
  { name: 'Paneer Butter Masala', category: 'Main Course', price: 250, rating: 4.9, image: '/assets/Main course/paneer butter.jpg' },
  { name: 'Dal Makhani Special', category: 'Main Course', price: 220, rating: 4.8, image: '/assets/Main course/dal makhani.jpg' },
  { name: 'Aloo Paratha (2pc)', category: 'Main Course', price: 120, rating: 4.7, image: '/assets/Main course/aloo paratha.jpg' },
  { name: 'Vegetable Khichdi', category: 'Main Course', price: 160, rating: 4.6, image: '/assets/Main course/veg khichdi.jpg' },
  { name: 'Gujarati Thepla', category: 'Main Course', price: 100, rating: 4.7, image: '/assets/Main course/thepla.jpg' },
  { name: 'Khaman Dhokla', category: 'Main Course', price: 80, rating: 4.8, image: '/assets/Main course/dhokla.jpg' },
  { name: 'Farmhouse Pizza', category: 'Italian', price: 399, rating: 4.8, image: '/assets/Main course/farmhouse pizza.jpg' },
  { name: 'Classic Veg Burger', category: 'Fast Food', price: 149, rating: 4.6, image: '/assets/Main course/classic veg burger.jpg' },
  { name: 'Veg Hakka Noodles', category: 'Chinese', price: 180, rating: 4.5, image: '/assets/Main course/veg hakka noodles.jpg' },
  { name: 'Veg Club Sandwich', category: 'Fast Food', price: 160, rating: 4.5, image: '/assets/Main course/veg club sandwich.jpg' },
  { name: 'Veg Fried Rice', category: 'Chinese', price: 190, rating: 4.6, image: '/assets/Main course/veg fried rice.jpg' },
  { name: 'Veg Momos (8pc)', category: 'Chinese', price: 120, rating: 4.7, image: '/assets/Main course/veg momos.jpg' },
  { name: 'Crispy French Fries', category: 'Fast Food', price: 99, rating: 4.4, image: '/assets/Main course/crispy french fries.jpg' },
  { name: 'Paneer Wrap', category: 'Fast Food', price: 180, rating: 4.6, image: '/assets/Main course/paneer wrap.jpg' },
  { name: 'Veg White Sauce Pasta', category: 'Italian', price: 280, rating: 4.7, image: '/assets/Main course/white pasta.jpg' },
  { name: 'Veg Ramen Bowl', category: 'Chinese', price: 320, rating: 4.8, image: '/assets/Main course/veg ramen bowl.jpg' },
  { name: 'Veg Sushi Platter', category: 'Chinese', price: 450, rating: 4.9, image: '/assets/Main course/sushi.jpg' },
  { name: 'Veg Dimsums', category: 'Chinese', price: 180, rating: 4.7, image: '/assets/Main course/dimsums.jpg' },
  { name: 'Veg Sizzler', category: 'Main Course', price: 499, rating: 4.8, image: '/assets/Main course/sizzler.jpg' },
  { name: 'Soft Croissant', category: 'Fast Food', price: 110, rating: 4.6, image: '/assets/Main course/crossiant.jpg' },
  { name: 'Veg Nachos Large', category: 'Fast Food', price: 220, rating: 4.5, image: '/assets/Main course/nachos.jpg' },
  { name: 'Veg Mexican Tacos (3pc)', category: 'Fast Food', price: 280, rating: 4.7, image: '/assets/Main course/tacos.jpg' },
  { name: 'Pav Bhaji Special', category: 'Street Food', price: 140, rating: 4.8, image: '/assets/Main course/pav bhaji.jpg' },
  { name: 'Delhi Ki Chaat', category: 'Street Food', price: 90, rating: 4.7, image: '/assets/Main course/chaat.jpg' },
  { name: 'Masala Dosa', category: 'South Indian', price: 120, rating: 4.9, image: '/assets/Main course/masala dosa.jpg' },
  { name: 'Chole Bhature (2pc)', category: 'Street Food', price: 160, rating: 4.7, image: '/assets/Main course/chole bhature.jpg' },
  { name: 'Mumbai Vada Pav', category: 'Street Food', price: 40, rating: 4.8, image: '/assets/Main course/vada pav.jpg' },
  { name: 'Punjabi Samosa (2pc)', category: 'Street Food', price: 40, rating: 4.5, image: '/assets/Main course/samosa.jpg' },
  { name: 'Pani Puri (8pc)', category: 'Street Food', price: 60, rating: 4.9, image: '/assets/Main course/pani puri.jpg' },
  { name: 'Kutchi Dabeli', category: 'Street Food', price: 45, rating: 4.7, image: '/assets/Main course/dabeli.jpg' },
  { name: 'Indori Poha', category: 'Street Food', price: 50, rating: 4.6, image: '/assets/Main course/poha.jpg' },
  { name: 'Chocolate Truffle Cake', category: 'Desserts', price: 499, rating: 4.8, image: '/assets/Main course/truffle cake.jpg' },
  { name: 'Premium Ice Cream', category: 'Desserts', price: 99, rating: 4.7, image: '/assets/Main course/ice-cream.jpg' },
  { name: 'Indian Sweets Box', category: 'Desserts', price: 350, rating: 4.9, image: '/assets/Main course/sweet box.jpg' },
  { name: 'Gajar ka Halwa', category: 'Desserts', price: 120, rating: 4.8, image: '/assets/Main course/gajar ka halwa.jpg' },
  { name: 'Belgian Waffles', category: 'Desserts', price: 220, rating: 4.7, image: '/assets/Main course/waffle.jpg' },
  { name: 'Chocolate Milkshake', category: 'Beverages', price: 160, rating: 4.6, image: '/assets/Main course/chocolate mikshake.jpg' },
  { name: 'Premium Cold Coffee', category: 'Beverages', price: 140, rating: 4.7, image: '/assets/Main course/cold coffee.jpg' },
  { name: 'Fresh Fruit Juice', category: 'Beverages', price: 120, rating: 4.5, image: '/assets/Main course/fruit juice.jpg' },
  { name: 'Masala Chai', category: 'Beverages', price: 40, rating: 4.9, image: '/assets/Main course/chai.jpg' },
  { name: 'Iced Lemon Tea', category: 'Beverages', price: 90, rating: 4.5, image: '/assets/Main course/lemon tea.jpg' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await FoodItem.deleteMany({});
    console.log('Cleared existing food items.');
    
    await FoodItem.insertMany(foodItems);
    console.log(`${foodItems.length} food items seeded successfully!`);
    
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
