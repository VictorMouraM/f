'use client'
import Image from "next/image";
import { ButtonsContainer, Container } from "./styles";
import deleteIcon from "../../assets/delete.png"
import Modal from "../Modal";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import api from "@/services/api";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface EditItemProps {
  // user_id: number;
  id: number;
  title: string;
  description: string;
  // type: "receipt" | "debit";
}

interface TableLineProps {
    title: string;
    date?: string;
    value?: number;
    categoryTitle?: string;
    editSucessMessage: string;
    editErrorMessage: string;
    deleteSucessMessage: string;
    deleteErrorMessage: string;
    description: string;
    payload: EditItemProps;
    endpoint: string;
    pageType: 'category' | 'transaction';
    listCategories: (id: string | null | undefined) => Promise<void>;
}

const TableLine = ({
  title, 
  description, 
  date,
  value,
  categoryTitle,
  listCategories, 
  payload,
  editSucessMessage,
  editErrorMessage,
  deleteSucessMessage,
  deleteErrorMessage,
  endpoint,
  pageType,
}: TableLineProps) => {
  const [editingTitle, setEditingTitle] = useState(title)
  const [editingDescription, setEditingDescription] = useState(description);
  const [editingValue, setEditingValue] = useState(value);
  const isTransaction = pageType === 'transaction';
  const deleteItemHandler = async() => {
    const user_id = localStorage.getItem("@finsys:user_id");
    try {
      await api.delete(endpoint);
        listCategories(user_id);
        toast.success(deleteSucessMessage);
    } catch {
      toast.error(deleteErrorMessage);
    }
  }
  const editItemHandler = useCallback(async () =>  {
    try {
      const user_id = localStorage.getItem("@finsys:user_id");
      await api.put(endpoint, {
        ...payload, 
        title: editingTitle, 
        description: editingDescription,
        value: editingValue,
      }); 
      listCategories(user_id);
      toast.success(editSucessMessage);
    } catch {
      toast.error(editErrorMessage);
    }
  }, [ 
   endpoint, 
   payload, 
   editingTitle, 
   editingDescription, 
   listCategories, 
   editSucessMessage, 
   editErrorMessage,
   editingValue,
  ]);
  const formattedValue = value?.toLocaleString("pt-br", {style: "currency", currency: "BRL"});
  const formattedDate = isTransaction && date ? format(new Date(date), "dd/MM/YYYY") : '';
  return (
    <Container>
      <span>{title}</span>
      <span>{description}</span>
      {isTransaction && (
        <>
          <span>{categoryTitle}</span>
          <span>{formattedDate}</span>
          <span>{formattedValue}</span>
        </>
      )}
      <ButtonsContainer>
        <Modal
          isEditing
          pageType={pageType}
          title="Editar categoria"
          buttonTitle="Editar categoria"
          editingTitle={editingTitle}
          editingDescription={editingDescription}
          editingValue={editingValue}
          setTitle={setEditingTitle} 
          setDescription={setEditingDescription}
          onSubmit={editItemHandler}
          value={value}
          setValue={setEditingValue}
        />
        <Image src={deleteIcon} alt="" width={24} onClick={deleteItemHandler}/>
      </ButtonsContainer>
    </Container>
  );
};

export default TableLine;