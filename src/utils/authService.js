import credentials from '../data/credentials.json';

const authService = {
  // Validate login credentials against JSON data
  validateLogin: (email, password) => {
    console.log('Attempting login with:', email);
    console.log('Available users:', credentials.users.map(u => u.email));
    
    const user = credentials.users.find(
      u => u.email.trim() === email.trim() && u.password === password
    );

    if (user) {
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        loginTime: Date.now()
      };
      
      console.log('Login successful:', userData);
      return {
        success: true,
        user: userData
      };
    }

    console.log('Login failed');
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const savedUser = localStorage.getItem('dashboardUser');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        return null;
      }
    }
    return null;
  },

  // Save user to localStorage
  saveUser: (user) => {
    localStorage.setItem('dashboardUser', JSON.stringify(user));
  },

  // Logout - remove user from localStorage
  logout: () => {
    localStorage.removeItem('dashboardUser');
  },

  // Update user profile
  updateUserProfile: (updates) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        ...updates,
        updatedAt: Date.now() 
      };
      authService.saveUser(updatedUser);
      return updatedUser;
    }
    return null;
  }
};

export default authService;
    