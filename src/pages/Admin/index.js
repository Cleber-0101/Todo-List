import { useState, useEffect } from 'react';
import './admin.css';

import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

export default function Admin() {
  const [tarefaInput, setTarefaInput] = useState('');
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(null);

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas() {
      console.log('Fetching tasks...');
      const userDetail = localStorage.getItem('@detailUser');
      setUser(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const tarefaRef = collection(db, 'tarefas');
        const q = query(
          tarefaRef,
          orderBy('created', 'desc'),
          where('userUid', '==', data?.uid)
        );

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            });
          });

          setTarefas(lista);
        });
      }
    }

    loadTarefas();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();

    if (tarefaInput === '') {
      alert('Digite sua tarefa...');
      return;
    }

    if (edit) {
      handleUpdateTarefa();
    } else {
      await addDoc(collection(db, 'tarefas'), {
        tarefa: tarefaInput,
        created: new Date(),
        userUid: user?.uid,
      })
        .then((docRef) => {
          console.log('TAREFA REGISTRADA');
          setTarefaInput('');
          setTarefas([...tarefas, { id: docRef.id, tarefa: tarefaInput, userUid: user?.uid }]);
        })
        .catch((error) => {
          console.log('ERRO AO REGISTRAR ' + error);
        });
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  function deleteTarefa(id) {
    const docRef = doc(db, 'tarefas', id);
    deleteDoc(docRef)
      .then(() => {
        console.log('TAREFA EXCLUÍDA');
        setTarefas((tarefas) => tarefas.filter((tarefa) => tarefa.id !== id));
      })
      .catch((error) => {
        console.log('ERRO AO EXCLUIR ' + error);
      });
  }

  function editTarefa(item) {
    setTarefaInput(item.tarefa);
    setEdit(item);
  }

  async function handleUpdateTarefa() {
    if (edit) {
      const docRef = doc(db, 'tarefas', edit.id);
      await updateDoc(docRef, {
        tarefa: tarefaInput,
      })
        .then(() => {
          console.log('TAREFA ATUALIZADA');
          setTarefaInput('');
          setEdit(null);
          setTarefas((tarefas) => tarefas.map((tarefa) => tarefa.id === edit.id ? { ...tarefa, tarefa: tarefaInput } : tarefa));
        })
        .catch(() => {
          console.log('ERRO AO ATUALIZAR');
          setTarefaInput('');
          setEdit(null);
        });
    }
  }

  return (
    <div className="admin-container">
      <h1>Ordem no caos </h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite sua tarefa..."
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}
        />

        {edit ? (
          <button className="btn-register" type="button" onClick={handleUpdateTarefa}>
            Atualizar tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar tarefa
          </button>
        )}
      </form>

      {tarefas.map((item) => (
        <article key={item.id} className="list">
          <p>{item.tarefa}</p>

          <div>
            <button onClick={() => editTarefa(item)}>Editar</button>
            <button onClick={() => deleteTarefa(item.id)} className="btn-delete">
              Concluir
            </button>
          </div>
        </article>
      ))}

      <button className="btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
