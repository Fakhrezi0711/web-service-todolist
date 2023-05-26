# Web Service & RESTful API for ToDoList Application

Beberapa Jenis API yang bisa digunakan di Web Service ini antara lain;

- app.post('/register')-> Untuk melakukan register akun (nama, email, password)
- app.post('/login') -> Untuk Login akun dan mengahasilkan Json Web Token (email, password)
- app.post('/todos') -> Untuk membuat list To Do baru dan required Json Web Token (title, description, userId)
- app.get('/todos') -> Untuk melihat semua To Do List dan required Json Web Token
- app.get('/todos/:id')-> Untuk melihat detail To Do sesuai dengan id To Do yang ditulis dan required Json Web Token
- app.put('/todos/:id') -> Untuk meng-edit To Do sesuai dengan id To Do yang ditulis dan required Json Web Token (title, description)
- app.delete('/todos/:id)-> Untuk menghapus To Do sesuai dengan id To Do yang ditulis dan required Json Web Token
- app.delete('/todos')-> Untuk menghapus semua To Do app.delete dan required Json Web Token
