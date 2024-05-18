'use client'
import React, { useState } from 'react';
import { Container, Content, ErrorMessage, FormContainer } from "../../src/styles/auth/auth.styles";
import Image from 'next/image';
import logo from "../../src/assets/logo.png";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from "../../services/api";
import useLogin from "../../src/hooks/useLogin";
import { toast } from 'react-toastify';


const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [responseErrorMessage, setResponseErrorMessage] = useState("");
  const buttonLabel = isLoading ? "Carregando..." : "Cadastrar";
  const router = useRouter();
  const passwordIsValid = password == confirmPassword;
  const { login } = useLogin();
  const verifyEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email)
  };
  const cleanErrors = () => {
    setHasError(false);
    setPasswordErrorMessage("");
    setEmailErrorMessage("");
    setResponseErrorMessage("");
  };
  const signup = async () => {
    const emailIsValid = verifyEmail(email);
    try {
      setIsLoading(true);
      cleanErrors();
      if(!emailIsValid) {
        setHasError(true);
        setEmailErrorMessage("Email inválido.")
        throw Error();
      }
      if (!passwordIsValid) { 
        setHasError(true);
        setPasswordErrorMessage("As senhas precisam ser compatíveis.");
        throw Error();
      }
      await api.post("/users", {
          username,
          password,
          name,
          last_name,
          birth,
          email,
        },
      );
      await login ({ username, password});
    } catch (err: any) {
      toast.error("Falha ao tentar fazer o cadastro...");
      const userAlreadyExists = err.response?.status == 500;
      const hasEmptyInput = err.response?.status == 400;
      if (userAlreadyExists) 
        setResponseErrorMessage (
          "Já existe um usuário cadastrado com este email ou username"
        );
      if (hasEmptyInput) 
        setResponseErrorMessage (
          "Preencha todos os campos para poder cadastrar"
        );
    } finally{
      setIsLoading(false);
    }
  };
  const inputProps = [
    {
      type: 'text',
      placeholder: 'Nome de usuário',
      setState: setUsername,
      ErrorMessage: ''
    },
    {
      type: 'password',
      placeholder: 'Senha',
      setState: setPassword,
      errorMessage: "",
    },
    {
      type: 'password',
      placeholder: 'Repetir Senha',
      setState: setConfirmPassword,
      errorMessage: passwordErrorMessage,
    },
    {
      type: 'text',
      placeholder: 'Nome',
      setState: setName
    },
    {
      type: 'text',
      placeholder: 'Sobrenome',
      setState: setLastName
    },
    {
      type: 'date',
      placeholder: 'Data de Aniversário',
      setState: setBirth
    },
    {
      type: 'email',
      placeholder: 'Email',
      setState: setEmail,
      errorMessage: emailErrorMessage
    },
  ]
  return(
    <Container>
      <Content>
        <Image src={logo} alt="Finsys" width={130} quality={75} />
        <FormContainer>  
          {inputProps.map((prop) => (
            <>
              <input
                type={prop.type}
                placeholder={prop.placeholder}
                onChange={(evt) => prop.setState(evt.target.value)} 
              />
              <ErrorMessage>{hasError && prop.errorMessage}</ErrorMessage>
            </>
          ))}
        <button onClick={signup}>{buttonLabel}</button>
        <ErrorMessage>{responseErrorMessage}</ErrorMessage>
        <p>
          Já possui uma conta? <Link href={"/signin"}>Entre!</Link>
        </p>   
        </FormContainer>  
      </Content>
    </Container>
  );
} 

export default Signup;