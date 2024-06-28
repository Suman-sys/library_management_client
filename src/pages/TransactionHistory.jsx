import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import { Typography, Box } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";

const BASE_URL = "http://localhost:5000";

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
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const TransactionHistory = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login-register")
        }
        loadTransactions();
    }, [])

    const loadTransactions = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: `${BASE_URL}/transactions/transaction-history`,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`
                  }
            });
            if (response.data) {
                setBooks(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Header />
            <Box sx={{ display: "block", justifyContent: "center", alignItems: "center", padding: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
                    <Typography sx={{ fontSize: 25 }}>Transactions</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Transaction Id</StyledTableCell>
                                    <StyledTableCell align="right">User Name</StyledTableCell>
                                    <StyledTableCell align="right">Book Name</StyledTableCell>
                                    <StyledTableCell align="right">Due Date</StyledTableCell>
                                    <StyledTableCell align="right">Transaction Type</StyledTableCell>
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
                                                {row.user.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {row.book.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {row.dueDate}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {row.transactionType}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </div>
    )
}

export default TransactionHistory