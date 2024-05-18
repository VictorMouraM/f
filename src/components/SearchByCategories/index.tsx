'use client'
import api from '@/services/api';
import { CategoriesType } from '@/src/types/categories';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Select } from './styles';

interface SearchByCategoryProps {
    setCategoryId: Dispatch<SetStateAction<number | undefined>>;
    transactionType: 'debit' | 'receipt'
}

const SearchByCategory = ({ setCategoryId, transactionType }: SearchByCategoryProps) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>();
  const [categories, setCategories] = useState<CategoriesType[]>();
  const listCategories = useCallback(async (id: string | null | undefined) =>  {
    try {
      setLoading(true);
      const response = await api.get(`/categories?user_id=${id}&type=${transactionType}`);
      setCategories(response.data)
    } catch {
      toast.error("Erro ao buscar dívidas...")
    } finally {
      setLoading(false);
    }
  }, [transactionType]);
  useEffect(() => {
    const user_id = localStorage.getItem("@finsys:user_id");
    setUserId(user_id)
    listCategories(user_id)
  }, [userId, listCategories]);
  if(loading) return <div>Carregando...</div>
  return (
    <Select onChange={(evt) => setCategoryId(Number(evt.target.value))}>
      {categories?.map((category) => (
        <option key={category.id} value={category.id}>
            {category.title}
        </option>
        ))}
    </Select>
  );
};

export default SearchByCategory;