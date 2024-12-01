document.getElementById("loginForm").addEventListener("submit", handleFormSubmit);

const notas = document.getElementById("notas");

async function handleFormSubmit(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const loginData = await loginUser(username, password);
    const verificationResult = await verifyToken(loginData.token);
    const notes = await getNotes(loginData.token);

    notas.innerHTML = '';
    console.log(notes); // Depurar el contenido de las notas
    notes.forEach(note => { 
      const noteElement = document.createElement("h2");
      const text = document.createTextNode(note.note);
      noteElement.appendChild(text);
      notas.appendChild(noteElement); // Usar appendChild para agregar elementos al DOM
    });

  } catch (error) {
    console.error('Error:', error);
  }
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

// TODO Añadir la opción de poder añadir notas desde el cliente