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

const DebitCategories = () => {
  const [userId, setUserId] = useState<string | null>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoriesType[]>([]);
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
  useEffect(() => {
    const user_id = localStorage.getItem("@finsys:user_id");
    setUserId(user_id)
    listDebitCategories(user_id)
  }, [userId, listDebitCategories]);
  const createCategoryHandle = useCallback(async () =>  {
    try {
      await api.post("/categories", {
        user_id: Number(userId),
        title,
        description,
        type: "debit",
      });
      listDebitCategories(userId)
      toast.success("Categoria criada com sucesso!")
    } catch {
      toast.error("Erro ao criar categoria...")
    }
  }, [title, description, userId, listDebitCategories]);
  if (loading) return <div>Carregando...</div>
  return (
    <Container>
    <TableContainer>
      <TableNavbar 
        title="Nova categoria" 
        pageType="category"
        buttonTitle="Criar categoria" 
        transactionType="debit"
        itemTitle={title}
        description={description}
        setTitle={setTitle} 
        setDescription={setDescription} 
        onSubmit={createCategoryHandle}
        searchText = {searchText}
        setSearchText = {setSearchText}
        searchType = {searchType}
        setSearchType = {setSearchType}
        loadItems={setCategories}
        setLoading={setLoading}
      />
      <TableDetails pageType="category">
        {categories.map((category) => (
        <TableLine 
          key={category.id} 
          endpoint={`/categories/${category.id}`}
          title={category.title} 
          description={category.description} 
          listCategories={listDebitCategories}
          editSucessMessage= "Categoria editada com sucesso!"
          editErrorMessage = "Erro ao tentar editar a categoria..."
          deleteSucessMessage = "Categoria deletada com sucesso!"
          deleteErrorMessage = "Erro ao tentar deletar a categoria..."
          pageType="category"
          payload={{
            // user_id:Number(userId),
            id: category.id,
            title: '',
            description: '',
            // type: "debit",
          }}
        />
        ))}
      </TableDetails>  
    </TableContainer>
    </Container>    
  )
}

export default DebitCategories;