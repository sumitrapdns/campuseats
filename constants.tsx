import { FoodItem } from './types';

export const FOOD_MENU: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, lettuce, and our secret sauce.',
    price: 12.99,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/burger1/400/300',
    calories: 850,
    rating: 4.8,
    tags: ['Comfort', 'Classic', 'Beef']
  },
  {
    id: '2',
    name: 'Truffle Mushroom Pizza',
    description: 'Wild mushrooms, truffle oil, and fresh mozzarella on a thin crust.',
    price: 18.50,
    category: 'Pizza',
    image: 'https://picsum.photos/seed/pizza1/400/300',
    calories: 1100,
    rating: 4.9,
    tags: ['Vegetarian', 'Premium', 'Italian']
  },
  {
    id: '3',
    name: 'Dragon Roll Sushi',
    description: 'Shrimp tempura, eel, avocado, and spicy mayo topping.',
    price: 15.99,
    category: 'Sushi',
    image: 'https://picsum.photos/seed/sushi1/400/300',
    calories: 450,
    rating: 4.7,
    tags: ['Seafood', 'Spicy', 'Japanese']
  },
  {
    id: '4',
    name: 'Quinoa Power Bowl',
    description: 'Fresh kale, quinoa, roasted sweet potatoes, and tahini dressing.',
    price: 13.50,
    category: 'Salads',
    image: 'https://picsum.photos/seed/salad1/400/300',
    calories: 520,
    rating: 4.6,
    tags: ['Healthy', 'Vegan', 'Gluten-Free']
  },
  {
    id: '5',
    name: 'Double Choco Lava Cake',
    description: 'Warm chocolate cake with a gooey center served with vanilla ice cream.',
    price: 8.99,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/cake1/400/300',
    calories: 780,
    rating: 4.9,
    tags: ['Sweet', 'Indulgent']
  },
  {
    id: '6',
    name: 'Hibiscus Iced Tea',
    description: 'Refreshing brewed hibiscus tea with a hint of mint and lime.',
    price: 4.50,
    category: 'Drinks',
    image: 'https://picsum.photos/seed/drink1/400/300',
    calories: 80,
    rating: 4.5,
    tags: ['Refreshing', 'Sugar-Free']
  },
  {
    id: '7',
    name: 'Spicy Buffalo Wings',
    description: 'Crispy wings tossed in fiery buffalo sauce with ranch dip.',
    price: 14.25,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/wings/400/300',
    calories: 900,
    rating: 4.7,
    tags: ['Spicy', 'Appetizer']
  },
  {
    id: '8',
    name: 'Margherita Flatbread',
    description: 'San Marzano tomatoes, fresh basil, and buffalo mozzarella.',
    price: 14.99,
    category: 'Pizza',
    image: 'https://picsum.photos/seed/margherita/400/300',
    calories: 700,
    rating: 4.5,
    tags: ['Vegetarian', 'Light']
  }
];

export const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts', 'Drinks'];
