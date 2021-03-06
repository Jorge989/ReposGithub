import React, { useState, useCallback,useEffect } from "react";
import { Container, Form, SubmitButton,List,DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner ,FaBars,FaTrash} from "react-icons/fa";
import api from "../../service/api";
import {Link} from 'react-router-dom'
export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [respositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //Buscar

useEffect(()=>{
    const repoStorage = localStorage.getItem('repos');
    if(repoStorage){
        setRepositorios(JSON.parse(repoStorage));
    }
}, [])



  //Salvar alterações
  useEffect(()=>{
      localStorage.setItem('repos',JSON.stringify(respositorios));
  }, [respositorios]);




  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit() {
      setLoading(true);
      setAlert(null);
      try {
if(newRepo ===''){
    throw new Error("Você precisa indicar um repositorio !");
}
const response = await api.get(`repos/${newRepo}`);
const hasRepo = respositorios.find(repo => repo.name === newRepo);
if(hasRepo){
    throw new Error("Repositorio Duplicado")
}

     
        const data = {
          name: response.data.full_name,
        };

        setRepositorios([...respositorios, data]);
        setNewRepo('');
      } catch (error) {
        setAlert(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    submit();
  }, [newRepo, respositorios]);

  function handleinputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

const handleDelete  = useCallback((repo) =>{
const find = respositorios.filter(r => r.name !== repo);
setRepositorios(find);
},[respositorios])

  return (
    <Container>
      <FaGithub size={25} />
      <h1>Meus Repos</h1>
      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar Repositórios"
          placeholder="Adicionar repositorios"
          value={newRepo}
          onChange={handleinputChange}
        />
        <SubmitButton Loading={loading ? 1 : 0}>
            {loading ? (
                <FaSpinner color="#fff" size={14}/>
            ):(
               
          <FaPlus color="#FFF" size={14} />
            )}
        </SubmitButton>
      </Form>
      <List>
          {respositorios.map(repo =>(
              <li key={repo.name}>
                  <span>
                    <DeleteButton 
                     onClick={()=> handleDelete(repo.name)} >
                        <FaTrash size={24}/>
                        </DeleteButton>  
                      
                      {repo.name}</span>
                  <Link to={`/repositories/${encodeURIComponent(repo.name)}`}>
                      <FaBars size={20}/>
                  </Link>
              </li>
          ))}
      </List>
    </Container>
  );
}