// All product data for the Nectar app

export const shopProducts = {
  exclusiveOffer: [
    { 
      id: 1, 
      name: 'Organic Bananas', 
      size: '12pcs, Priceg', 
      price: 4.99, 
      image: require('./assets/banana.png'),
      description: 'Bananas are nutritious. Bananas may be good for weight loss. Bananas may be good for your heart. As part of a healthful and varied diet.'
    },
    { 
      id: 2, 
      name: 'Red Apple', 
      size: '1kg, Priceg', 
      price: 4.99, 
      image: require('./assets/red-apple.png'),
      description: 'Apples are nutritious. Apples may be good for weight loss. Apples may be good for your heart. As part of a healthful and varied diet.'
    },
  ],
  bestSelling: [
    { 
      id: 3, 
      name: 'Bell Pepper Red', 
      size: '1kg, Priceg', 
      price: 4.99, 
      image: require('./assets/pepper.png'),
      description: 'Bell peppers are rich in vitamins and antioxidants. They may help improve eye health and reduce the risk of chronic diseases.'
    },
    { 
      id: 4, 
      name: 'Ginger', 
      size: '250gm, Priceg', 
      price: 4.99, 
      image: require('./assets/ginger.png'),
      description: 'Ginger has powerful medicinal properties. It can help with nausea, reduce inflammation, and support digestive health.'
    },
  ],
  groceries: [
    { 
      id: 5, 
      name: 'Beef Bone', 
      size: '1kg, Priceg', 
      price: 4.99, 
      image: require('./assets/beef-bone.png'),
      description: 'High-quality beef bone perfect for making nutritious bone broth. Rich in minerals and collagen.'
    },
    { 
      id: 6, 
      name: 'Broiler Chicken', 
      size: '1kg, Priceg', 
      price: 4.99, 
      image: require('./assets/chicken.png'),
      description: 'Fresh broiler chicken, high in protein and essential nutrients. Perfect for various cooking methods.'
    },
  ],
};

export const categoryProducts = {
  'Beverages': [
    { id: 1, name: 'Diet Coke', size: '355ml', price: 1.99, image: '🥤' },
    { id: 2, name: 'Sprite Can', size: '325ml', price: 1.50, image: '🥤' },
    { id: 3, name: 'Apple & Grape Juice', size: '2L', price: 15.99, image: '🧃' },
    { id: 4, name: 'Orange Juice', size: '2L', price: 15.99, image: '🧃' },
    { id: 5, name: 'Coca Cola Can', size: '325ml', price: 4.99, image: '🥤' },
    { id: 6, name: 'Pepsi Can', size: '330ml', price: 4.99, image: '🥤' },
  ],
  'Dairy & Eggs': [
    { id: 1, name: 'Egg Chicken Red', size: '4pcs', price: 1.99, image: '🥚' },
    { id: 2, name: 'Egg Chicken White', size: '180g', price: 1.50, image: '🥚' },
    { id: 3, name: 'Egg Pasta', size: '30gm', price: 15.99, image: '🍝' },
    { id: 4, name: 'Egg Noodles', size: '2L', price: 15.99, image: '🍜' },
    { id: 5, name: 'Mayonnais Eggless', size: '325ml', price: 4.99, image: '🥫' },
    { id: 6, name: 'Egg Noodles', size: '330ml', price: 4.99, image: '🍜' },
  ],
};

export const categories = [
  { 
    id: 1, 
    name: 'Fresh Fruits\n& Vegetable', 
    color: '#E6F2EA', 
    image: require('./assets/fresh-fruits.png') 
  },
  { 
    id: 2, 
    name: 'Cooking Oil\n& Ghee', 
    color: '#FFF3E6', 
    image: require('./assets/cooking-oil.png') 
  },
  { 
    id: 3, 
    name: 'Meat & Fish', 
    color: '#FFE9E5', 
    image: require('./assets/meat-fish.png') 
  },
  { 
    id: 4, 
    name: 'Bakery & Snacks', 
    color: '#F3E8FF', 
    image: require('./assets/bakery.png') 
  },
  { 
    id: 5, 
    name: 'Dairy & Eggs', 
    color: '#FFFBE6', 
    image: require('./assets/dairy-eggs.png'), 
    key: 'Dairy & Eggs' 
  },
  { 
    id: 6, 
    name: 'Beverages', 
    color: '#E6F5FF', 
    image: require('./assets/beverages.png'), 
    key: 'Beverages' 
  },
];
