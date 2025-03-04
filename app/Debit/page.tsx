'use client'
import TableContainer from "@/src/components/TableContainer"
import { Container } from "../global"
import TableDetails from "@/src/components/TableDetails"
import TableLine from "@/src/components/TableLine"
import { useCallback, useEffect, useState } from "react";
import TableNavbar from "@/src/components/TableNavbar"
import api from "@/services/api"
import { toast } from "react-toastify"
import { CategoriesType } from "@/src/types/categories"
import SearchType from "@/src/types/search"
import { TransactionsType } from "@/src/types/transaction"
import { addDays, isSameDay } from "date-fns"

const Debit = () => {
  const [userId, setUserId] = useState<string | null>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState<number>();
  const [categoryId, setCategoryId] = useState(0);
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [debits, setDebits] = useState<TransactionsType[]>([]);
  const listDebitCategories = useCallback(
    async (id: string | null | undefined) =>  {
      try {
        setLoading(true);
        const response = await api.get(`/categories?user_id=${id}&type=debit`);
        setCategories(response.data)
      } catch {
        toast.error("Erro ao buscar categorias...")
      } finally {
        setLoading(false);
      }
    }, 
    []
  );
  const listDebit = useCallback(
    async (id: string | null | undefined) =>  {
      try {
        setLoading(true);
        const response = await api.get(`/accounts?user_id=${id}&type=debit`);
        setDebits(response.data)
      } catch {
        toast.error("Erro ao buscar dívidas...")
      } finally {
        setLoading(false);
      }
    }, 
    []
  );
  useEffect(() => {
    const user_id = localStorage.getItem("@finsys:user_id");
    setUserId(user_id);
    listDebit(user_id);
    listDebitCategories(user_id);
  }, [userId, listDebit, listDebitCategories]);
  const createDebitHandler = useCallback(async () =>  {
    try {
      await api.post("/accounts", {
        user_id: Number(userId),
        title,
        description,
        value,
        category_id: categoryId,
        date: new Date(),
        type: "debit",
      });
      listDebit(userId)
      toast.success("Dívida adicionada com sucesso!")
    } catch {
      toast.error("Erro ao adicionar dívida...")
    }
  }, [categoryId, description, listDebit, title, userId, value]);
  const dateCompare = () => {
    const itemsWithSameDate = debits.filter((currentItem) => {
      const formattedDate = addDays(new Date(searchText), 1)
      return isSameDay(new Date(currentItem.date), new Date(formattedDate));
    });
    setDebits(itemsWithSameDate);
  };
  if (loading) return <div>Carregando...</div>
  return (
    <Container>
    <TableContainer>
      <TableNavbar 
        title="Nova dívida" 
        pageType="transaction"
        transactionType="debit"
        buttonTitle="Adicionar dívida" 
        setCategoryId={setCategoryId}
        value={value}
        setValue={setValue}
        categories={categories}
        itemTitle={title}
        description={description}
        setTitle={setTitle} 
        categoryId={categoryId}
        setDescription={setDescription} 
        onSubmit={createDebitHandler}
        searchText = {searchText}
        setSearchText = {setSearchText}
        searchType = {searchType}
        setSearchType = {setSearchType}
        loadItems={setDebits}
        setLoading={setLoading}
        dateCompare={dateCompare}
      />
      <TableDetails pageType="transaction">
        {debits.map((debit) => (
        <TableLine 
          key={debit.id} 
          endpoint={`/accounts/${debit.id}`}
          title={debit.title} 
          description={debit.description} 
          date={debit.date}
          value={debit.value}
          categoryTitle={debit.category_title.String}
          listCategories={listDebit}
          editSucessMessage= "Dívida editada com sucesso!"
          editErrorMessage = "Erro ao tentar editar a dívida..."
          deleteSucessMessage = "Dívida deletada com sucesso!"
          deleteErrorMessage = "Erro ao tentar deletar a dívida..."
          pageType="transaction"
          payload={{
            // user_id: Number(userId),
            id: debit.id,
            title: "",
            description: "",
            // type: "debit",
          }}
        />
        ))}
      </TableDetails>  
    </TableContainer>
    </Container>    
  )
}

export default Debit;