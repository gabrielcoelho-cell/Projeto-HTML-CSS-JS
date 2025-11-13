// frontend/src/pages/ProjectDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Supondo que você use React Router

function ProjectDetails() {
  const { id } = useParams(); // Pega o ID do projeto na URL (ex: /projects/1)
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os detalhes do projeto no novo endpoint
    fetch(`http://localhost:5000/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do projeto:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center p-5">Carregando detalhes...</div>;
  }
  
  if (!project) {
    return <div className="text-center p-5">Projeto não encontrado.</div>;
  }

  return (
    // Criação da página de detalhes de serviços/produtos 
    <div className="container p-4">
      <h1 className="mb-3">Detalhes do Projeto: {project.title}</h1>
      <div className="card shadow">
        <div className="card-body">
          <p><strong>ID:</strong> {project.id}</p>
          <p><strong>Status:</strong> <span className={`badge bg-${project.status === 'Concluído' ? 'success' : 'warning'}`}>{project.status}</span></p>
          <hr />
          <h3>Descrição</h3>
          <p>{project.description || 'Nenhuma descrição fornecida.'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;