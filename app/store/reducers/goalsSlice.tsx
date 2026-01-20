// store/slices/goalsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  color: string;
  deadline?: string;
  icon?: string;
  createdAt: string;
}


interface FinancialSetting {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
  type?: 'income' | 'autoSave' | 'tips' | 'alerts';
}

interface GoalsState {
  goals: Goal[];
  financialSettings: FinancialSetting[];
  monthlyIncome: number;
  autoSavePercentage: number;
  investmentTipsFrequency: 'daily' | 'weekly' | 'monthly' | 'none';
  budgetAlertsEnabled: boolean;
}

const initialState: GoalsState = {
  goals: [
    {
      id: '1',
      name: 'Emergency Fund',
      target: 100000,
      saved: 25000,
      color: '#F97316',
      deadline: '2024-12-31',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Vacation Trip',
      target: 50000,
      saved: 15000,
      color: '#22D3EE',
      deadline: '2024-06-30',
      createdAt: '2024-01-15',
    },
    {
      id: '3',
      name: 'New Laptop',
      target: 80000,
      saved: 40000,
      color: '#86EFAC',
      deadline: '2024-09-30',
      createdAt: '2024-02-01',
    },
  ],
  financialSettings: [
    {id: '1', label: 'Monthly Income', value: '₹13,000', enabled: true, type: 'income'},
    {id: '2', label: 'Auto Savings', value: '20%', enabled: true, type: 'autoSave'},
    {id: '3', label: 'Investment Tips', value: 'Weekly', enabled: true, type: 'tips'},
    {id: '4', label: 'Budget Alerts', value: 'On', enabled: true, type: 'alerts'},
  ],
  monthlyIncome: 13000,
  autoSavePercentage: 20,
  investmentTipsFrequency: 'weekly',
  budgetAlertsEnabled: true,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Omit<Goal, 'id' | 'createdAt'>>) => {
      const newGoal: Goal = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.goals.push(newGoal);
    },
    
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.goals.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    
    addFundsToGoal: (state, action: PayloadAction<{goalId: string; amount: number}>) => {
      const goal = state.goals.find(g => g.id === action.payload.goalId);
      if (goal) {
        goal.saved = Math.min(goal.saved + action.payload.amount, goal.target);
      }
    },
    
    updateFinancialSetting: (state, action: PayloadAction<{id: string; value?: string; enabled?: boolean}>) => {
      const setting = state.financialSettings.find(s => s.id === action.payload.id);
      if (setting) {
        if (action.payload.value !== undefined) setting.value = action.payload.value;
        if (action.payload.enabled !== undefined) setting.enabled = action.payload.enabled;
        
        // Update corresponding state
        if (setting.type === 'income') {
          const incomeValue = action.payload.value?.replace(/[^0-9]/g, '');
          state.monthlyIncome = incomeValue ? parseInt(incomeValue) : state.monthlyIncome;
        } else if (setting.type === 'autoSave') {
          const percentage = action.payload.value?.replace(/[^0-9]/g, '');
          state.autoSavePercentage = percentage ? parseInt(percentage) : state.autoSavePercentage;
        } else if (setting.type === 'tips') {
          const tipsMap: Record<string, 'daily' | 'weekly' | 'monthly' | 'none'> = {
            'Daily': 'daily',
            'Weekly': 'weekly',
            'Monthly': 'monthly',
            'None': 'none',
          };
          state.investmentTipsFrequency = tipsMap[action.payload.value || 'Weekly'] || 'weekly';
        } else if (setting.type === 'alerts') {
          state.budgetAlertsEnabled = action.payload.enabled ?? setting.enabled;
        }
      }
    },
    
    updateMonthlyIncome: (state, action: PayloadAction<number>) => {
      state.monthlyIncome = action.payload;
      // Update the financial setting value
      const incomeSetting = state.financialSettings.find(s => s.type === 'income');
      if (incomeSetting) {
        incomeSetting.value = `₹${action.payload.toLocaleString()}`;
      }
    },
    
    updateAutoSavePercentage: (state, action: PayloadAction<number>) => {
      state.autoSavePercentage = action.payload;
      const autoSaveSetting = state.financialSettings.find(s => s.type === 'autoSave');
      if (autoSaveSetting) {
        autoSaveSetting.value = `${action.payload}%`;
      }
    },
  },
});

export const {
  addGoal,
  updateGoal,
  deleteGoal,
  addFundsToGoal,
  updateFinancialSetting,
  updateMonthlyIncome,
  updateAutoSavePercentage,
} = goalsSlice.actions;

export default goalsSlice.reducer;