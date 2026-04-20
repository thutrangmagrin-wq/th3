import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ImageBackground, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { shopProducts, categoryProducts, categories } from './data';
import { 
  saveUserLogin, 
  getSavedUser, 
  isUserLoggedIn, 
  logoutUser,
  saveCartItems,
  getSavedCartItems,
  clearCart,
  saveOrder,
  getSavedOrders,
} from './src/services/storageService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Banasree');
  const [selectedArea, setSelectedArea] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addedToCartAnimation, setAddedToCartAnimation] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false); // NEW: Track if cart has been loaded

  // Function to add product to cart (improved - no alert)
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.name === product.name);
    
    if (existingItem) {
      // If product already in cart, increase quantity
      setCartItems(cartItems.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new product to cart
      const newItem = {
        id: Date.now(), // Use timestamp for unique ID
        name: product.name,
        size: product.size,
        price: product.price,
        quantity: 1,
        image: product.image || '🛒',
      };
      setCartItems([...cartItems, newItem]);
    }
    
    // Show brief animation feedback
    setAddedToCartAnimation(product.name);
    setTimeout(() => setAddedToCartAnimation(null), 1000);
  };

  // Function to handle checkout with random success/fail
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simulate API call with 2 second delay
    setTimeout(async () => {
      setIsCheckingOut(false);
      
      // Random 50% chance of success or failure
      const isSuccess = Math.random() > 0.5;
      
      if (isSuccess) {
        // Save order before clearing cart
        const orderData = {
          items: cartItems,
          totalPrice: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2),
          status: 'completed',
        };
        
        const savedOrder = await saveOrder(orderData);
        if (savedOrder) {
          setOrders([savedOrder, ...orders]);
        }
        
        // Clear cart on success
        await clearCart();
        setCartItems([]);
        setCurrentScreen('order-accepted');
      } else {
        setCurrentScreen('order-failed');
      }
    }, 2000);
  };

  // Auto-login and load data on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is logged in
        const loggedIn = await isUserLoggedIn();
        console.log('🔐 User logged in:', loggedIn);
        
        // Load saved cart FIRST (regardless of login status)
        const savedCart = await getSavedCartItems();
        console.log('📦 Loaded cart from storage:', savedCart);
        if (savedCart && savedCart.length > 0) {
          setCartItems(savedCart);
        }
        setIsCartLoaded(true); // Mark cart as loaded
        
        if (loggedIn) {
          const user = await getSavedUser();
          setCurrentUser(user);
          setIsLoggedIn(true);
          
          // Load saved orders
          const savedOrders = await getSavedOrders();
          if (savedOrders && savedOrders.length > 0) {
            setOrders(savedOrders);
          }
          
          setCurrentScreen('home');
        } else {
          setCurrentScreen('splash');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setCurrentScreen('splash');
      } finally {
        setIsAppLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // Save cart whenever it changes (ONLY after initial load)
  useEffect(() => {
    if (isCartLoaded) {
      console.log('💾 Saving cart:', cartItems);
      saveCartItems(cartItems);
    }
  }, [cartItems, isCartLoaded]);

  // Auto navigate from splash to onboarding after 3 seconds
  React.useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Splash Screen
  if (currentScreen === 'splash') {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashLogo}>🥕</Text>
          <Text style={styles.splashTitle}>nectar</Text>
          <Text style={styles.splashSubtitle}>online groceries</Text>
          
          {isAppLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
              <View style={styles.loadingBar}>
                <View style={styles.loadingBarFill} />
              </View>
            </View>
          )}
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  // Onboarding Screen
  if (currentScreen === 'onboarding') {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./assets/onboarding-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.onboardingContent}>
              <Text style={styles.logoEmoji}>🥕</Text>
              <Text style={styles.onboardingTitle}>Welcome</Text>
              <Text style={styles.onboardingTitle}>to our store</Text>
              <Text style={styles.onboardingSubtitle}>Get your groceries in as fast as one hour</Text>
              
              <Text style={styles.authorName}>Đỗ Quỳnh Thu Trang</Text>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => setCurrentScreen('signin')}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <StatusBar style="light" />
      </View>
    );
  }

  // Sign In Screen
  if (currentScreen === 'signin') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/signin-logo.png')}
            style={styles.signinLogo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Get your groceries</Text>
        <Text style={styles.title}>with nectar</Text>

        <TouchableOpacity 
          style={styles.phoneInputButton}
          onPress={() => setCurrentScreen('phone-input')}
        >
          <View style={styles.phoneInputContent}>
            <Text style={styles.phoneInputLabel}>Phone Number</Text>
            <View style={styles.phoneInputRow}>
              <Text style={styles.countryFlag}>🇧🇩</Text>
              <Text style={styles.phoneInputText}>{countryCode}</Text>
            </View>
          </View>
          <Text style={styles.phoneInputArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or connect with social media</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('login')} style={{marginTop: 10}}>
          <Text style={styles.linkText}>
            Or <Text style={styles.linkTextBold}>Log In with Email</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Đỗ Quỳnh Thu Trang</Text>
        </View>

        <StatusBar style="dark" />
      </ScrollView>
    );
  }

  // Login Screen (NEW)
  if (currentScreen === 'login') {
    return (
      <ScrollView style={styles.loginContainer} contentContainerStyle={styles.loginContent}>
        <View style={styles.loginLogoContainer}>
          <Text style={styles.loginLogo}>🥕</Text>
        </View>

        <Text style={styles.loginTitle}>Loging</Text>
        <Text style={styles.loginSubtitle}>Enter your emails and password</Text>

        <View style={styles.loginInputSection}>
          <Text style={styles.loginInputLabel}>Email</Text>
          <TextInput
            style={styles.loginInput}
            placeholder="imshuvo97@gmail.com"
            placeholderTextColor="#7C7C7C"
            value={loginEmail}
            onChangeText={setLoginEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.loginInputSection}>
          <Text style={styles.loginInputLabel}>Password</Text>
          <View style={styles.loginPasswordContainer}>
            <TextInput
              style={styles.loginPasswordInput}
              placeholder="••••••••"
              placeholderTextColor="#7C7C7C"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.passwordEyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={async () => {
            // Save user login
            const userData = {
              email: loginEmail,
              name: loginEmail.split('@')[0],
              loginTime: new Date().toISOString(),
            };
            await saveUserLogin(userData);
            setCurrentUser(userData);
            setIsLoggedIn(true);
            setCurrentScreen('home');
          }}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
          <Text style={styles.loginLinkText}>
            Don't have an account? <Text style={styles.loginLinkTextBold}>Signup</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('location')} style={{marginTop: 10}}>
          <Text style={styles.loginLinkText}>
            Or <Text style={styles.loginLinkTextBold}>Select Location</Text>
          </Text>
        </TouchableOpacity>

        <StatusBar style="dark" />
      </ScrollView>
    );
  }

  // Select Location Screen (NEW)
  if (currentScreen === 'location') {
    return (
      <View style={styles.locationContainer}>
        <View style={styles.locationHeader}>
          <TouchableOpacity 
            style={styles.locationBackButton}
            onPress={() => setCurrentScreen('login')}
          >
            <Text style={styles.locationBackIcon}>‹</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.locationScroll} contentContainerStyle={styles.locationContent}>
          <View style={styles.locationMapContainer}>
            <Text style={styles.locationMapIcon}>📍</Text>
            <View style={styles.locationMapBg}>
              <Text style={styles.locationMapText}>🗺️</Text>
            </View>
          </View>

          <Text style={styles.locationTitle}>Select Your Location</Text>
          <Text style={styles.locationSubtitle}>
            Switch on your location to stay in tune with{'\n'}what's happening in your area
          </Text>

          <View style={styles.locationInputSection}>
            <Text style={styles.locationInputLabel}>Your Zone</Text>
            <View style={styles.locationDropdown}>
              <Text style={styles.locationDropdownText}>{selectedZone}</Text>
              <Text style={styles.locationDropdownArrow}>⌄</Text>
            </View>
          </View>

          <View style={styles.locationInputSection}>
            <Text style={styles.locationInputLabel}>Your Area</Text>
            <View style={styles.locationDropdown}>
              <Text style={[styles.locationDropdownText, !selectedArea && styles.locationPlaceholder]}>
                {selectedArea || 'Types of your area'}
              </Text>
              <Text style={styles.locationDropdownArrow}>⌄</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.locationSubmitButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.locationSubmitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>

        <StatusBar style="dark" />
      </View>
    );
  }

  // Order Accepted Screen (NEW)
  if (currentScreen === 'order-accepted') {
    return (
      <View style={styles.orderAcceptedContainer}>
        <View style={styles.orderAcceptedContent}>
          <View style={styles.orderAcceptedIconContainer}>
            <View style={styles.orderAcceptedCircle}>
              <Text style={styles.orderAcceptedCheck}>✓</Text>
            </View>
            <View style={styles.orderAcceptedDecoration}>
              <Text style={styles.orderDecor1}>•</Text>
              <Text style={styles.orderDecor2}>○</Text>
              <Text style={styles.orderDecor3}>~</Text>
              <Text style={styles.orderDecor4}>○</Text>
              <Text style={styles.orderDecor5}>•</Text>
              <Text style={styles.orderDecor6}>~</Text>
            </View>
          </View>

          <Text style={styles.orderAcceptedTitle}>Your Order has been{'\n'}accepted</Text>
          <Text style={styles.orderAcceptedSubtitle}>
            Your items has been placcd and is on{'\n'}it's way to being processed
          </Text>
        </View>

        <View style={styles.orderAcceptedButtons}>
          <TouchableOpacity style={styles.trackOrderButton}>
            <Text style={styles.trackOrderText}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backToHomeButton}
            onPress={() => {
              setCurrentScreen('home');
              setActiveTab('shop');
            }}
          >
            <Text style={styles.backToHomeText}>Back to home</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="dark" />
      </View>
    );
  }

  // Order Failed Screen (NEW)
  if (currentScreen === 'order-failed') {
    return (
      <View style={styles.orderFailedContainer}>
        <TouchableOpacity 
          style={styles.orderFailedCloseButton}
          onPress={() => {
            setCurrentScreen('home');
            setActiveTab('favourite');
          }}
        >
          <Text style={styles.orderFailedCloseIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.orderFailedContent}>
          <View style={styles.orderFailedIconContainer}>
            <View style={styles.orderFailedCircle}>
              <Text style={styles.orderFailedBagIcon}>🛒</Text>
              <View style={styles.orderFailedVeggies}>
                <Text style={styles.veggie1}>🥕</Text>
                <Text style={styles.veggie2}>🍆</Text>
                <Text style={styles.veggie3}>🌽</Text>
                <Text style={styles.veggie4}>🍌</Text>
              </View>
            </View>
          </View>

          <Text style={styles.orderFailedTitle}>Oops! Order Failed</Text>
          <Text style={styles.orderFailedSubtitle}>Something went terribly wrong.</Text>
        </View>

        <View style={styles.orderFailedButtons}>
          <TouchableOpacity 
            style={styles.pleaseTryAgainButton}
            onPress={() => {
              setCurrentScreen('home');
              setActiveTab('cart');
            }}
          >
            <Text style={styles.pleaseTryAgainText}>Please Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backToHomeButtonFailed}
            onPress={() => {
              setCurrentScreen('home');
              setActiveTab('shop');
            }}
          >
            <Text style={styles.backToHomeTextFailed}>Back to home</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="dark" />
      </View>
    );
  }

  // Phone Input Screen (NEW)
  if (currentScreen === 'phone-input') {
    const handleNumberPress = (num) => {
      setPhoneNumber(phoneNumber + num);
    };

    const handleDelete = () => {
      setPhoneNumber(phoneNumber.slice(0, -1));
    };

    const handleNext = () => {
      if (phoneNumber.length > 0) {
        alert('Phone number: ' + countryCode + phoneNumber);
        setCurrentScreen('signin');
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.phoneInputScreen}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentScreen('signin')}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.phoneInputTitle}>Enter your mobile number</Text>

          <View style={styles.phoneNumberDisplay}>
            <Text style={styles.phoneNumberLabel}>Mobile Number</Text>
            <View style={styles.phoneNumberRow}>
              <Text style={styles.countryFlagLarge}>🇧🇩</Text>
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <Text style={styles.phoneNumberText}>{phoneNumber || ''}</Text>
            </View>
          </View>

          <View style={styles.numberPad}>
            <View style={styles.numberPadRow}>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('1')}>
                <Text style={styles.numberKeyText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('2')}>
                <Text style={styles.numberKeyText}>2</Text>
                <Text style={styles.numberKeySubtext}>ABC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('3')}>
                <Text style={styles.numberKeyText}>3</Text>
                <Text style={styles.numberKeySubtext}>DEF</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.numberPadRow}>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('4')}>
                <Text style={styles.numberKeyText}>4</Text>
                <Text style={styles.numberKeySubtext}>GHI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('5')}>
                <Text style={styles.numberKeyText}>5</Text>
                <Text style={styles.numberKeySubtext}>JKL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('6')}>
                <Text style={styles.numberKeyText}>6</Text>
                <Text style={styles.numberKeySubtext}>MNO</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.numberPadRow}>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('7')}>
                <Text style={styles.numberKeyText}>7</Text>
                <Text style={styles.numberKeySubtext}>PQRS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('8')}>
                <Text style={styles.numberKeyText}>8</Text>
                <Text style={styles.numberKeySubtext}>TUV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('9')}>
                <Text style={styles.numberKeyText}>9</Text>
                <Text style={styles.numberKeySubtext}>WXYZ</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.numberPadRow}>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('+')}>
                <Text style={styles.numberKeyText}>+ * #</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={() => handleNumberPress('0')}>
                <Text style={styles.numberKeyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.numberKey} onPress={handleDelete}>
                <Text style={styles.numberKeyText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>›</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </View>
    );
  }

  // Sign Up Screen
  if (currentScreen === 'signup') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmojiSmall}>🥕</Text>
        </View>

        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#7C7C7C"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7C7C7C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {email.includes('@') && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7C7C7C"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('signin')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Đỗ Quỳnh Thu Trang</Text>
        </View>

        <StatusBar style="dark" />
      </ScrollView>
    );
  }

  // Home/Explore Screen (NEW)
  if (currentScreen === 'home') {
    // Product Detail Screen - Show this FIRST before any tab content
    if (selectedProduct) {
      return (
        <View style={styles.productDetailContainer}>
          <ScrollView style={styles.productDetailScroll}>
            <View style={styles.productDetailHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedProduct(null)}
              >
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareIcon}>⬆️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.productImageContainer}>
              {typeof selectedProduct.image === 'number' ? (
                <Image source={selectedProduct.image} style={styles.productDetailImageReal} resizeMode="contain" />
              ) : (
                <Text style={styles.productDetailImage}>{selectedProduct.image}</Text>
              )}
              <View style={styles.imageDots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>

            <View style={styles.productDetailContent}>
              <View style={styles.productDetailTitleRow}>
                <View style={styles.productDetailTitleLeft}>
                  <Text style={styles.productDetailName}>{selectedProduct.name}</Text>
                  <Text style={styles.productDetailSize}>{selectedProduct.size}, Price</Text>
                </View>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Text style={styles.favoriteIcon}>🤍</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.quantityRow}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.productDetailPrice}>${selectedProduct.price}</Text>
              </View>

              <View style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Text style={styles.detailSectionTitle}>Product Detail</Text>
                  <Text style={styles.detailSectionArrow}>⌄</Text>
                </View>
                <Text style={styles.detailSectionText}>
                  Apples Are Nutritious. Apples May Be Good For Weight Loss. Apples May Be Good For Your Heart. As Part Of A Healtful And Varied Diet.
                </Text>
              </View>

              <TouchableOpacity style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Text style={styles.detailSectionTitle}>Nutritions</Text>
                  <View style={styles.nutritionBadge}>
                    <Text style={styles.nutritionBadgeText}>100gr</Text>
                  </View>
                  <Text style={styles.detailSectionArrow}>›</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Text style={styles.detailSectionTitle}>Review</Text>
                  <View style={styles.starsContainer}>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                  </View>
                  <Text style={styles.detailSectionArrow}>›</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.addToBasketButton}
                onPress={() => {
                  addToCart({ ...selectedProduct, quantity });
                  setSelectedProduct(null);
                  setQuantity(1);
                }}
              >
                <Text style={styles.addToBasketText}>Add To Basket</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <StatusBar style="dark" />
        </View>
      );
    }

    // Shop Screen
    if (activeTab === 'shop') {
      // Filter products based on search query
      const filterProducts = (products) => {
        if (!searchQuery.trim()) return products;
        return products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      };

      const filteredExclusiveOffer = filterProducts(shopProducts.exclusiveOffer);
      const filteredBestSelling = filterProducts(shopProducts.bestSelling);
      const filteredGroceries = filterProducts(shopProducts.groceries);

      const hasResults = filteredExclusiveOffer.length > 0 || filteredBestSelling.length > 0 || filteredGroceries.length > 0;

      return (
        <View style={styles.homeContainer}>
          <ScrollView style={styles.shopScroll} contentContainerStyle={styles.shopContent}>
            {/* Header with Location */}
            <View style={styles.shopHeader}>
              <Text style={styles.shopLogo}>🥕</Text>
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>Dhaka, Banassre</Text>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Store"
                placeholderTextColor="#7C7C7C"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.searchClearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Banner - only show when not searching */}
            {!searchQuery.trim() && (
              <ImageBackground
                source={require('./assets/shop-banner.png')}
                style={styles.banner}
                imageStyle={styles.bannerImage}
                resizeMode="cover"
              >
                <View style={styles.bannerOverlay}>
                </View>
              </ImageBackground>
            )}

            {/* No results message */}
            {searchQuery.trim() && !hasResults && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No products found for "{searchQuery}"</Text>
                <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
              </View>
            )}

            {/* Exclusive Offer */}
            {filteredExclusiveOffer.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Exclusive Offer</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {filteredExclusiveOffer.map((product) => (
                    <View key={product.id} style={styles.productCardHorizontal}>
                      <TouchableOpacity 
                        style={styles.productCardTouchable}
                        onPress={() => setSelectedProduct(product)}
                        activeOpacity={0.7}
                      >
                        <Image source={product.image} style={styles.productImageSmall} resizeMode="contain" />
                        <Text style={styles.productNameSmall}>{product.name}</Text>
                        <Text style={styles.productSizeSmall}>{product.size}</Text>
                      </TouchableOpacity>
                      <View style={styles.productFooterSmall}>
                        <Text style={styles.productPriceSmall}>${product.price}</Text>
                        <TouchableOpacity 
                          style={styles.addButtonSmall}
                          onPress={() => addToCart(product)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.addButtonTextSmall}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            {/* Best Selling */}
            {filteredBestSelling.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Best Selling</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {filteredBestSelling.map((product) => (
                    <View key={product.id} style={styles.productCardHorizontal}>
                      <TouchableOpacity 
                        style={styles.productCardTouchable}
                        onPress={() => setSelectedProduct(product)}
                        activeOpacity={0.7}
                      >
                        <Image source={product.image} style={styles.productImageSmall} resizeMode="contain" />
                        <Text style={styles.productNameSmall}>{product.name}</Text>
                        <Text style={styles.productSizeSmall}>{product.size}</Text>
                      </TouchableOpacity>
                      <View style={styles.productFooterSmall}>
                        <Text style={styles.productPriceSmall}>${product.price}</Text>
                        <TouchableOpacity 
                          style={styles.addButtonSmall}
                          onPress={() => addToCart(product)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.addButtonTextSmall}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            {/* Groceries */}
            {!searchQuery.trim() && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Groceries</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  <View style={styles.groceryCard}>
                    <Text style={styles.groceryIcon}>🫘</Text>
                    <Text style={styles.groceryName}>Pulses</Text>
                  </View>

                  <View style={[styles.groceryCard, { backgroundColor: '#E6F2EA' }]}>
                    <Text style={styles.groceryIcon}>🌾</Text>
                    <Text style={styles.groceryName}>Rice</Text>
                  </View>
                </ScrollView>
              </>
            )}

            {filteredGroceries.length > 0 && (
              <View style={styles.productsGrid}>
                {filteredGroceries.map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <TouchableOpacity 
                      style={styles.productCardTouchable}
                      onPress={() => setSelectedProduct(product)}
                      activeOpacity={0.7}
                    >
                      <Image source={product.image} style={styles.productImage} resizeMode="contain" />
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productSize}>{product.size}</Text>
                    </TouchableOpacity>
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>${product.price}</Text>
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => addToCart(product)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.addButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('shop')}
            >
              <Text style={styles.navIcon}>🏪</Text>
              <Text style={[styles.navLabel, activeTab === 'shop' && styles.navLabelActive]}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.navIcon}>🔍</Text>
              <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('cart')}
            >
              <Text style={styles.navIcon}>🛒</Text>
              <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('favourite')}
            >
              <Text style={styles.navIcon}>❤️</Text>
              <Text style={[styles.navLabel, activeTab === 'favourite' && styles.navLabelActive]}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('account')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>Account</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </View>
      );
    }

    // Cart Screen
    if (activeTab === 'cart') {
      const updateCartQuantity = (itemId, change) => {
        setCartItems(cartItems.map(item => {
          if (item.id === itemId) {
            const newQuantity = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }));
      };

      const removeCartItem = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
      };

      const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
      };

      return (
        <View style={styles.homeContainer}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>My Cart</Text>
          </View>

          <ScrollView style={styles.cartScroll} contentContainerStyle={styles.cartContent}>
            {cartItems.length === 0 ? (
              <View style={styles.emptyCartContainer}>
                <Text style={styles.emptyCartIcon}>🛒</Text>
                <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
                <Text style={styles.emptyCartSubtitle}>Add some products to get started!</Text>
                <TouchableOpacity 
                  style={styles.shopNowButton}
                  onPress={() => setActiveTab('shop')}
                >
                  <Text style={styles.shopNowButtonText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            ) : (
              cartItems.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  {typeof item.image === 'number' ? (
                    <Image source={item.image} style={styles.cartItemImageReal} resizeMode="contain" />
                  ) : (
                    <Text style={styles.cartItemImage}>{item.image}</Text>
                  )}
                  
                  <View style={styles.cartItemDetails}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemSize}>{item.size}, Price</Text>
                    
                    <View style={styles.cartItemActions}>
                      <TouchableOpacity 
                        style={styles.cartQuantityButton}
                        onPress={() => updateCartQuantity(item.id, -1)}
                      >
                        <Text style={styles.cartQuantityButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.cartQuantityText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.cartQuantityButton}
                        onPress={() => updateCartQuantity(item.id, 1)}
                      >
                        <Text style={styles.cartQuantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.cartItemRight}>
                    <TouchableOpacity 
                      style={styles.cartRemoveButton}
                      onPress={() => removeCartItem(item.id)}
                    >
                      <Text style={styles.cartRemoveIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.cartFooter}>
            <TouchableOpacity 
              style={[styles.checkoutButton, (isCheckingOut || cartItems.length === 0) && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={isCheckingOut || cartItems.length === 0}
            >
              {isCheckingOut ? (
                <Text style={styles.checkoutButtonText}>Processing... ⏳</Text>
              ) : (
                <>
                  <Text style={styles.checkoutButtonText}>Go to Checkout</Text>
                  <View style={styles.checkoutBadge}>
                    <Text style={styles.checkoutBadgeText}>${getTotalPrice()}</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('shop')}
            >
              <Text style={styles.navIcon}>🏪</Text>
              <Text style={[styles.navLabel, activeTab === 'shop' && styles.navLabelActive]}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.navIcon}>🔍</Text>
              <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('cart')}
            >
              <Text style={styles.navIcon}>🛒</Text>
              <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('favourite')}
            >
              <Text style={styles.navIcon}>❤️</Text>
              <Text style={[styles.navLabel, activeTab === 'favourite' && styles.navLabelActive]}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('account')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>Account</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </View>
      );
    }

    // Favourite Screen
    if (activeTab === 'favourite') {
      return (
        <View style={styles.homeContainer}>
          <ScrollView style={styles.favouriteScroll} contentContainerStyle={styles.favouriteContent}>
            <Text style={styles.favouriteTitle}>Favourite</Text>

            {/* Sample Favourite Item */}
            <View style={styles.favouriteItem}>
              <Image source={require('./assets/banana.png')} style={styles.favouriteItemImage} resizeMode="contain" />
              <View style={styles.favouriteItemDetails}>
                <Text style={styles.favouriteItemName}>Sprite Can</Text>
                <Text style={styles.favouriteItemSize}>325ml, Price</Text>
              </View>
              <View style={styles.favouriteItemRight}>
                <Text style={styles.favouriteItemPrice}>$1.50</Text>
                <TouchableOpacity>
                  <Text style={styles.favouriteItemArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.favouriteDivider} />

            {/* Test Button for Order Failed */}
            <TouchableOpacity 
              style={styles.testOrderFailedButton}
              onPress={() => setCurrentScreen('order-failed')}
            >
              <Text style={styles.testOrderFailedText}>🧪 Test Order Failed Screen</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('shop')}
            >
              <Text style={styles.navIcon}>🏪</Text>
              <Text style={[styles.navLabel, activeTab === 'shop' && styles.navLabelActive]}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.navIcon}>🔍</Text>
              <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('cart')}
            >
              <Text style={styles.navIcon}>🛒</Text>
              <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('favourite')}
            >
              <Text style={styles.navIcon}>❤️</Text>
              <Text style={[styles.navLabel, activeTab === 'favourite' && styles.navLabelActive]}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('account')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>Account</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </View>
      );
    }

    // Orders Screen
    if (activeTab === 'orders') {
      return (
        <View style={styles.homeContainer}>
          <View style={styles.ordersHeader}>
            <Text style={styles.ordersTitle}>My Orders</Text>
          </View>

          <ScrollView style={styles.ordersScroll} contentContainerStyle={styles.ordersContent}>
            {orders.length === 0 ? (
              <View style={styles.emptyOrdersContainer}>
                <Text style={styles.emptyOrdersIcon}>📦</Text>
                <Text style={styles.emptyOrdersTitle}>No Orders Yet</Text>
                <Text style={styles.emptyOrdersSubtitle}>Start shopping to place your first order!</Text>
                <TouchableOpacity 
                  style={styles.shopNowButton}
                  onPress={() => setActiveTab('shop')}
                >
                  <Text style={styles.shopNowButtonText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            ) : (
              orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderTitle}>Order #{order.id}</Text>
                    <Text style={styles.orderStatus}>{order.status}</Text>
                  </View>
                  
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderLabel}>Items: {order.items.length}</Text>
                    <Text style={styles.orderLabel}>Total: ${order.totalPrice}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.timestamp).toLocaleDateString()} {new Date(order.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>

                  <View style={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <View key={index} style={styles.orderItem}>
                        <Text style={styles.orderItemImage}>{item.image}</Text>
                        <View style={styles.orderItemInfo}>
                          <Text style={styles.orderItemName}>{item.name}</Text>
                          <Text style={styles.orderItemSize}>{item.size}</Text>
                        </View>
                        <Text style={styles.orderItemQty}>x{item.quantity}</Text>
                        <Text style={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('shop')}
            >
              <Text style={styles.navIcon}>🏪</Text>
              <Text style={[styles.navLabel, activeTab === 'shop' && styles.navLabelActive]}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.navIcon}>🔍</Text>
              <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('orders')}
            >
              <Text style={styles.navIcon}>📦</Text>
              <Text style={[styles.navLabel, activeTab === 'orders' && styles.navLabelActive]}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('favourite')}
            >
              <Text style={styles.navIcon}>❤️</Text>
              <Text style={[styles.navLabel, activeTab === 'favourite' && styles.navLabelActive]}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('account')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>Account</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </View>
      );
    }

    // Account Screen
    if (activeTab === 'account') {
      return (
        <View style={styles.homeContainer}>
          <ScrollView style={styles.accountScroll} contentContainerStyle={styles.accountContent}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Text style={styles.profileImage}>👤</Text>
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.profileNameRow}>
                  <Text style={styles.profileName}>Afsar Hossen</Text>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.profileEmail}>imshuvo97@gmail.com</Text>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>🛍️</Text>
                  <Text style={styles.menuText}>Orders</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>💳</Text>
                  <Text style={styles.menuText}>My Details</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>📍</Text>
                  <Text style={styles.menuText}>Delivery Address</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>💳</Text>
                  <Text style={styles.menuText}>Payment Methods</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>🎟️</Text>
                  <Text style={styles.menuText}>Promo Cord</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>🔔</Text>
                  <Text style={styles.menuText}>Notifecations</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>❓</Text>
                  <Text style={styles.menuText}>Help</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>ℹ️</Text>
                  <Text style={styles.menuText}>About</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={async () => {
                // Logout and clear all data
                await logoutUser();
                await clearCart();
                setIsLoggedIn(false);
                setCurrentUser(null);
                setCartItems([]);
                setCurrentScreen('signin');
              }}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('shop')}
            >
              <Text style={styles.navIcon}>🏪</Text>
              <Text style={[styles.navLabel, activeTab === 'shop' && styles.navLabelActive]}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.navIcon}>🔍</Text>
              <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('cart')}
            >
              <Text style={styles.navIcon}>🛒</Text>
              <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('favourite')}
            >
              <Text style={styles.navIcon}>❤️</Text>
              <Text style={[styles.navLabel, activeTab === 'favourite' && styles.navLabelActive]}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('account')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>Account</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </View>
      );
    }

    // Product Detail Screen
    if (selectedProduct) {
      return (
        <View style={styles.productDetailContainer}>
          <ScrollView style={styles.productDetailScroll}>
            <View style={styles.productDetailHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedProduct(null)}
              >
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareIcon}>⬆️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.productImageContainer}>
              {typeof selectedProduct.image === 'number' ? (
                <Image source={selectedProduct.image} style={styles.productDetailImageReal} resizeMode="contain" />
              ) : (
                <Text style={styles.productDetailImage}>{selectedProduct.image}</Text>
              )}
              <View style={styles.imageDots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>

            <View style={styles.productDetailContent}>
              <View style={styles.productDetailTitleRow}>
                <View style={styles.productDetailTitleLeft}>
                  <Text style={styles.productDetailName}>{selectedProduct.name}</Text>
                  <Text style={styles.productDetailSize}>{selectedProduct.size}, Price</Text>
                </View>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Text style={styles.favoriteIcon}>🤍</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.quantityRow}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.productDetailPrice}>${selectedProduct.price}</Text>
              </View>

              <View style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Text style={styles.detailSectionTitle}>Product Detail</Text>
                  <Text style={styles.detailSectionArrow}>⌄</Text>
                </View>
                <Text style={styles.detailSectionText}>
                  Apples Are Nutritious. Apples May Be Good For Weight Loss. Apples May Be Good For Your Heart. As Part Of A Healtful And Varied Diet.
                </Text>
              </View>

              <TouchableOpacity style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Text style={styles.detailSectionTitle}>Nutritions</Text>
                  <View style={styles.nutritionBadge}>
                    <Text style={styles.nutritionBadgeText}>100gr</Text>
                  </View>
                  <Text style={styles.detailSectionArrow}>›</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Text style={styles.detailSectionTitle}>Review</Text>
                  <View style={styles.starsContainer}>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.star}>⭐</Text>
                  </View>
                  <Text style={styles.detailSectionArrow}>›</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addToBasketButton}>
                <Text style={styles.addToBasketText}>Add To Basket</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    // If a category is selected, show product list
    if (selectedCategory) {
      const categoryProductsList = categoryProducts[selectedCategory] || [];

      return (
        <View style={styles.homeContainer}>
          <View style={styles.productListHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.productListTitle}>{selectedCategory}</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.productListScroll} contentContainerStyle={styles.productListContent}>
            <View style={styles.productsGrid}>
              {categoryProductsList.map((product) => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.productCard}
                  onPress={() => setSelectedProduct(product)}
                >
                  <Text style={styles.productImage}>{product.image}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productSize}>{product.size}, Price</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>${product.price}</Text>
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('shop')}
            >
              <Text style={styles.navIcon}>🏪</Text>
              <Text style={[styles.navLabel, activeTab === 'shop' && styles.navLabelActive]}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.navIcon}>🔍</Text>
              <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('cart')}
            >
              <Text style={styles.navIcon}>🛒</Text>
              <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('favourite')}
            >
              <Text style={styles.navIcon}>❤️</Text>
              <Text style={[styles.navLabel, activeTab === 'favourite' && styles.navLabelActive]}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('account')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>Account</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </View>
      );
    }

    // Category list view
    // Filter categories based on search query
    const filteredCategories = searchQuery.trim() 
      ? categories.filter(category => 
          category.name.toLowerCase().replace('\n', ' ').includes(searchQuery.toLowerCase())
        )
      : categories;

    return (
      <View style={styles.homeContainer}>
        <ScrollView style={styles.homeScroll} contentContainerStyle={styles.homeContent}>
          <Text style={styles.homeTitle}>Find Products</Text>

          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Store"
              placeholderTextColor="#7C7C7C"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.searchClearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* No results message */}
          {searchQuery.trim() && filteredCategories.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No categories found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
            </View>
          )}

          <View style={styles.categoriesGrid}>
            {filteredCategories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
                onPress={() => setSelectedCategory(category.key || category.name.replace('\n', ' '))}
              >
                <Image source={category.image} style={styles.categoryImage} resizeMode="contain" />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('shop')}
          >
            <Text style={styles.navIcon}>🏪</Text>
            <Text style={[styles.navLabel, activeTab === 'shop' && styles.navLabelActive]}>Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('explore')}
          >
            <Text style={styles.navIcon}>🔍</Text>
            <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('cart')}
          >
            <Text style={styles.navIcon}>🛒</Text>
            <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('favourite')}
          >
            <Text style={styles.navIcon}>❤️</Text>
            <Text style={[styles.navLabel, activeTab === 'favourite' && styles.navLabelActive]}>Favourite</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('account')}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={[styles.navLabel, activeTab === 'account' && styles.navLabelActive]}>Account</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="dark" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogo: {
    fontSize: 100,
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#FFF',
    letterSpacing: 4,
    marginTop: 8,
    opacity: 0.9,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 40,
  },
  logoEmojiSmall: {
    fontSize: 60,
  },
  onboardingTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  authorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  signinLogo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 8,
    marginBottom: 30,
  },
  inputContainer: {
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#181725',
    paddingVertical: 12,
  },
  checkmark: {
    color: '#53B175',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  googleButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#5383EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  facebookButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#4A66AC',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 14,
    marginVertical: 20,
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#7C7C7C',
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLink: {
    color: '#53B175',
  },
  linkText: {
    fontSize: 14,
    color: '#181725',
    textAlign: 'center',
    marginTop: 20,
  },
  linkTextBold: {
    color: '#53B175',
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7C7C7C',
    fontStyle: 'italic',
  },
  phoneInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 20,
  },
  phoneInputContent: {
    flex: 1,
  },
  phoneInputLabel: {
    fontSize: 12,
    color: '#7C7C7C',
    marginBottom: 4,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 8,
  },
  phoneInputText: {
    fontSize: 18,
    color: '#181725',
    fontWeight: '600',
  },
  phoneInputArrow: {
    fontSize: 30,
    color: '#7C7C7C',
  },
  phoneInputScreen: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 36,
    color: '#181725',
  },
  phoneInputTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 40,
  },
  phoneNumberDisplay: {
    marginBottom: 40,
  },
  phoneNumberLabel: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 12,
  },
  phoneNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    paddingBottom: 12,
  },
  countryFlagLarge: {
    fontSize: 32,
    marginRight: 12,
  },
  countryCodeText: {
    fontSize: 20,
    color: '#181725',
    fontWeight: '600',
    marginRight: 8,
  },
  phoneNumberText: {
    fontSize: 20,
    color: '#181725',
    fontWeight: '600',
  },
  numberPad: {
    flex: 1,
    justifyContent: 'center',
  },
  numberPadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  numberKey: {
    width: '30%',
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  numberKeyText: {
    fontSize: 24,
    color: '#181725',
    fontWeight: '600',
  },
  numberKeySubtext: {
    fontSize: 10,
    color: '#7C7C7C',
    marginTop: 2,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: 'bold',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  homeScroll: {
    flex: 1,
  },
  homeContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#181725',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 30,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#181725',
  },
  searchClearIcon: {
    fontSize: 18,
    color: '#7C7C7C',
    padding: 4,
  },
  noResultsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  categoryImage: {
    width: 120,
    height: 100,
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#181725',
  },
  navLabelActive: {
    color: '#53B175',
    fontWeight: '600',
  },
  productListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  productListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181725',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
  productListScroll: {
    flex: 1,
  },
  productListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  productImage: {
    width: 120,
    height: 100,
    alignSelf: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 4,
  },
  productSize: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 17,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  productDetailContainer: {
    flex: 1,
    backgroundColor: '#F2F3F2',
  },
  productDetailScroll: {
    flex: 1,
  },
  productDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  productImageContainer: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  productDetailImage: {
    fontSize: 140,
    marginBottom: 20,
  },
  productDetailImageReal: {
    width: 250,
    height: 200,
    marginBottom: 20,
  },
  imageDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  dotActive: {
    backgroundColor: '#53B175',
  },
  productDetailContent: {
    padding: 20,
  },
  productDetailTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  productDetailTitleLeft: {
    flex: 1,
  },
  productDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 4,
  },
  productDetailSize: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#7C7C7C',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
    marginHorizontal: 20,
  },
  productDetailPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
    marginLeft: 'auto',
  },
  detailSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    flex: 1,
  },
  detailSectionArrow: {
    fontSize: 20,
    color: '#181725',
  },
  detailSectionText: {
    fontSize: 13,
    color: '#7C7C7C',
    lineHeight: 21,
    marginTop: 12,
  },
  nutritionBadge: {
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 8,
  },
  nutritionBadgeText: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 16,
  },
  addToBasketButton: {
    backgroundColor: '#53B175',
    borderRadius: 19,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  addToBasketText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  // Favourite Screen Styles
  favouriteScroll: {
    flex: 1,
  },
  favouriteContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  favouriteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 30,
  },
  favouriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  favouriteItemImage: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  favouriteItemDetails: {
    flex: 1,
  },
  favouriteItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 4,
  },
  favouriteItemSize: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  favouriteItemRight: {
    alignItems: 'flex-end',
  },
  favouriteItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 8,
  },
  favouriteItemArrow: {
    fontSize: 24,
    color: '#181725',
  },
  favouriteDivider: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 10,
  },
  testOrderFailedButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFE9E5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
  },
  testOrderFailedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  // Orders Screen Styles
  ordersHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  ordersTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
  },
  ordersScroll: {
    flex: 1,
  },
  ordersContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  emptyOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyOrdersIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyOrdersTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 8,
  },
  emptyOrdersSubtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    marginBottom: 30,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#53B175',
    backgroundColor: '#E6F2EA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    color: '#181725',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#7C7C7C',
    marginTop: 8,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
    paddingTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItemImage: {
    fontSize: 40,
    marginRight: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181725',
  },
  orderItemSize: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  orderItemQty: {
    fontSize: 14,
    color: '#7C7C7C',
    marginRight: 12,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181725',
  },
  accountScroll: {
    flex: 1,
  },
  accountContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E6F2EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImage: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181725',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 30,
  },
  menuText: {
    fontSize: 18,
    color: '#181725',
  },
  menuArrow: {
    fontSize: 24,
    color: '#181725',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 19,
    paddingVertical: 20,
    marginTop: 20,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#53B175',
  },
  cartHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181725',
    textAlign: 'center',
  },
  cartScroll: {
    flex: 1,
  },
  cartContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyCartIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#53B175',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 19,
  },
  shopNowButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  cartItemImage: {
    fontSize: 60,
    marginRight: 16,
  },
  cartItemImageReal: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 4,
  },
  cartItemSize: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 12,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartQuantityButton: {
    width: 40,
    height: 40,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cartQuantityButtonText: {
    fontSize: 20,
    color: '#7C7C7C',
  },
  cartQuantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginHorizontal: 16,
  },
  cartItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  cartRemoveButton: {
    padding: 4,
  },
  cartRemoveIcon: {
    fontSize: 20,
    color: '#7C7C7C',
  },
  cartItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181725',
  },
  cartFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#53B175',
    borderRadius: 19,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#A0D4B4',
    opacity: 0.7,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  checkoutBadge: {
    backgroundColor: '#489E67',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  checkoutBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  shopScroll: {
    flex: 1,
  },
  shopContent: {
    paddingBottom: 100,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  shopLogo: {
    fontSize: 30,
    marginRight: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#181725',
    fontWeight: '600',
  },
  banner: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 120,
  },
  bannerImage: {
    borderRadius: 12,
  },
  bannerOverlay: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 4,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#53B175',
    marginBottom: 12,
    fontWeight: '600',
  },
  bannerDots: {
    flexDirection: 'row',
    gap: 6,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  bannerDotActive: {
    backgroundColor: '#53B175',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181725',
  },
  seeAllText: {
    fontSize: 14,
    color: '#53B175',
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  productCardHorizontal: {
    width: 150,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  productCardTouchable: {
    width: '100%',
  },
  productImageSmall: {
    width: 150,
    height: 120,
    marginBottom: 12,
    alignSelf: 'center',
  },
  productNameSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 4,
  },
  productSizeSmall: {
    fontSize: 12,
    color: '#7C7C7C',
    marginBottom: 12,
  },
  productFooterSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPriceSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181725',
  },
  addButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonTextSmall: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  groceryCard: {
    width: 200,
    backgroundColor: '#FFF3E6',
    borderRadius: 18,
    padding: 16,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groceryIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  groceryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loginContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loginLogoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  loginLogo: {
    fontSize: 80,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 40,
  },
  loginInputSection: {
    marginBottom: 30,
  },
  loginInputLabel: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 8,
  },
  loginInput: {
    fontSize: 16,
    color: '#181725',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  loginPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  loginPasswordInput: {
    flex: 1,
    fontSize: 16,
    color: '#181725',
    paddingVertical: 12,
  },
  passwordEyeIcon: {
    fontSize: 20,
    padding: 8,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#181725',
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#181725',
    textAlign: 'center',
  },
  loginLinkTextBold: {
    color: '#53B175',
    fontWeight: '600',
  },
  locationContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  locationHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  locationBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  locationBackIcon: {
    fontSize: 36,
    color: '#181725',
  },
  locationScroll: {
    flex: 1,
  },
  locationContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  locationMapContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  locationMapBg: {
    width: 200,
    height: 150,
    backgroundColor: '#F2F3F2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationMapText: {
    fontSize: 80,
  },
  locationMapIcon: {
    fontSize: 80,
    position: 'absolute',
    top: 20,
    zIndex: 1,
  },
  locationTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#181725',
    textAlign: 'center',
    marginBottom: 12,
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 80,
  },
  locationInputSection: {
    width: '100%',
    marginBottom: 30,
  },
  locationInputLabel: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 12,
  },
  locationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  locationDropdownText: {
    fontSize: 16,
    color: '#181725',
  },
  locationPlaceholder: {
    color: '#7C7C7C',
  },
  locationDropdownArrow: {
    fontSize: 20,
    color: '#181725',
  },
  locationSubmitButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  locationSubmitText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  orderAcceptedContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },
  orderAcceptedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  orderAcceptedIconContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  orderAcceptedCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderAcceptedCheck: {
    fontSize: 100,
    color: '#FFF',
    fontWeight: 'bold',
  },
  orderAcceptedDecoration: {
    position: 'absolute',
    width: 250,
    height: 250,
    top: -25,
    left: -25,
  },
  orderDecor1: {
    position: 'absolute',
    top: 20,
    left: 40,
    fontSize: 20,
    color: '#53B175',
  },
  orderDecor2: {
    position: 'absolute',
    top: 10,
    right: 60,
    fontSize: 16,
    color: '#FFA500',
  },
  orderDecor3: {
    position: 'absolute',
    top: 60,
    right: 10,
    fontSize: 24,
    color: '#FF6B6B',
  },
  orderDecor4: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    fontSize: 14,
    color: '#E6F2EA',
  },
  orderDecor5: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 18,
    color: '#9B59B6',
  },
  orderDecor6: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    fontSize: 20,
    color: '#F1C40F',
  },
  orderAcceptedTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#181725',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  orderAcceptedSubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 22,
  },
  orderAcceptedButtons: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  trackOrderButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackOrderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backToHomeButton: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToHomeText: {
    color: '#181725',
    fontSize: 18,
    fontWeight: '600',
  },
  // Order Failed Styles
  orderFailedContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },
  orderFailedCloseButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  orderFailedCloseIcon: {
    fontSize: 24,
    color: '#181725',
  },
  orderFailedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  orderFailedIconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  orderFailedCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#C8F4DD',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  orderFailedBagIcon: {
    fontSize: 80,
  },
  orderFailedVeggies: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  veggie1: {
    position: 'absolute',
    top: 20,
    left: 30,
    fontSize: 28,
    transform: [{ rotate: '-15deg' }],
  },
  veggie2: {
    position: 'absolute',
    top: 30,
    right: 20,
    fontSize: 32,
    transform: [{ rotate: '20deg' }],
  },
  veggie3: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    fontSize: 30,
    transform: [{ rotate: '-10deg' }],
  },
  veggie4: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 26,
    transform: [{ rotate: '15deg' }],
  },
  orderFailedTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#181725',
    textAlign: 'center',
    marginBottom: 12,
  },
  orderFailedSubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
  },
  orderFailedButtons: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pleaseTryAgainButton: {
    width: '100%',
    height: 56,
    borderRadius: 19,
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pleaseTryAgainText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backToHomeButtonFailed: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToHomeTextFailed: {
    color: '#181725',
    fontSize: 18,
    fontWeight: '600',
  },
});
