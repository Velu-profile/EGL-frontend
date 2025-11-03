import axiosInstance from './axiosInstance';
import { Budget, Expense } from '../_types';

export const useApiService = () => {
  const getBudgets = async (): Promise<Budget[]> => {
    const response = await axiosInstance.get('/budgets/');
    return response.data;
  };

  const getExpenses = async (): Promise<Expense[]> => {
    const response = await axiosInstance.get('/expenses/');
    return response.data;
  };


  return {
    getBudgets,
    getExpenses,
  };
};
