//TODO Añadir opción para eliminar las notas
//TODO Añadir opción para editar las notas

document.getElementById("loginForm").addEventListener("submit", handleFormSubmit);
document.getElementById("registerForm").addEventListener("submit", handleFormRegister)
document.getElementById("notesForm").addEventListener("submit", handleNotesForm)
const username = document.getElementById("username");
const password = document.getElementById("password");

const notas = document.getElementById("note");
const noteForm = document.getElementById("notas")

async function handleFormRegister(e) {
  e.preventDefault()

  try {
    const registerData = await registerUser(username.value, password.value)


    const registro = document.createElement("h4")
    const registroMsg = document.createTextNode(registerData.result)

    noteForm.innerHTML = ``
    registro.appendChild(registroMsg)

    noteForm.appendChild(registro)
  } catch(error) {
    console.error(error)
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  try {
    const loginData = await loginUser(username.value, password.value);
    const verificationResult = await verifyToken(loginData.token);


    localStorage.setItem("jwt", loginData.token)
    
    mostrarNotas(loginData.token)

  } catch (error) {
    const noteError = document.createElement("h3")
    const textError = document.createTextNode("Error al iniciar sesión")

    noteError.appendChild(textError)
    noteForm.appendChild(noteError)
  }

  username.value = ""
  password.value = ""
}

async function loginUser(username, password) {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error('Error en el inicio de sesión');
  }
  
  return await response.json();
}

async function verifyToken(token) {
  const response = await fetch("http://localhost:3000/verifyToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });

  if (!response.ok) {
    throw new Error('Error verificando el token');
  }
  
  return await response.json();
}

async function getNotes(token) {
  const response = await fetch("http://localhost:3001/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al obtener las notas");
  }

  return await response.json();
}

async function registerUser(username, password) {
  const response = await fetch("http://localhost:3000/register", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({ username, password })
  })

  if(!response.ok) {
    return await response.json()
  }

  return await response.json()
}

async function handleNotesForm(e) {
  e.preventDefault(); // Asegúrate de prevenir el comportamiento por defecto del formulario

  const token = localStorage.getItem("jwt");
  const dataToken = await verifyToken(token);

  if(notas.value === "") {
    alert("Introduce una nota válida")
    return false
  } else {
    if (dataToken.valid) {
      const response = await fetch("http://localhost:3001/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          "user": dataToken.username,
          "note": notas.value
        })
      });
  
      if (response.ok) {
        console.log("Nota guardada exitosamente");
        mostrarNotas(token); // Actualizar las notas después de guardar
        notas.value = ""
      } else {
        console.error("Error al guardar la nota:", response.statusText);
      }
    } else {
      alert("No se ha podido guardar la nota, pruebe a iniciar sesión nuevamente");
    }
  }

}


document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt")

  if(token) {
    mostrarNotas(token)
  }

})

async function mostrarNotas(token) {
  const notes = await getNotes(token);

  noteForm.innerHTML = '';
  console.log(notes)
  if(notes.length === 0) {
    const noteElement = document.createElement("p")
    const text = document.createTextNode("No hay notas guardadas")

    noteElement.appendChild(text)

    noteForm.appendChild(noteElement)
  } else {
    notes.forEach(note => { 
      const noteElement = document.createElement("h2");
      const text = document.createTextNode(note.note);
      noteElement.appendChild(text);
      noteForm.appendChild(noteElement);

    });
  }
}
