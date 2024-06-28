import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import { Typography, Box, TextField, IconButton, Select, MenuItem } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { toast } from 'react-toastify';
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';


import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const BASE_URL = "http://localhost:5000";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Home = () => {

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showValidationError, setshowValidationError] = useState(false);
  const [openBookForm, setOpenBookForm] = useState(false);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [openIssueDialog, setOpenIssueDialog] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadBooks();
    loadUsers();
  }, [])

  const loadBooks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/books`);
      if (response.data) {
        setBooks(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addBook = async () => {
    try {
      if (!name || !author) {
        setshowValidationError(true);
        return;
      }
      const response = await axios({
        method: "POST",
        url: `${BASE_URL}/books`,
        data: JSON.stringify({ name, author }),
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`
        }
      });
      if (response.data) {
        setBooks([...books, response.data]);
        toast.success("Book added successfully");
      }
    } catch (error) {
      toast.error(error.msg);
    }finally{
      clearForm();
      setOpenBookForm(false);
    }
  }

  const deleteBook = async (id) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${BASE_URL}/books/${id}`,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`
        }
      });
      if (response.data) {
        loadBooks();
        toast.success(response.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.msg);
    }finally{
      clearForm();
      setOpenBookForm(false);
    }
  }

  const updateBook = async () => {
    try {
      if (!name || !author) {
        setshowValidationError(true);
        return;
      }
      const response = await axios({
        method: "put",
        url: `${BASE_URL}/books/${bookId}`,
        data: JSON.stringify({ name, author }),
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`
        }

      });
      if (response.data) {
        loadBooks();
        toast.success("Book updated successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.msg);
    }finally{
      clearForm();
      setOpenBookForm(false);
    }
  }

  const issueBook = async () => {
    try {
      const response = await axios({
        method: "post",
        url: `${BASE_URL}/transactions/issue`,
        data: JSON.stringify({ userId, bookId, dueDate }),
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`
        }

      });
      if (response.data) {
        loadBooks();
        toast.success("Book issued successfully.");
      }
    } catch (error) {
      toast.error(error.msg);
    }finally{
      clearForm();
      setOpenIssueDialog(false);
    }
  }

  const returnBook = async (id) => {
    try {
      const response = await axios({
        method: "post",
        url: `${BASE_URL}/transactions/return`,
        data: JSON.stringify({bookId:id }),
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`
        }

      });
      if (response.data) {
        loadBooks();
        toast.success("Book returned successfully.");
      }
    } catch (error) {
      toast.error(error.msg);
    }
  }

  const clearForm = () => {
    setBookId("");
    setAuthor("");
    setName("");
    setUserId("");
    setDueDate("");
  }

  return (
    <div>
      <Header />
      <Box sx={{ mt: 8, maxWidth: "100%" }}>
        <Dialog open={openBookForm} onClose={() => setOpenBookForm(false)}>
          <DialogTitle>{bookId ? "Update Book" : "Add Book"}</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
            <TextField
              size="small"
              label="Name"
              fullWidth
              type="text"
              onChange={(e) => {
                setshowValidationError(false);
                setName(e.target.value);
              }}
              value={name}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Author"
              fullWidth
              value={author}
              type="text"
              onChange={(e) => {
                setshowValidationError(false);
                setAuthor(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              clearForm();
              setOpenBookForm(false)}}>Cancel</Button>
            <Button onClick={() => bookId ? updateBook() : addBook()}>{bookId ? "Update Book" : "Add Book"}</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openIssueDialog} onClose={() => setOpenIssueDialog(false)}>
          <DialogTitle>Issue Book</DialogTitle>
          <DialogContent>
            
            <Select
              fullWidth
              size="small"
              label="User"
              type="text"
              onChange={(e) => {
                setUserId(e.target.value);
              }}
              sx={{ mt: 2 }}
            >
              {users && users.map(user=> <MenuItem value={user._id}>{user.name}</MenuItem>)}

            </Select>
            <TextField fullWidth sx={{mt: 1}} type="date" label="Due Date" onChange={e=> setDueDate(e.target.value)} size="small" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              clearForm();
              setOpenIssueDialog(false)}}>Cancel</Button>
            <Button onClick={() => issueBook()}>Issue Book</Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ display: "block", justifyContent: "center", alignItems: "center", padding: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
            <Typography sx={{ fontSize: 25 }}>Books</Typography>
            <Button variant='outlined' disabled={role!="ADMIN"} onClick={() => setOpenBookForm(true)}>Add Book</Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Book Id</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Author</StyledTableCell>
                    <StyledTableCell align="right">Availability Status</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                    <StyledTableCell align="right">Issue/Return</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books &&
                    books.map((row) => (
                      <StyledTableRow key={row._id}>
                        <StyledTableCell component="th" scope="row">
                          {row._id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.author}
                        </StyledTableCell>
                        <StyledTableCell align="right">{row.isAvailable ? "Yes" : "No"}</StyledTableCell>
                      <StyledTableCell align="right">
                        <IconButton disabled={role!="ADMIN"}>
                        <DeleteIcon
                          sx={{ cursor: "pointer", ml: 2 }}
                          onClick={() => deleteBook(row._id)}
                        />
                        </IconButton>

                        <IconButton disabled={role!="ADMIN"}>
                        <EditIcon
                          sx={{ cursor: "pointer", ml: 2 }}
                          onClick={() => {
                            setBookId(row._id);
                            setAuthor(row.author);
                            setName(row.name);
                            setOpenBookForm(true)
                          }}
                        />
                        </IconButton>
                       
                        
                      </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.isAvailable ? <Button onClick={()=> {
                            setBookId(row._id);
                            setOpenIssueDialog(true)}} disabled={role!="ADMIN"} variant='outlined'>Issue</Button>: <Button onClick={()=> returnBook(row._id)} disabled={role!="ADMIN"} variant='outlined'>Return</Button>}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

      </Box>
    </div>
  )
}

export default Home