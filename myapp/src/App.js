import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import './App.css';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';

const App = () => {

  const [todo, setTodo] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'ToDo', field: 'content' },
  ]

  useEffect(() => {
    axios.get(`http://localhost:3001/todo`)
      .then(res => {
        const todos = res.data;
        setTodo(todos);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = []
    if (newData.content === "") {
      errorList.push("Try Again, You didn't enter the content field")
    }

    if (errorList.length < 1) {
      axios.put(`http://localhost:3001/todo/${newData.id}`, newData)
        .then(response => {
          const updateUser = [...todo];
          const index = oldData.tableData.id;
          updateUser[index] = newData;
          setTodo([...updateUser]);
          resolve()
          setIserror(false)
          setErrorMessages([])
        })
        .catch(error => {
          setErrorMessages(["Update failed! Server error"])
          setIserror(true)
          resolve()

        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
  }


  //function for deleting a row
  const handleRowDelete = (oldData, resolve) => {
    axios.delete(`http://localhost:3001/todo/${oldData.id}`)
      .then(response => {
        const dataDelete = [...todo];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setTodo([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  //function for adding a new row to the table
  const handleRowAdd = (newData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.content === "") {
      errorList.push("Try Again, You didn't enter the content field")
    }

    if (errorList.length < 1) {
      axios.post(`http://localhost:3001/todo`, newData)
        .then(response => {
          let newUserdata = [...todo];
          newUserdata.push(newData);
          setTodo(newUserdata);
          resolve()
          setErrorMessages([])
          setIserror(false)
        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }


  return (
    <div className="app">
      <h1>TO DO App</h1> <br /><br />

      <MaterialTable
        title="To Do List"
        columns={columns}
        data={todo}
        options={{
          header: false,
          headerStyle: { borderBottomColor: 'purple', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1,
          search: false
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);

            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve)
            }),
        }}
      />

      <div>
        {iserror &&
          <Alert severity="error">
            <AlertTitle>ERROR</AlertTitle>
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>
            })}
          </Alert>
        }
      </div>

    </div>
  );
}

export default App;