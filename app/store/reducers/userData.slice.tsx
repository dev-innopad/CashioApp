// reducers/userData.slice.tsx
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  isDefault: boolean;
}

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  pin: string; // Encrypted PIN
  monthlyBudget: number;
  categories: Category[];
  isFirstLogin: boolean;
  createdAt: string;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  location?: string;
  receipt?: any;
  notes?: string;
}

interface UserDataState {
  currentUser: User | null;
  users: User[]; // For multiple user support
  expenses: Expense[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserDataState = {
  currentUser: null,
  users: [],
  expenses: [],
  isAuthenticated: false,
  isLoading: false,
};

// Default categories for new users
const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Food',
    icon: '🍔',
    color: '#F97316',
    budget: 5000,
    isDefault: true,
  },
  {
    id: '2',
    name: 'Transport',
    icon: '🚗',
    color: '#22D3EE',
    budget: 3000,
    isDefault: true,
  },
  {
    id: '3',
    name: 'Shopping',
    icon: '🛍️',
    color: '#86EFAC',
    budget: 4000,
    isDefault: true,
  },
  {
    id: '4',
    name: 'Home',
    icon: '🏠',
    color: '#A855F7',
    budget: 8000,
    isDefault: true,
  },
  {
    id: '5',
    name: 'Entertainment',
    icon: '🎬',
    color: '#FF6B6B',
    budget: 2000,
    isDefault: true,
  },
];

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    // User management
    registerUser: (
      state,
      action: PayloadAction<{
        name: string;
        email?: string;
        phone?: string;
        monthlyBudget: number;
        pin: string;
      }>,
    ) => {
      const newUser: User = {
        id: Date.now().toString(),
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
        monthlyBudget: action.payload.monthlyBudget,
        pin: action.payload.pin, // Note: In production, encrypt this!
        categories: [
          ...defaultCategories.map(cat => ({
            ...cat,
            budget: action.payload.monthlyBudget * 0.2, // Distribute budget
          })),
        ],
        isFirstLogin: true,
        createdAt: new Date().toISOString(),
      };

      state.users.push(newUser);
      state.currentUser = newUser;
      state.isAuthenticated = true;
    },

    loginUser: (
      state,
      action: PayloadAction<{
        userId?: string;
        pin: string;
      }>,
    ) => {
      const {userId, pin} = action.payload;

      let user: User | undefined;

      if (userId) {
        // Find by userId
        user = state.users.find(u => u.id === userId);
      } else {
        // Find by PIN (for single user app)
        user = state.users[0];
      }

      if (user && user.pin === pin) {
        state.currentUser = user;
        state.isAuthenticated = true;
        if (user.isFirstLogin) {
          user.isFirstLogin = false;
        }
      }
    },

    logoutUser: state => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };

        // Update in users array too
        const index = state.users.findIndex(
          u => u.id === state.currentUser!.id,
        );
        if (index !== -1) {
          state.users[index] = state.currentUser;
        }
      }
    },

    updateCategory: (
      state,
      action: PayloadAction<{
        categoryId: string;
        updates: Partial<Category>;
      }>,
    ) => {
      if (state.currentUser) {
        const {categoryId, updates} = action.payload;
        const categoryIndex = state.currentUser.categories.findIndex(
          cat => cat.id === categoryId,
        );

        if (categoryIndex !== -1) {
          state.currentUser.categories[categoryIndex] = {
            ...state.currentUser.categories[categoryIndex],
            ...updates,
          };

          // Update in users array
          const userIndex = state.users.findIndex(
            u => u.id === state.currentUser!.id,
          );
          if (userIndex !== -1) {
            state.users[userIndex].categories[categoryIndex] =
              state.currentUser.categories[categoryIndex];
          }
        }
      }
    },

    addCategory: (
      state,
      action: PayloadAction<Omit<Category, 'id' | 'isDefault'>>,
    ) => {
      if (state.currentUser) {
        const newCategory: Category = {
          ...action.payload,
          id: Date.now().toString(),
          isDefault: false,
        };

        state.currentUser.categories.push(newCategory);

        // Update in users array
        const userIndex = state.users.findIndex(
          u => u.id === state.currentUser!.id,
        );
        if (userIndex !== -1) {
          state.users[userIndex].categories.push(newCategory);
        }
      }
    },

    // Expense management
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
      if (!state.currentUser) return;

      const newExpense: Expense = {
        ...action.payload,
        id: Date.now().toString(),
      };

      if (!state.expenses) {
        state.expenses = [];
      }
      state.expenses.push(newExpense);
    },

    updateExpense: (state, action: PayloadAction<Expense>) => {
      if (state.expenses) {
        const index = state.expenses.findIndex(
          exp => exp.id === action.payload.id,
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      }
    },

    deleteExpense: (state, action: PayloadAction<string>) => {
      if (state.expenses) {
        state.expenses = state.expenses.filter(
          exp => exp.id !== action.payload,
        );
      }
    },

    clearAllExpenses: state => {
      state.expenses = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  updateCategory,
  addCategory,
  addExpense,
  updateExpense,
  deleteExpense,
  clearAllExpenses,
  setLoading,
} = userDataSlice.actions;

export default userDataSlice.reducer;
